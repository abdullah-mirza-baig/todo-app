# 📋 MERN Todo App

A full-stack task management app built with the MERN stack. Users can create, update, delete, and share tasks with collaborators. Features include authentication, drag-and-drop sorting, role-based sharing, and task filtering.

Hosted Link : https://todoapp-frontend-ten.vercel.app/
---

## 🛠️ Tech Stack Used

- **Frontend:** React, Tailwind CSS, MUI, DnD-Kit
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Token)
- **Date Handling:** Day.js

---

## 🚀 Setup Instructions

### 🔧 Backend Setup
1. Clone the repo:
   ```bash
   git clone https://github.com/abdullah-mirza-baig/todo-app
   cd backend

2. Install dependencies:
    npm install

3. Set up .env

4. Run server:
    npm run start

### 💻 Frontend Setup

1. Open a new terminal:
    cd client
    npm install

2. Start frontend:
    npm run dev

### ✨ Features

User Registration & Login

JWT-based Authentication

Task Create, Edit, Delete

Add Tags, Priority, Due Dates

Add Single File and it can be download

Drag-and-Drop Sorting

Share Tasks with Other Users with creator name

Responsive UI with Tailwind & MUI

Filter Tasks by Priority, Status, Tags


### ⚠️ Known Issues / Future Improvements

Add email notifications (using a queue system like Bull or RabbitMQ)

# 🧪 Testing

Integration tests were implemented using **Jest** and **Supertest** to ensure the core functionalities of the API are working correctly. These tests simulate real HTTP requests and validate actual responses under authenticated conditions.

## ✅ Endpoints Covered

- 🔐 **POST** `/api/auth/login` – Logs in a user and retrieves a JWT token.  
- 📝 **POST** `/api/tasks` – Creates a new task.  
- 📥 **GET** `/api/tasks` – Retrieves all tasks for the logged-in user.  
- ✏️ **PUT** `/api/tasks/:id` – Updates an existing task.  
- ❌ **DELETE** `/api/tasks/:id` – Deletes a task.

## 🛠️ Tools Used

- 🧪 **Jest** – Testing framework  
- 🚀 **Supertest** – HTTP assertions  
- 🍃 **MongoDB** – For test database connection  

## 📊 Code Coverage (Approx.)

- ✅ **Statements**: ~68%  
- ✅ **Branches**: ~42%  
- ✅ **Functions**: ~62%  
- ✅ **Lines**: ~72%  

> ⚠️ *Due to time constraints, we focused on testing core API features. Some controller and utility logic is partially tested. However, the project is structured to easily expand testing and improve coverage above 80%.*

## 🧾 How to Run Tests

1. 📦 Install dependencies:  
   ```bash
   npm install

2. 🧪 Run test suite with coverage:
   ```bash
   npm test

## Open coverage/lcov-report/index.html in your browser

### 📬 API Documentation

https://documenter.getpostman.com/view/41540167/2sB2xBC9hD

### 📧 Contact
Built with ❤️ by Abdullah Rehman
Email: abdullahrehman38@gmail.com
