# Node.js CRUD with Prisma and MongoDB
This repository provides a basic CRUD (Create, Read, Update, Delete) application built with Node.js, Prisma, and MongoDB.
It demonstrates how to perform common database operations using these technologies.

# Prerequisites

Before you begin, ensure that you have the following installed:
- Node.js (version >= 12.0.0)
- npm (Node Package Manager)
- MongoDB (version >= 4.0.0)

# Getting Started

To get started with this project, follow these steps:

1. Clone the repository:
git clone [ https://github.com/your-username/nodejs-prisma-mongodb-crud.git](https://github.com/kazirafi71/simple_crud_task_with_prisma_mongodb.git)

2. Install the dependencies by navigating to the project directory and running the following command:

<pre>
  <code>
  cd nodejs-prisma-mongodb-crud
  </code>
   
</pre>

<pre>
  <code>
npm install
  </code>
   
</pre>



3. Configure the database connection:


   - DATABASE_URL="YOUR_DB_URL"
   - SECRECT_KEY="SECRECT_KEY"
   - EMAIL="EMAIL" (This email for seding email by nodemailer)
   - PASSWORD="PASSWORD" (This password for seding email by nodemailer)
   
 4. Run the application:
 <pre>
  <code>
    npm start
  </code>
   
</pre>

This will start the Node.js server.

# Usage

Once the application is running, you can perform CRUD operations using the following endpoints:

- POST /api/signup: Signup api.
- POST /api/signin: Signin api.
- POST /api/verify-email: When signup or signin if email not verified then this wpi will verify the email.
- PUT /api/forgot-password: Forgot password.
- GET /api/list-users: Retrieve a list of users.
- POST /api/create-user: Create a new user. 
- PUT /api/update-user/:userId: Update an existing user by ID.
- DELETE /api/delete-user/:userId: Delete an user by ID.

# Technologies Used
- Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- Prisma: A modern database toolkit for TypeScript and Node.js.
- MongoDB: A popular NoSQL database.



