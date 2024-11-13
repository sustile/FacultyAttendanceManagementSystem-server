
# Faculty Attendance App Backend

This is a Node.js-based backend for the Faculty Attendance mobile application. It uses MongoDB as the database and `jsonwebtoken` for authentication.

## Prerequisites

- Node.js
- MongoDB
- Nodemon

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sustile/FacultyAttendanceManagementSystem-server.git
   cd FacultyAttendanceManagementSystem-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Modify a `.env` file in the `server/` directory to change Constants:
   ```env
   DATABASE=your_mongodb_connection_string
   JSW_SECRET_KEY=your_jwt_secret_key
   JWT_EXPIRE=your_token_expiry_time
   ```

## Running the Server

Start the server in development mode using `nodemon`:
```bash
npm run server
```

The server will start on the configured port (default is `5001`).

## Scripts

- `npm run server`: Starts the server using `nodemon`.

## License

This project is licensed under the MIT License.
