# Blog API - Node, Express, MongoDB

A simple blog API built with Node.js, Express, and MongoDB. The API provides authentication features such as user signup, signin, and signout, along with middleware for authentication and authorization. The app also includes CSRF protection for secure communication.

## Features

- User signup and signin
- JWT-based authentication
- CSRF protection
- MongoDB for storing user data
- Express routing with middleware

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (using Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: CSRF protection, Password hashing with salt
- **Validation**: Express-validator

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14.x or higher)
- **MongoDB** (local or MongoDB Atlas for cloud)
- **IDE/Code Editor** (WebStorm or Visual Studio Code or Any code editor)

### Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/sumancfc/blog-api-node-js.git
   cd blog-api-node-js
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Setup environment variables:

   ```bash
   PORT=8000 || 3000
   NODE_ENV=development or prodution
   DATABASE_URL=mongodb://your-db-connection-string
   JWT_SECRET=your-jwt-secret
   ```

4. Run the project

   ```bash
   npm run start
   ```

## Folder Structure

Here is the folder structure of the project:

```
src
├── controllers   # Controllers for handling requests
├── helpers       # Helper functions
├── middlewares   # Middleware functions
├── models        # Database models
├── routes        # API route definitions
├── validators    # Validation schemas
├── index.js      # Entry point of the application
├── swaggerOptions.ts # Swagger configuration file
```

Additional files and folders in the root directory:

```
.example.env      # Example environment file
.gitignore        # Git ignore file
package.json      # Node.js project metadata
package-lock.json # Lockfile for npm dependencies
README.md         # Project documentation
```
