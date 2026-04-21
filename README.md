# Karyarambha – Integrated CMS & Business Engine

A full-stack, headless CMS and internal work management system for **Karyarambha IT Company**, built with **Next.js**, **Express.js**, and **PostgreSQL/SQLite**.

---

## 🏗️ Architecture

```
karyarambha/
├── backend/          # Express.js REST API
└── frontend/         # Next.js public website + admin portal
```

### Tech Stack
| Layer       | Technology                              |
|-------------|----------------------------------------|
| Backend     | Node.js · Express.js · Sequelize ORM   |
| Database    | PostgreSQL (prod) · SQLite (dev/test)  |
| Frontend    | Next.js 14 · Tailwind CSS              |
| Auth        | JWT (JSON Web Tokens)                  |

---

## ✨ Features

### 🔒 Work-Hub (Internal Admin Portal)
- **Hierarchical RBAC** – Admin, Project Manager, Employee roles with granular permissions
- **Task Orchestration** – Create tasks, set priorities/deadlines, assign to employees via dropdown
- **Activity Audit Trail** – Full log of who did what and when across all entities
- **User Management** – Activate/deactivate users, assign roles

### 🌐 Dynamic Front (Public Website)
- **Visual Page Builder** – Manage website sections (Hero, About, Contact, etc.) via Component Blocks
- **Blog Management** – Full CRUD with draft/published/archived states
- **Team Members** – Manage team profiles shown on public site
- **Testimonials** – Client reviews with star ratings
- **Services** – IT service listings with SEO metadata
- **SEO Automation** – Auto-generated meta titles/descriptions for all content

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Backend Setup

```bash
cd backend
cp .env.example .env          # Edit settings as needed
npm install
npm run seed                  # Seeds DB with demo data
npm run dev                   # Starts API on http://localhost:5000
```

Default accounts after seeding:
| Role            | Email                        | Password      |
|-----------------|------------------------------|---------------|
| Admin           | admin@karyarambha.com        | Admin@1234    |
| Project Manager | pm@karyarambha.com           | PM@1234       |
| Employee        | employee@karyarambha.com     | Employee@1234 |

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env.local    # Edit API URL if needed
npm install
npm run dev                   # Starts on http://localhost:3000
```

### 3. Run Tests

```bash
cd backend
npm test
```

---

## 📡 API Reference

| Method | Endpoint                      | Auth         | Description               |
|--------|-------------------------------|--------------|---------------------------|
| POST   | `/api/auth/login`             | Public       | Login                     |
| GET    | `/api/auth/me`                | Any role     | Current user              |
| GET    | `/api/tasks`                  | Any role     | List tasks (role-scoped)  |
| POST   | `/api/tasks`                  | Admin / PM   | Create task               |
| PUT    | `/api/tasks/:id`              | Role-scoped  | Update task               |
| DELETE | `/api/tasks/:id`              | Admin / PM   | Delete task               |
| GET    | `/api/users`                  | Admin        | List users                |
| GET    | `/api/admin/audit-trail`      | Admin        | Activity logs             |
| GET    | `/api/admin/dashboard-stats`  | Admin        | Dashboard statistics      |
| GET    | `/api/blogs`                  | Public       | Published blogs           |
| GET    | `/api/services`               | Public       | Active services           |
| GET    | `/api/team`                   | Public       | Active team members       |
| GET    | `/api/testimonials`           | Public       | Active testimonials       |
| GET    | `/api/content`                | Public       | Active content blocks     |

---

## 🛣️ Implementation Roadmap

| Phase | Status     | Milestone                              |
|-------|------------|----------------------------------------|
| 1     | ✅ Done     | Discovery & Schema – DB architecture  |
| 2     | ✅ Done     | Internal Engine – RBAC + Task Module  |
| 3     | ✅ Done     | Website Integration – Frontend + APIs |
| 4     | 🔜 Next    | UAT & Deployment to production server |

---

## �� Role Permissions

| Action                  | Admin | Project Manager | Employee |
|-------------------------|:-----:|:---------------:|:--------:|
| View own tasks          | ✅    | ✅               | ✅        |
| Update task status      | ✅    | ✅               | ✅ (own) |
| Create/assign tasks     | ✅    | ✅               | ❌        |
| Delete tasks            | ✅    | ✅               | ❌        |
| Manage users            | ✅    | ❌               | ❌        |
| Manage content/blogs    | ✅    | ✅               | ❌        |
| View audit trail        | ✅    | ❌               | ❌        |
| Dashboard stats         | ✅    | ❌               | ❌        |
