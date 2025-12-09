# Vehicle Rental System - Backend API

A fully functional **Vehicle Rental Management System** built with Node.js, Express, TypeScript, and PostgreSQL. Features role-based access control (Admin & Customer), secure JWT authentication, and complete CRUD operations for vehicles and bookings.

**Live Deployment:** https://vehicle-rental-system-production.up.railway.app  
**API Base URL:** `https://vehicle-rental-system-production.up.railway.app/api/v1`

---

### Features

#### Authentication & Authorization

- Secure user registration and login (JWT + bcrypt)
- Role-based access control (`admin`, `customer`)
- Protected routes with middleware

#### Admin Features

- Manage all vehicles (CRUD)
- View and manage all bookings
- Mark booking as `returned` → vehicle automatically becomes available
- View all users

#### Customer Features

- Register & login
- Browse all available vehicles
- Create booking with automatic price calculation
- View own bookings
- Cancel booking (before start date)

#### Core Features

- Vehicle availability tracking
- Overlap booking prevention
- Automatic price calculation (daily rate × days)
- Transaction-safe operations (PostgreSQL transactions)
- Proper error handling with status codes

---

### Technology Stack

| Layer          | Technology                     |
| -------------- | ------------------------------ |
| Runtime        | Node.js                        |
| Language       | TypeScript                     |
| Framework      | Express.js                     |
| Database       | PostgreSQL                     |
| Authentication | JSON Web Tokens (JWT) + bcrypt |
| Validation     | Built-in + custom logic        |
| Deployment     | Railway / Render / Vercel      |

---

### API Endpoints

| Method | Endpoint               | Access        | Description                         |
| ------ | ---------------------- | ------------- | ----------------------------------- |
| POST   | `/api/v1/auth/signup`  | Public        | Register new customer               |
| POST   | `/api/v1/auth/signin`  | Public        | Login (returns JWT)                 |
| GET    | `/api/v1/vehicles`     | Public        | Get all vehicles                    |
| POST   | `/api/v1/vehicles`     | Admin         | Add new vehicle                     |
| PUT    | `/api/v1/vehicles/:id` | Admin         | Update vehicle                      |
| DELETE | `/api/v1/vehicles/:id` | Admin         | Delete vehicle (if not booked)      |
| GET    | `/api/v1/bookings`     | Authenticated | Get bookings (own or all for admin) |
| POST   | `/api/v1/bookings`     | Authenticated | Create new booking                  |
| PUT    | `/api/v1/bookings/:id` | Authenticated | Cancel (customer) / Return (admin)  |

---

### Setup & Running Locally

#### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Git

#### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vehicle-rental-system.git
   cd vehicle-rental-system
   npm install
   npm run dev
   ```
