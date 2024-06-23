# Task Management System API
Welcome to the Task Management System API! This API allows you to manage tasks and user accounts efficiently. Below, you'll find instructions on how to set up and run the API locally, as well as how to test it using Swagger UI.

## Table of Contents
- Live Deployed Server 
- Prerequisites
- Installation
- Configuration
- Running the API
- API Documentation
- Testing the API
- Project Structure
- Additional Notes

## Live Deployed Server
- The API is deployed and available live on Render at the following URL:

```perl
https://task-management-system-api-y2zj.onrender.com/api-docs/#
```
- swagger docs
```perl
https://task-management-system-api-y2zj.onrender.com/api-docs/#
http://localhost:3000/api-docs/#
```
- BaseURL
  ```perl
  https://task-management-system-api-y2zj.onrender.com
  ```
You can use this link to access and interact with the API directly without needing to run it locally.


## Prerequisites
Before you can set up the API locally, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or Yarn (npm is used in these instructions)
- MongoDB (locally or using a service like MongoDB Atlas)

## Installation
1) Clone the repository:
```bash
git clone https://github.com/abhaysinh-gaikwad/task-management-system.git
cd task-management-system
```
2) Install dependencies:
```bash
npm install
```

## Configuration
Create a `.env` file in the root directory and configure the following environment variables:

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_jwt_secret
REFRESH_JWT_SECRET=your_refresh_jwt_secret
```
- PORT: The port number on which the server will run.
- MONGODB_URI: The URI of your MongoDB instance.
- JWT_SECRET: The secret key for signing JSON Web Tokens (JWT).
- REFRESH_JWT_SECRET: The secret key for signing refresh tokens.

## Running the API
1) Start the API server:

```bash
npm start
The API will be running at http://localhost:3000
```

## API Documentation
The API uses Swagger for documentation. Once the server is running, you can access the Swagger UI to explore the API endpoints at:

```bash
https://task-management-system-api-y2zj.onrender.com/api-docs/#
```


## Testing the API
You can test the API endpoints using tools like Postman or through the Swagger UI. The Swagger UI provides a web-based interface where you can interact with the API endpoints directly.

### Running Tests Locally
To run the automated tests for the API, use the following command:

```bash
npm test
```
This command will execute the tests defined in your project and report any issues. Make sure to have your development environment properly set up before running tests.

### Example Requests

#### User Endpoints

1) User Signup:

- Endpoint: `POST /users/signup`
- Body:
```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "mypassword"
}
```
2) User Login:

- Endpoint: `POST /users/login`
- Body:
```json
{
  "email": "john.doe@example.com",
  "password": "mypassword"
}
```
3) User Logout:

- Endpoint: `GET /users/logout`
- Headers: Authorization: Bearer <your_token_here>

#### Task Endpoints

1) Create a Task:

- Endpoint: `POST /tasks`
- Headers: Authorization: Bearer <your_token_here>
- Body:
```json
{
  "title": "New Task",
  "description": "Details of the task",
  "due_date": "2024-06-30"
}
```
2) Get All Tasks:

- Endpoint: `GET /tasks`
- Headers: Authorization: Bearer <your_token_here>

3) Get Task by ID: 
- Endpoint: `GET /tasks/{id}`
- Headers: Authorization: Bearer <your_token_here>
- Parameters:
 - - `id`: The ID of the task you want to retrieve.

4) Update Task by ID: 
- Endpoint: `PATCH /tasks/{id}`
- Headers: Authorization: Bearer <your_token_here>
- Parameters:
- - `id`: The ID of the task you want to update.
- Body:
```json
{
  "title": "Updated Task Title",
  "description": "Updated details of the task",
  "due_date": "2024-07-01",
  "priority": "high",
  "status": "in progress"
}
```
5) Delete Task by ID:
- Endpoint: `DELETE /tasks/{id}`
- Headers: Authorization: Bearer <your_token_here>
- Parameters:
- - `id`: The ID of the task you want to delete.

## Project Structure
```bash
task-management-system/
│
├── config/
│   └── db.js                 # Database connection setup
│
├── middleware/
│   └── auth.js               # Authentication middleware
│
├── model/
│   ├── task.model.js         # Task model
│   ├── user.model.js         # User model
│   └── blacklist.model.js    # Blacklist model for JWT tokens
│
├── routes/
│   ├── user.route.js         # User routes
│   └── task.route.js         # Task routes
│
├── tests/
│   └── UserandTask.test.js  # User and Task managment testcases
│
├── swaggerConfig.js          # Swagger configuration
│
├── .env                      # Environment variables (not included in the repo)
├── package.json              # NPM dependencies and scripts
└── index.js                  # Main server file
```

## Additional Notes
- Error Handling: The API includes basic error handling, but further improvements can be made to standardize and enhance error responses.
- Security: Ensure to keep your JWT_SECRET and REFRESH_JWT_SECRET secure and do not expose them publicly.
- Environment Variables: Do not commit the .env file to version control. Use a .env.example file for reference without sensitive data.
- MongoDB Setup: If you are using MongoDB Atlas, ensure your IP is whitelisted, or use a VPN/local instance for development.
