// script.js
// This file contains the client-side logic for the employee management app.

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';

    // --- Element Selectors ---
    const employeeTableBody = document.getElementById('employee-table-body');
    const departmentTableBody = document.getElementById('department-table-body');
    const employeeModal = document.getElementById('employeeModal');
    const departmentModal = document.getElementById('departmentModal');
    const employeeForm = document.getElementById('employeeForm');
    const departmentForm = document.getElementById('departmentForm');
    const employeeDepartmentSelect = document.getElementById('employeeDepartment');

    // --- State ---
    let departments = [];
    let employees = [];
    let editingEmployeeId = null;
    let editingDepartmentId = null;

    // --- API Functions ---
    const fetchData = async (endpoint) => {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch ${endpoint}:`, error);
            return [];
        }
    };

    const postData = async (endpoint, data) => {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Failed to post to ${endpoint}:`, error);
            return null;
        }
    };
    
    const putData = async (endpoint, id, data) => {
        try {
            const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Failed to update ${endpoint}/${id}:`, error);
            return null;
        }
    };

    const deleteData = async (endpoint, id) => {
        try {
            const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return true;
        } catch (error) {
            console.error(`Failed to delete ${endpoint}/${id}:`, error);
            return false;
        }
    };

    // --- Render Functions ---
    const renderDepartments = () => {
        departmentTableBody.innerHTML = '';
        departments.forEach(dep => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-4 px-4 whitespace-nowrap">${dep.name}</td>
                <td class="py-4 px-4 whitespace-nowrap">${dep.location}</td>
                <td class="py-4 px-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button class="edit-department-btn text-cyan-600 hover:text-cyan-900" data-id="${dep.id}">Edit</button>
                    <button class="delete-department-btn text-red-600 hover:text-red-900" data-id="${dep.id}">Delete</button>
                </td>
            `;
            departmentTableBody.appendChild(row);
        });
        populateDepartmentDropdown();
    };

    const renderEmployees = () => {
        employeeTableBody.innerHTML = '';
        employees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-4 px-4 whitespace-nowrap">${emp.name}</td>
                <td class="py-4 px-4 whitespace-nowrap">${emp.position}</td>
                <td class="py-4 px-4 whitespace-nowrap">${emp.email}</td>
                <td class="py-4 px-4 whitespace-nowrap">${emp.departmentName || 'N/A'}</td>
                <td class="py-4 px-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button class="edit-employee-btn text-cyan-600 hover:text-cyan-900" data-id="${emp.id}">Edit</button>
                    <button class="delete-employee-btn text-red-600 hover:text-red-900" data-id="${emp.id}">Delete</button>
                </td>
            `;
            employeeTableBody.appendChild(row);
        });
    };

    const populateDepartmentDropdown = () => {
        employeeDepartmentSelect.innerHTML = '<option value="">Select a department</option>';
        departments.forEach(dep => {
            const option = document.createElement('option');
            option.value = dep.id;
            option.textContent = dep.name;
            employeeDepartmentSelect.appendChild(option);
        });
    };

    // --- Modal Control ---
    const openModal = (modal) => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };
    const closeModal = (modal) => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    };

    // --- Event Handlers ---
    
    // Department Handlers
    document.getElementById('addDepartmentBtn').addEventListener('click', () => {
        editingDepartmentId = null;
        document.getElementById('departmentModalTitle').textContent = 'Add Department';
        departmentForm.reset();
        openModal(departmentModal);
    });

    document.getElementById('cancelDepartmentBtn').addEventListener('click', () => closeModal(departmentModal));

    departmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('departmentName').value,
            location: document.getElementById('departmentLocation').value,
        };

        if (editingDepartmentId) {
            await putData('departments', editingDepartmentId, formData);
        } else {
            await postData('departments', formData);
        }
        await loadInitialData();
        closeModal(departmentModal);
    });

    departmentTableBody.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('edit-department-btn')) {
            editingDepartmentId = id;
            const department = departments.find(d => d.id == id);
            document.getElementById('departmentModalTitle').textContent = 'Edit Department';
            document.getElementById('departmentId').value = department.id;
            document.getElementById('departmentName').value = department.name;
            document.getElementById('departmentLocation').value = department.location;
            openModal(departmentModal);
        } else if (e.target.classList.contains('delete-department-btn')) {
            if (confirm('Are you sure you want to delete this department? This will also remove all associated employees.')) {
                await deleteData('departments', id);
                await loadInitialData();
            }
        }
    });

    // Employee Handlers
    document.getElementById('addEmployeeBtn').addEventListener('click', () => {
        editingEmployeeId = null;
        document.getElementById('employeeModalTitle').textContent = 'Add Employee';
        employeeForm.reset();
        openModal(employeeModal);
    });

    document.getElementById('cancelEmployeeBtn').addEventListener('click', () => closeModal(employeeModal));

    employeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('employeeName').value,
            position: document.getElementById('employeePosition').value,
            email: document.getElementById('employeeEmail').value,
            departmentId: document.getElementById('employeeDepartment').value,
        };

        if (editingEmployeeId) {
            await putData('employees', editingEmployeeId, formData);
        } else {
            await postData('employees', formData);
        }
        employees = await fetchData('employees');
        renderEmployees();
        closeModal(employeeModal);
    });
    
    employeeTableBody.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('edit-employee-btn')) {
            editingEmployeeId = id;
            const employee = employees.find(emp => emp.id == id);
            document.getElementById('employeeModalTitle').textContent = 'Edit Employee';
            document.getElementById('employeeId').value = employee.id;
            document.getElementById('employeeName').value = employee.name;
            document.getElementById('employeePosition').value = employee.position;
            document.getElementById('employeeEmail').value = employee.email;
            document.getElementById('employeeDepartment').value = employee.departmentId;
            openModal(employeeModal);
        } else if (e.target.classList.contains('delete-employee-btn')) {
            if (confirm('Are you sure you want to delete this employee?')) {
                await deleteData('employees', id);
                employees = await fetchData('employees');
                renderEmployees();
            }
        }
    });


    // --- Initial Load ---
    const loadInitialData = async () => {
        departments = await fetchData('departments');
        employees = await fetchData('employees');
        renderDepartments();
        renderEmployees();
    };

    loadInitialData();
});
