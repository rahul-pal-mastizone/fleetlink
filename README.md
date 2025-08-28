# 🚚 FleetLink – MERN Stack Logistics Booking System

> ⚡ Tech assessment submission for **Knovator Technologies**.  
A full-stack implementation of **FleetLink**: a vehicle management & booking system with availability search, overlap handling, and unit testing.

---

## 🌐 Live Preview / Repo
- **GitHub Repository:** [https://github.com/rahul-pal-mastizone/fleetlink](https://github.com/rahul-pal-mastizone/fleetlink)  
- **Frontend:** React (Vite + Tailwind)  
- **Backend:** Node.js + Express + MongoDB  

---

## 🎯 Overview

FleetLink enables **B2B logistics clients** to:
- Register vehicles into the system
- Search for vehicles based on **capacity, route, and time**
- Prevent **overlapping bookings**
- Manage and cancel existing bookings  
- View clear UI feedback for actions  

---

## ✅ Features Implemented

- 🚗 **Add Vehicle** – register fleet vehicles (`name`, `capacityKg`, `tyres`)
- 🔍 **Search & Book** – filter available vehicles by capacity, PIN codes & time
- ⏱ **Estimated Ride Duration** – auto-calculated using pincode difference
- 🚫 **Overlap Handling** – prevents double-booking of same vehicle
- 📋 **List Bookings** – fetch and display booking history
- ❌ **Cancel Booking (Bonus)** – delete an existing booking
- 🎨 **UI/UX** – Tailwind dark theme with responsive cards
- 🧪 **Unit Tests** – Jest + Supertest with `mongodb-memory-server`

---

## 📁 Project Structure


fleetlink/
├── client/ # React + Vite + Tailwind frontend
│ ├── src/pages/ # AddVehicle, SearchBook, Status
│ ├── src/components/ # Layout, UI components
│ └── ...
└── server/ # Express + MongoDB backend
├── routes/ # vehicles.js, bookings.js
├── models/ # Vehicle, Booking schemas
├── tests/ # Jest + Supertest test suites
├── app.js # Express app (exported for tests)
└── index.js # Server entrypoint





---

## 🔧 API Endpoints

| Endpoint                                  | Method | Description                         |
|-------------------------------------------|--------|-------------------------------------|
| `/api/vehicles`                           | POST   | Add a new vehicle                   |
| `/api/vehicles/available`                 | GET    | Search available vehicles           |
| `/api/bookings`                           | POST   | Create booking (with overlap check) |
| `/api/bookings/:id`                       | DELETE | Cancel a booking (Bonus)            |
| `/api/bookings`                           | GET    | List recent bookings                |
| `/api/ping`                               | GET    | Health check                        |

---

## 🖥️ Frontend Screens

- **Home Page** → Quick navigation to features  
- **Add Vehicle** → Form to add vehicles  
- **Search & Book** → Availability search + booking  
- **Status Page** → System/API status  

---

## 💡 Tech Stack

- **Frontend:** React + Vite + TailwindCSS  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB + Mongoose  
- **Testing:** Jest + Supertest + mongodb-memory-server  
- **Deployment Ready:** Configurable via `.env`

---

## ▶️ Running Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Clone the repo
```bash
git clone https://github.com/rahul-pal-mastizone/fleetlink.git
cd fleetlink
Setup Server
cd server
cp .env.example .env   # configure Mongo URI if needed
npm install
npm run dev


Server runs at 👉 http://localhost:5174

Setup Client
cd client
npm install
npm run dev


Client runs at 👉 http://localhost:5173

🧪 Running Tests

Backend tests are implemented with Jest + Supertest.

cd server
npm test


✅ All test suites

- Vehicle creation

- Vehicle availability + duration + overlap logic

- Booking creation success & rejection

- Cancel booking flow

✅ Submission Summary

- All required endpoints implemented

- UI pages built with Tailwind dark theme

- Overlap handling verified via tests

- Bonus feature (Cancel Booking) included

- Tests pass successfully (npm test)
```


---

## 👨‍💻 Developer

**Rahul Pal**  
📧 [rahul.pal.moderntechno@gmail.com](mailto:rahulpal.moderntechno@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/rahul155/)