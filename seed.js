// seed.js
// This script populates the database with initial data.
// Run with: node seed.js

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apollonia_dental';

// Define schemas exactly as in server.js
const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true }
});
const Department = mongoose.model('Department', departmentSchema);

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }
});
const Employee = mongoose.model('Employee', employeeSchema);

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing data
        await Department.deleteMany({});
        await Employee.deleteMany({});
        console.log('Cleared existing data.');

        // Seed Departments
        const departmentsData = [
            { name: 'General Dentistry', location: 'Building A, 1st Floor' },
            { name: 'Orthodontics', location: 'Building A, 2nd Floor' },
            { name: 'Oral Surgery', location: 'Building B, 1st Floor' },
            { name: 'Administration', location: 'Main Office' }
        ];
        const createdDepartments = await Department.insertMany(departmentsData);
        console.log('Departments seeded.');

        // Map department names to their new _id
        const departmentMap = createdDepartments.reduce((map, dep) => {
            map[dep.name] = dep._id;
            return map;
        }, {});

        // Seed Employees
        const employeesData = [
            { name: 'Dr. Evelyn Reed', position: 'General Dentist', email: 'e.reed@apollonia.com', departmentId: departmentMap['General Dentistry'] },
            { name: 'Dr. Samuel Chen', position: 'Orthodontist', email: 's.chen@apollonia.com', departmentId: departmentMap['Orthodontics'] },
            { name: 'Dr. Isabella Vance', position: 'Oral Surgeon', email: 'i.vance@apollonia.com', departmentId: departmentMap['Oral Surgery'] },
            { name: 'Marcus Holloway', position: 'Office Manager', email: 'm.holloway@apollonia.com', departmentId: departmentMap['Administration'] },
            { name: 'Jenna Stiles', position: 'Dental Hygienist', email: 'j.stiles@apollonia.com', departmentId: departmentMap['General Dentistry'] },
        ];
        await Employee.insertMany(employeesData);
        console.log('Employees seeded.');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the connection
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    }
};

seedDatabase();
