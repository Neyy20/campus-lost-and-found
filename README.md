# 🎓 Campus Lost & Found

A full-stack MERN web application built specifically for college campuses to help students report, search, and recover lost belongings with a deterministic, rule-based matching system.

---

## 1. The Problem
College students frequently lose items like ID cards, wallets, bottles, earphones, notebooks, and keys. 
Currently, students post announcements in crowded WhatsApp/Telegram groups, where messages are buried under irrelevant chatter within minutes. There is no structured way to search, filter by location or category, or connect a reported lost item with a reported found item.

## 2. The Solution
**Campus Lost & Found** provides a dedicated, structured platform where:
* Students can report **LOST** or **FOUND** items with campus locations and categories.
* Anyone can search and filter in real-time.
* A **Rule-Based Matching System** automatically analyzes posts and suggests probable matches between lost and found items.
* Students can manage their own posts (edit, delete, mark resolved).

---

## 3. Architecture & Tech Stack

### High-Level Architecture
```text
                 CAMPUS LOST & FOUND
                         |
              +----------+----------+
              |                     |
           FRONTEND              BACKEND
        (React + Vite)      (Node.js + Express)
              |                     |
              +----------+----------+
                         |
                      DATABASE
                     (MongoDB)
```

* **Frontend**: React, Vite, Plain CSS (clean, fast, responsive).
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Supports MongoDB Atlas Free Tier & built-in local fallback).
* **Authentication**: Password hashing with `bcryptjs`, stateless tokens via `jsonwebtoken`.
* **Matching**: Pure deterministic **Rule-Based Matching Algorithm** (100% free, 0 paid APIs).

---

## 4. Database Schema

### User Model
* `name` (String, required)
* `email` (String, required, unique)
* `password` (String, hashed with bcrypt)
* `createdAt` (Date)

### Item Model
* `title` (String, required)
* `description` (String, required)
* `type` (`LOST` | `FOUND`)
* `category` (`ID Card`, `Wallet`, `Bottle`, `Bag`, `Books/Notebook`, `Keys`, `Electronics`, `Other`)
* `location` (`Library`, `Canteen`, `Classroom`, `Parking`, `Ground`, `Hostel`, `Other`)
* `date` (Date)
* `status` (`ACTIVE` | `RESOLVED`)
* `postedBy` (ObjectId reference to User)
* `createdAt` (Date)

---

## 5. Rule-Based Matching Algorithm

Rather than relying on paid AI or complicated ML models, the application uses a transparent scoring system:

| Condition | Match Score Added |
|---|---|
| Opposite Type (LOST matches FOUND) | Mandatory Gate |
| **Category Match** | **+3 points** |
| **Location Match** | **+3 points** |
| **Title Keyword Match** | **+2 points** |
| **Description Keyword Overlap** | **+2 points** |

If the total score reaches **$\ge 3$ points**, the item is flagged in the UI as a **Possible Match** with its calculated confidence score.

---

## 6. How to Run Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)

### Step 1: Start the Backend Server
```bash
cd server
npm install
npm start
```
*The server will start at `http://localhost:5000`.*
*(If `MONGODB_URI` is not specified in `server/.env`, the server automatically initializes a built-in local database with 0 setup required!)*

### Step 2: Start the Frontend Client
Open a second terminal window:
```bash
cd client
npm install
npm run dev
```
*The frontend will start at `http://localhost:5173`.*

---

## 7. API Endpoints

### Authentication
* `POST /api/auth/register` — Create a new student account
* `POST /api/auth/login` — Log in and receive JWT token

### Items (CRUD & Search)
* `GET /api/items` — Get items (supports `?search=`, `?type=`, `?category=`, `?location=`)
* `GET /api/items/:id` — Get item details by ID
* `POST /api/items` — Post a new item (Requires Auth)
* `PUT /api/items/:id` — Edit an item (Requires Auth & Ownership)
* `DELETE /api/items/:id` — Delete an item (Requires Auth & Ownership)
* `PUT /api/items/:id/resolve` — Mark item as Resolved (Requires Auth & Ownership)
