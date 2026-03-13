# Project Planning Document
## Smart Expense and Habit Tracker

### Prepared by
- Rasheda Chowdhury
- Tushar Sarker

### Course
Project and Web Programming Lab

### Instructor
Abu Jafar Md. Jakaria

---

# 1. Project Overview

Smart Expense and Habit Tracker is a web-based application designed to help users manage their daily expenses and monitor personal habits in one platform.

Many students and young professionals struggle to keep track of their spending and daily routines. Most people use notebooks or simple note applications, which do not provide structured reports, analytics, or useful insights about personal behavior.

This project aims to solve that problem by combining **expense tracking** and **habit monitoring** into a single integrated system.

The system will allow users to:

- Record daily expenses
- Track personal habits such as study time, sleep duration, and exercise
- Analyze monthly financial behavior
- Receive smart alerts when spending patterns change

The application will be developed using the **MERN stack architecture with Next.js for frontend development**.

---

# 2. Target Users

The main users of this system are:

- Students
- Freelancers
- Young professionals

These users often want to improve:

- Financial discipline
- Productivity
- Daily routine management

The platform will help users understand the relationship between **spending behavior and daily habits**, enabling them to make better lifestyle and financial decisions.

---

# 3. How the System Will Work

The system will operate through a web-based interface where users can create an account and manage their personal data.

## 3.1 Basic Workflow

1. User registers an account
2. User logs into the system
3. User records daily expenses
4. User records daily habits
5. The system stores data in MongoDB
6. The dashboard displays analytics and reports
7. Smart alerts notify users about unusual behavior or spending patterns

The system will follow a **client-server architecture**.

The **frontend** will communicate with the **backend** using **REST APIs**.

---
## 3.2 System Architecture

### Architecture Layers

• Client Layer  
Next.js frontend handles user interface and user interaction.

• Application Layer  
Node.js and Express handle API logic, authentication, and business rules.

• Data Layer  
MongoDB stores all user, expense, and habit data.

Architecture Flow:

User Browser
      ↓
Next.js Frontend
      ↓
REST API (Express Server)
      ↓
MongoDB Atlas Database

---

# 4. Technologies Used

The project will be developed using the **MERN Stack** along with modern web development tools.

## 4.1 Frontend
- Next.js (React framework)
- JavaScript
- CSS

## 4.2 Backend
- Node.js
- Express.js

## 4.3 Database
- MongoDB
- MongoDB Atlas

## 4.4 Development Tools
- Visual Studio Code
- Git
- GitHub
- Postman
- MongoDB Compass

## 4.5 Deployment
- Vercel (Frontend hosting)
- Render or similar cloud service (Backend hosting)

---

# 5. Core System Features

## 5.1 User Authentication

The system will provide secure authentication using **JWT (JSON Web Tokens)**.

Features include:

- User registration
- Secure login
- Logout functionality
- Password hashing
- Protected API routes

---

## 5.2 Expense Management

Users will be able to record their daily expenses.

Each expense record will include:

- Date
- Amount
- Category
- Optional description

Expense categories include:

- Food
- Transportation
- Education
- Shopping
- Entertainment
- Others

Users will be able to:

- Add expenses
- Edit expenses
- Delete expenses

---

## 5.3 Habit Tracking

Users will be able to record daily habits such as:

- Study hours
- Sleep duration
- Exercise time

The system will store these records and generate reports to show **habit consistency over time**.

---

## 5.4 Dashboard and Analytics

The dashboard will display visual reports including:

- Monthly expense summary
- Category-wise expense charts
- Weekly habit tracking graphs
- Overall financial overview

Charts will help users understand spending patterns and behavior trends.

---

## 5.5 Smart Alert System

The system will generate alerts based on rule-based logic.

Example alerts include:

- Monthly spending exceeds a predefined limit
- Sudden increase in a specific expense category
- Decline in habit consistency

These alerts will be displayed on the dashboard.

---

## 5.6 Profile Management

Users will be able to:

- Update profile information
- Change password
- Manage account settings

---

# 6. Special System Requirements

The system includes several important security and architecture features.

## 6.1 Authentication
- JWT based authentication
- Password hashing using bcrypt
- Protected backend routes
- Input validation for all requests
- Secure API communication

## 6.2 API Design
- RESTful API structure
- Secure request validation
- Proper error handling

## 6.3 Data Validation

Forms will include:

- Input validation
- Error messages
- Required field checks

## 6.4 API Architecture

The backend will follow a RESTful API design.

Example API endpoints:

POST /api/auth/register  
POST /api/auth/login  

GET /api/expenses  
POST /api/expenses  
PUT /api/expenses/:id  
DELETE /api/expenses/:id  

POST /api/habits  
GET /api/habits

---

# 7. Primary User Role

The primary user role in this system is:

**Registered User**

Registered users will be able to:

- Add expenses
- Track habits
- View analytics
- Receive alerts
- Manage profile

The MVP version of the project will **not include an admin panel**.

---

# 8. MVP Scope (Minimum Viable Product)

The MVP version of the project will include the following features:

- User registration and login
- Expense tracking system
- Habit tracking system
- Dashboard analytics
- Smart alerts
- Profile management

These features represent the **core functionality** of the application.

---

# 9. Database Design

The system will use MongoDB as the primary database.

MongoDB Atlas will be used for cloud database hosting.

MongoDB Atlas will provide secure cloud database hosting, automatic backups, and scalable storage for the application.

Data will be stored in the following collections:

**Users Collection**
- _id
- name
- email
- password

**Expenses Collection**
- _id
- userId
- amount
- category
- description
- date

**Habits Collection**
- _id
- userId
- studyHours
- sleepDuration
- exerciseTime
- date

MongoDB is chosen because it is flexible, scalable, and well suited for JavaScript-based full stack applications.


# 10. Non-Negotiable MVP Data 

The following data will be stored in the system database.

## 10.1 User Data
- Name
- Email
- Password (hashed)

## 10.2 Expense Data
- User ID
- Amount
- Category
- Date
- Description

## 10.3 Habit Data
- User ID
- Study hours
- Sleep duration
- Exercise time
- Date

---

# 11. Recommended Project Folder Structure

The project will follow a monorepo architecture to manage both frontend and backend within a single repository. 

```
Smart-Expense-and-Habit-Tracker
│
├── apps
│   │
│   ├── web                 # Next.js Frontend Application
│   │   ├── app
│   │   ├── components
│   │   ├── services
│   │   ├── utils
│   │   └── styles
│   │
│   └── api                 # Node.js + Express Backend
│       ├── controllers
│       ├── routes
│       ├── models
│       ├── middleware
│       ├── config
│       └── server.js
│
├── docs                    # Project documentation
│
├── plan.md                 # Project planning document
├── README.md               # GitHub project overview
└── package.json
```

This structure helps maintain:

- Code organization
- Scalability
- Maintainability

---

# 12. Future Improvements

Future versions of the system may include:

- Mobile application version
- AI-based spending prediction
- Budget planning assistant
- Notification system
- Integration with financial services

---

# 13. Conclusion

Smart Expense and Habit Tracker is a practical web application designed to improve financial discipline and personal productivity.

By integrating **expense tracking** and **habit monitoring**, the system helps users better understand their daily behavior and spending patterns.

This project also demonstrates real-world implementation of modern web development technologies including:

- MERN stack
- Next.js frontend architecture
- RESTful API design
- Secure authentication
- Cloud deployment
- Structured database design

In the future, the system can be expanded with features such as:

- AI-based analytics
- Mobile applications
- Banking integration

Overall, this project provides both **practical usability** and **strong academic learning value**.