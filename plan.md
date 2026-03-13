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

## Basic Workflow

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

# 4. Technologies Used

The project will be developed using the **MERN Stack** along with modern web development tools.

## Frontend
- React.js
- Next.js
- JavaScript
- CSS

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- MongoDB Atlas

## Development Tools
- Visual Studio Code
- Git
- GitHub
- Postman
- MongoDB Compass

## Deployment
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

## Authentication
- JWT based authentication
- Secure password hashing
- Protected backend routes

## API Design
- RESTful API structure
- Secure request validation
- Proper error handling

## Data Validation

Forms will include:

- Input validation
- Error messages
- Required field checks

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

# 9. Non-Negotiable MVP Data per Project

The following data will be stored in the system database.

## User Data
- Name
- Email
- Password (hashed)

## Expense Data
- User ID
- Amount
- Category
- Date
- Description

## Habit Data
- User ID
- Study hours
- Sleep duration
- Exercise time
- Date

---

# 10. Recommended Project Folder Structure


The project will follow a structured MERN-based architecture.

```
Smart-Expense-and-Habit-Tracker
│
├── frontend             # Next.js + React
│   ├── components
│   ├── pages
│   ├── styles
│   ├── services
│   └── utils
│
├── backend               # Express API
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   ├── config
│   └── server.js
│
├── database
│   └── mongodb-schema
│
├── docs
│   └── project-documentation
│
├── plan.md
└── README.md
```

This structure helps maintain:

- Code organization
- Scalability
- Maintainability

---

# 11. Conclusion

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