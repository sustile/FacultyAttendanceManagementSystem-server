# Faculty Attendance App - Backend

This is a simple Node.js backend for the Faculty Attendance App, designed to manage attendance records for faculty members. The application uses MongoDB as its database and employs JSON Web Tokens (JWT) for authentication.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Usage](#usage)
- [License](#license)

## Features

- User authentication using JSON Web Tokens (JWT)
- CRUD operations for attendance records
- MongoDB integration for data storage

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Nodemon (for development)

## Installation

To get started with the Faculty Attendance App backend, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sustile/FacultyAttendanceManagementSystem-server

Install dependencies:
Make sure you have Node.js and npm installed on your machine. Then, run the following command to install the required packages:
bash
npm install

Configuration
Before running the server, you need to set up your environment variables. Create a .env file in the server directory with the following constants:
text
DATABASE=mongodb://your_mongo_db_url_here
JSW_SECRET_KEY=your_jwt_secret_here
JWT_EXPIRE=your_jwt_expiry_time_here

Replace your_mongo_db_url_here, your_jwt_secret_here, and your_jwt_expiry_time_here with your actual MongoDB connection string and JWT configuration.
Running the Server
To run the server, you will need nodemon installed globally. If you haven't installed it yet, you can do so with:
bash
npm install -g nodemon

Once everything is set up, you can start the server using:
bash
npm run server

This command will start the application and watch for any file changes, automatically restarting the server when needed.
Usage
Once the server is running, you can access the API endpoints at http://localhost:3000. You can use tools like Postman or curl to interact with the API.
License
This project is licensed under the MIT License - see the LICENSE file for details. Feel free to contribute to this project by submitting issues or pull requests!
text
