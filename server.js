// server.js
// This file sets up the Express server and defines the API endpoints.

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); // Allows cross-origin requests (from our frontend)
app.use(express.json()); // Parses incoming JSON requests
app.use(express.static('public')); // Serves static files from the 'public' directory

// --- In-Memory Database (to simulate MongoDB) ---
// In a real-world application, you would connect to a MongoDB database here.
// Example using Mongoose:
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/apollonia_dental')
   .then(() => console.log('MongoDB connected...'))
   .catch(err => console.error('MongoDB connection error:', err));
//
// You would also define Mongoose schemas for Employees and Departments.




let departments = [
    { id: 1, name: 'General Dentistry', location: 'Building A, 1st Floor' },
    { id: 2, name: 'Orthodontics', location: 'Building A, 2nd Floor' },
    { id: 3, name: 'Oral Surgery', location: 'Building B, 1st Floor' },
    { id: 4, name: 'Administration', location: 'Main Office' }
];
let employees = [
    { id: 1, name: 'Dr. Evelyn Reed', position: 'General Dentist', email: 'e.reed@apollonia.com', departmentId: 1 },
    { id: 2, name: 'Dr. Samuel Chen', position: 'Orthodontist', email: 's.chen@apollonia.com', departmentId: 2 },
    { id: 3, name: 'Dr. Isabella Vance', position: 'Oral Surgeon', email: 'i.vance@apollonia.com', departmentId: 3 },
    { id: 4, name: 'Marcus Holloway', position: 'Office Manager', email: 'm.holloway@apollonia.com', departmentId: 4 },
    { id: 5, name: 'Jenna Stiles', position: 'Dental Hygienist', email: 'j.stiles@apollonia.com', departmentId: 1 },
];
let nextEmployeeId = 6;
let nextDepartmentId = 5;

// --- API Routes ---

// == Department Routes ==

// GET all departments
app.get('/api/departments', (req, res) => {
    res.json(departments);
});

// POST a new department
app.post('/api/departments', (req, res) => {
    const { name, location } = req.body;
    if (!name || !location) {
        return res.status(400).json({ message: 'Name and location are required.' });
    }
    const newDepartment = {
        id: nextDepartmentId++,
        name,
        location
    };
    departments.push(newDepartment);
    res.status(201).json(newDepartment);
});

// PUT (update) a department
app.put('/api/departments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, location } = req.body;
    const departmentIndex = departments.findIndex(d => d.id === id);

    if (departmentIndex === -1) {
        return res.status(404).json({ message: 'Department not found.' });
    }
    if (!name || !location) {
        return res.status(400).json({ message: 'Name and location are required.' });
    }

    departments[departmentIndex] = { ...departments[departmentIndex], name, location };
    res.json(departments[departmentIndex]);
});

// DELETE a department
app.delete('/api/departments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = departments.length;
    departments = departments.filter(d => d.id !== id);

    if (departments.length === initialLength) {
        return res.status(404).json({ message: 'Department not found.' });
    }
    
    // Also remove employees from the deleted department
    employees = employees.filter(e => e.departmentId !== id);

    res.status(204).send(); // No content
});


// == Employee Routes ==

// GET all employees
app.get('/api/employees', (req, res) => {
    // In a real app, you'd use MongoDB's aggregation pipeline to "join" collections.
    // Here, we'll do it manually.
    const populatedEmployees = employees.map(emp => {
        const department = departments.find(dep => dep.id === emp.departmentId);
        return {
            ...emp,
            departmentName: department ? department.name : 'N/A'
        };
    });
    res.json(populatedEmployees);
});

// POST a new employee
app.post('/api/employees', (req, res) => {
    const { name, position, email, departmentId } = req.body;
    if (!name || !position || !email || !departmentId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    const newEmployee = {
        id: nextEmployeeId++,
        name,
        position,
        email,
        departmentId: parseInt(departmentId)
    };
    employees.push(newEmployee);
    
    // Return the newly created employee with department name populated
    const department = departments.find(dep => dep.id === newEmployee.departmentId);
    const populatedEmployee = {
        ...newEmployee,
        departmentName: department ? department.name : 'N/A'
    };
    res.status(201).json(populatedEmployee);
});

// PUT (update) an employee
app.put('/api/employees/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, position, email, departmentId } = req.body;
    const employeeIndex = employees.findIndex(e => e.id === id);

    if (employeeIndex === -1) {
        return res.status(404).json({ message: 'Employee not found.' });
    }
    if (!name || !position || !email || !departmentId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    employees[employeeIndex] = { ...employees[employeeIndex], name, position, email, departmentId: parseInt(departmentId) };
    
    const department = departments.find(dep => dep.id === employees[employeeIndex].departmentId);
    const populatedEmployee = {
        ...employees[employeeIndex],
        departmentName: department ? department.name : 'N/A'
    };
    res.json(populatedEmployee);
});

// DELETE an employee
app.delete('/api/employees/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = employees.length;
    employees = employees.filter(e => e.id !== id);

    if (employees.length === initialLength) {
        return res.status(404).json({ message: 'Employee not found.' });
    }
    res.status(204).send(); // No content
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
