# Real-Time Chat App with MERN Stack and Socket.io
Welcome to the Real-Time Chat App! This project leverages the MERN stack along with Socket.io for real-time communication. Below you'll find information on how to set up, run, and deploy the application.

## Features
- **Tech Stack**: MERN (MongoDB, Express.js, React, Node.js) + Socket.io + TailwindCSS + DaisyUI
- **Authentication & Authorization**: JWT (JSON Web Tokens)
- **Real-Time Messaging**: Socket.io
- **Online User Status**: Managed with Socket.io and React Context
- **Global State Management**: Zustand
- **Superadmin Dashboard**: A comprehensive Super Admin dashboard designed for the effective management and oversight of user roles and permissions.
- **Error Handling**: Comprehensive error handling on both server and client sides
  
- **Accomplished Features**:
- Super Admin Dashboard: Provides user role authentication for efficient management, including a comprehensive history of approved and rejected users.
- Role-Based Chat Sidebar: Enables users to initiate conversations based on their assigned roles.
- Message Distribution: Allows users of higher hierarchy to send messages to those of lower hierarchy for initiating chats (Socket.IO integration for real-time updates on the chat sidebar is forthcoming).
- Real-Time Messaging and Online Status: Facilitates real-time communication and displays current online status of users.
- Signup and Login Functionality: Fully operational routes for user registration and authentication.

- **Upcoming Taks & Features**:
- Implement Real-Time Updates: Enhance Socket.IO functionality for role-based user interactions, ensuring immediate updates and improved responsiveness.
- Notifications for New Messages: Add notifications to alert users of incoming messages promptly.
- Two-Factor Authentication: Introduce two-factor authentication for Super Admins and implement email notifications to inform users of their request status (approved or rejected).
- Multimedia Messaging: Integrate Multer for efficient handling and transmission of multimedia content.
- UI Enhancement: Improve the overall user interface to provide a more intuitive and visually appealing experience.
- Secure Tokens: Implement additional security tokens to protect Super Admin accounts.
- Bug Fixes: Address and resolve various bugs to ensure a smoother and more reliable application performance.

## Setup
To get started, configure your environment variables by creating a \`.env\` file in the root directory of the project:

```js
PORT=...
MONGO_DB_URI=...
JWT_SECRET=...
NODE_ENV=...
```

## Scripts
### Run Frontend
To start the frontend development server:

```shell
npm run frontend
```

### Run Backend
To start the backend development server:

```shell
npm run backend
```

### Run Combined Servers
To build and start both frontend and backend servers:

```shell
npm run build
npm start
```

## Build the App
To build the app for production:

```shell
npm run build
```

## Start the App
To start the app after building:

```shell
npm start
```

## Note
The application currently supports real-time messaging via Socket.io. Future updates will include a Superadmin Dashboard for user role management and file upload functionality using Multer.

