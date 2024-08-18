cat <<EOL > README.md
# Real-Time Chat App with MERN Stack and Socket.io

Welcome to the Real-Time Chat App! This project leverages the MERN stack along with Socket.io for real-time communication. Below you'll find information on how to set up, run, and deploy the application.

## Features

- **Tech Stack**: MERN (MongoDB, Express.js, React, Node.js) + Socket.io + TailwindCSS + DaisyUI
- **Authentication & Authorization**: JWT (JSON Web Tokens)
- **Real-Time Messaging**: Socket.io
- **Online User Status**: Managed with Socket.io and React Context
- **Global State Management**: Zustand
- **Error Handling**: Comprehensive error handling on both server and client sides
  
- **Upcoming Features**:
  - Superadmin Dashboard for user role initialization upon signup
  - File upload functionality using Multer

## Setup

To get started, configure your environment variables by creating a `.env` file in the root directory of the project:

\`\`\`env
PORT=...
MONGO_DB_URI=...
JWT_SECRET=...
NODE_ENV=...
\`\`\`

## Scripts

### Run Frontend

To start the frontend development server:

\`\`\`shell
npm run frontend
\`\`\`

### Run Backend

To start the backend development server:

\`\`\`shell
npm run back
\`\`\`

### Run Combined Servers

To build and start both frontend and backend servers:

\`\`\`shell
npm run build
npm start
\`\`\`

## Build the App

To build the app for production:

\`\`\`shell
npm run build
\`\`\`

## Start the App

To start the app after building:

\`\`\`shell
npm start
\`\`\`

## Note

The application currently supports real-time messaging via Socket.io. Future updates will include a Superadmin Dashboard for user role management and file upload functionality using Multer.


