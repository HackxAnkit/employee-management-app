# Apollonia Dental - Employee Management System

A full-stack CRUD (Create, Read, Update, Delete) web application for managing employees and departments at a dental practice. This project serves as a foundational digital employee management system.

![App Screenshot](https://placehold.co/800x450/06b6d4/ffffff?text=App+Screenshot+Here)
*Suggestion: Run the app locally, take a nice screenshot, and replace the link above.*

---

## Features

-   **Employee Management:** Full CRUD functionality for employee records.
-   **Department Management:** Full CRUD functionality for company departments.
-   **RESTful API:** A clear and logical API for handling data operations.
-   **Interactive UI:** A clean, responsive user interface with modals for creating and editing data.
-   **Containerized:** Packaged with Docker for consistent and easy deployment.

---

## Technology Stack

### Backend
-   **Node.js:** JavaScript runtime environment.
-   **Express.js:** Web framework for Node.js.
-   **MongoDB:** NoSQL database for storing data.
-   **Mongoose:** Object Data Modeling (ODM) library for MongoDB and Node.js.
-   **CORS:** Middleware for enabling cross-origin resource sharing.

### Frontend
-   **HTML5**
-   **Tailwind CSS:** Utility-first CSS framework for styling.
-   **JavaScript (ES6+):** Client-side logic and API communication (`fetch`).

### DevOps
-   **Docker:** Containerization platform.
-   **Docker Compose:** Tool for defining and running multi-container Docker applications.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    cd your-repository-name
    ```

2.  **Install backend dependencies:**
    ```sh
    npm install
    ```

3.  **Set up the environment:**
    This project uses Docker Compose to run the Node.js application and the MongoDB database in isolated containers. Make sure Docker is running on your machine.

4.  **Start the application and database:**
    ```sh
    docker-compose up --build
    ```
    Your application will be running on `http://localhost:3000` and the server will automatically connect to the MongoDB container.

5.  **(Optional) Seed the database:**
    If you want to populate the database with initial data, open a **new terminal window** and run the seed script:
    ```sh
    docker-compose exec app npm run seed
    ```

---

## API Endpoints

### Departments
| Method | Endpoint              | Description                  |
| :----- | :-------------------- | :--------------------------- |
| `GET`  | `/api/departments`    | Get all departments          |
| `POST` | `/api/departments`    | Create a new department      |
| `PUT`  | `/api/departments/:id`| Update a department by ID    |
| `DELETE`| `/api/departments/:id`| Delete a department by ID    |

### Employees
| Method | Endpoint           | Description               |
| :----- | :----------------- | :------------------------ |
| `GET`  | `/api/employees`   | Get all employees         |
| `POST` | `/api/employees`   | Create a new employee     |
| `PUT`  | `/api/employees/:id`| Update an employee by ID  |
| `DELETE`| `/api/employees/:id`| Delete an employee by ID  |

