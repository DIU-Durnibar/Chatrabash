<div align="center">

# 🏠 Chatrabash (ছাত্রাবাস)
### The Modern SaaS Platform for Smart Hostel Management

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-.NET%208%20%7C%20React-lightgrey.svg?style=flat-square)]()
[![Status](https://img.shields.io/badge/status-Active%20Development-success.svg?style=flat-square)]()

---

<p align="center">
  <b>Chatrabash</b> is engineered to revolutionize traditional hostel operations. <br/>
  Built with scalability and performance in mind, it automates the chaos of seat allocation, meal management, and billing — creating a seamless digital experience for managers and student boarders alike.
</p>

[Explore Features](#-key-features) • [Tech Stack](#-technology-stack) • [Architecture](#%EF%B8%8F-engineered-with-clean-architecture) • [Getting Started](#-getting-started)

---

</div>

## ✨ Key Features

We have designed Chatrabash to address every pain point of hostel administration, from admission to alumni.

### 🏢 Core Administration
| Feature | Description |
| :--- | :--- |
| 👥 **Smart Tenant Profiles** | Complete digital onboarding with photo & document verification for students/boarders. |
| 🛏️ **Visual Seat Management** | Interactive dashboard to view available vs occupied seats and assign rooms effortlessly. |
| 📊 **Dashboard Analytics** | Real-time overview of total boarders, expected revenue, and active meal counts. |
| 📝 **Digital Notice Board** | Broadcast important announcements (e.g., "Water Pump Maintenance") directly to students. |

### 🍚 Mess & Dining (Mill System)
| Feature | Description |
| :--- | :--- |
| 📅 **Automated Meal Counting** | Daily default meal count with options for students to turn meals ON/OFF instantly. |
| 🛑 **Guest Meal Management** | Allow students to add guest meals, automatically calculating extra charges. |
| 📉 **Bazaar & Expense Tracking** | Log daily market expenses (Bazaar Cost) to auto-calculate the "Mill Rate" at month-end. |

### 💰 Finance & Accounts
| Feature | Description |
| :--- | :--- |
| 🧾 **Auto-Invoicing** | Generate monthly bills combining seat rent, utility fees, and meal charges in one click. |
| 💸 **Dues Tracking** | Identify defaulters instantly and send reminders for unpaid bills. |
| 📒 **Expense Manager** | Track hostel operational costs (Electricity, Staff Salary, Repairs) for profit/loss analysis. |

### 🛡️ Security & Support
| Feature | Description |
| :--- | :--- |
| 🔐 **RBAC Security** | Strict Role-Based Access Control for Super Admin, Manager, and Student. |
| 🎫 **Grievance System** | Ticketing system for students to report issues (e.g., "Fan not working") with status tracking. |
| 👮 **Visitor Logs** | Digital entry/exit logs for visitors to enhance security. |

---

## 🔮 Future Roadmap

We are constantly innovating. Here is what's coming next in **Chatrabash v2.0**:

* 📱 **Mobile Application:** Dedicated Android/iOS app using **React Native** for students to manage meals on the go.
* 💳 **Online Payment Gateway:** Integration with **Bkash/Nagad/Stripe** for instant bill payments.
* 🤖 **AI-Powered Insights:**
    * *Meal Prediction:* Predicting bazaar requirements based on eating history to reduce food waste.
    * *Sentiment Analysis:* Analyzing student grievances to improve hostel environment.
* 🔔 **Push Notifications:** SMS and Email alerts for bill generation and emergency notices.
* ☁️ **Cloud Deployment:** Fully containerized deployment on AWS/Azure using CI/CD pipelines.

---


## 🛠️ Technology Stack

Chatrabash is built using a robust, modern, and industry-standard technology stack.

### Backend & Architecture
![.NET 8](https://img.shields.io/badge/.NET%2010-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![EF Core](https://img.shields.io/badge/EF%20Core-512BD4?style=for-the-badge&logo=.net&logoColor=white)
![MediatR](https://img.shields.io/badge/MediatR-CQRS-ff69b4?style=for-the-badge&logo=nuget&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### Frontend & UI
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

---

## 🏛️ Engineered with Clean Architecture

This project adheres strictly to **Clean Architecture** principles combined with the **CQRS** pattern (via MediatR) to ensure separation of concerns, testability, and maintainability.

<div align="center">

*(Please replace this text with a screenshot of your Clean Architecture Diagram for maximum aesthetic points!)*
<br/>
`[ Domain ]` ⬅️ `[ Application (CQRS) ]` ⬅️ `[ Persistence ]` ⬅️ `[ API ]`

</div>

* **Domain Layer:** The heart of the software. Contains Enterprise logic and entities. Has ZERO dependencies.
* **Application Layer:** Contains business logic, use cases, and MediatR Handlers (Commands & Queries).
* **Infrastructure/Persistence Layer:** Deals with external concerns like Databases (EF Core), File Storage, etc.
* **API Layer:** The entry point. Controllers are thin and only dispatch requests to the Application layer.

---

## 📂 Project Structure

The project is organized into two main parts: **Backend** (ASP.NET Core) and **Client** (React).

```bash
Chatrabash/
├── Backend/                        # ASP.NET Core Solution
│   ├── API/                        # Presentation Layer
│   │   ├── Controllers/            # API Endpoints
│   │   ├── Extensions/             # Service Extensions
│   │   ├── Middleware/             # Exception Handling
│   │   └── Program.cs              # Entry Point & Config
│   │
│   ├── Application/                # Business Logic Layer (CQRS)
│   │   ├── Core/                   # AutoMapper, Result Patterns
│   │   ├── Interfaces/             # Service Interfaces
│   │   ├── Students/               # Feature: Student CRUD (Handlers)
│   │   ├── Seats/                  # Feature: Seat Allocation Logic
│   │   └── Meals/                  # Feature: Daily Meal Management
│   │
│   ├── Domain/                     # Enterprise Logic (No Dependencies)
│   │   ├── Entities/               # DB Models (Student, Seat, Meal)
│   │   └── Enums/                  # Constants (e.g., SeatStatus)
│   │
│   └── Persistence/                # Data Access Layer
│       ├── Data/                   # DbContext Configuration
│       └── Migrations/             # EF Core Migrations
│
├── Client/                         # Frontend (React + Vite)
│   ├── public/                     # Static Assets
│   └── src/
│       ├── app/                    # Global Config
│       │   ├── api/                # Axios Agent
│       │   ├── layout/             # Navbar, Sidebar, App Structure
│       │   └── router/             # React Router Routes
│       │
│       ├── features/               # Feature-based Modules
│       │   ├── dashboard/          # Analytics Dashboard
│       │   ├── students/           # Student List & Forms
│       │   └── meals/              # Meal Management UI
│       │
│       └── assets/                 # Images & Global Styles
│ 
├── Designs                         # Figma UI/UX & System Diagrams
│ 
├── Docs                            # Project Documentation
│
└── README.md                       # Project Manual

```

## 🚀 Getting Started

Follow these steps to set up the development environment locally.

### Prerequisites
* [.NET 10.2 SDK](https://dotnet.microsoft.com/download)
* [Node.js](https://nodejs.org/) (LTS)
* Database (SQL Server or PostgreSQL)

### 🔥 Backend Setup 

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/DIU-Durnibar/chatrabash.git](https://github.com/DIU-Durnibar/chatrabash.git)
    cd chatrabash/Backend
    ```

2.  **Configuration**
    Update the connection string in `API/appsettings.json` to point to your local database instance.

3.  **Database Migrations**
    ```bash
    dotnet ef database update --project ../Persistence --startup-project ../API
    ```

4.  **Run API**
    ```bash
    dotnet run --project ../API
    ```

### 🎨 Frontend Setup

1.  **Navigate to Client**
    ```bash
    cd ../Client
    ```

2.  **Install Dependencies & Run**
    ```bash
    npm install && npm run dev
    ```

---

## 👨‍💻 The Team behind Chatrabash

This project is proudly developed as a Capstone Project for the B.Sc. in Software Engineering program.

<div align="center">

| S. M. Hasib Hasnain | Nusrat Jahan Raisa | Usama Akif Hossain Ador |
| :---: | :---: | :---: |
| **Backend** | **Frontend** | **SQA** |
| [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/SMHasibHasnain) | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/NusratJahanRaisa) | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/usama-akif-hossain) |

</div>

---

<div align="center">

Licensed under the [MIT License](LICENSE) © 2026 Chatrabash Team.
<br/>
*Crafted with code and dedication.* 🚀

</div>