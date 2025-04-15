# 🍽️ Mess Management System - NITK

A web-based Mess Management System built using HTML, TailwindCSS, DaisyUI, JavaScript (frontend), and Node.js + Express with MySQL (backend). This project helps students register for messes, view menus, give feedback, and manage their mess selections efficiently.

---

## 📁 Project Structure


---

## ✅ Features

- 🔐 Student login with Roll Number
- 🏢 Mess registration and selection
- 🍛 Weekly menu display per mess
- ⭐ Rate and review messes with feedback
- 🗃️ View latest 10 feedbacks per mess

---

## 🔧 Technologies Used

- **Frontend**: HTML, TailwindCSS, DaisyUI, JavaScript
- **Backend**: Node.js, Express
- **Database**: MySQL

---

## 🚀 Modules & Their Working

### 1. 🔐 Login (`index.html`, `login.js`)
- Student enters their **roll number**.
- Session is stored using `sessionStorage`.
- User is redirected to mess selection or menu/feedback based on access.

---

### 2. 🏢 Mess Selection (`mess-selection.html`)
- Dropdown of available messes is fetched from the backend.
- Student selects one mess to register for.
- Selection is saved in the `registrations` table (with student ID and mess name).

---

### 3. 🍛 Mess Menu Display (`menu.html`)
- Displays the current **weekly menu** for each mess.
- Menu data is retrieved from `menus` table.
- Allows switching between messes via dropdown.

---

### 4. ⭐ Feedback System (`feedback.html`)
- Student selects a mess, provides **star rating (1–5)** and a **comment**.
- Feedback is submitted via `/api/submit-feedback`.
- Most recent 10 feedbacks (with stars, comments, roll no., time) are shown below the form.

---

## 🗃️ Database Schema Overview

### `students`
| student_id (PK) | name |
|------------------|-------|
| 21XX10XX | xxxxxxx|

---

### `messes`
| mess_name (PK)      |
|----------------|
| Mega Mess      |

---

### `registrations`
| student_id | mess_name |
|------------|-----------|

---

### `menus`
| mess_name | day       | breakfast | lunch | dinner |
|-----------|-----------|-----------|-------|--------|

---

### `feedback`
| id (PK) | student_id | mess_name | rating | feedback | timestamp           |
|--------|-------------|-----------|--------|----------|---------------------|
| 1      | 21XX10XX    | Mega Mess | 4      | Food is good | 2025-04-15 12:30:00 |

---

## 🧪 API Routes

| Method | Route                                | Description                        |
|--------|--------------------------------------|------------------------------------|
| GET    | `/api/messes`                        | Get all mess names                 |
| GET    | `/api/menus/:mess_name`              | Get weekly menu for a mess         |
| POST   | `/api/register-mess`                 | Register student for a mess        |
| POST   | `/api/submit-feedback`               | Submit feedback for a mess         |
| GET    | `/api/feedbacks/:mess_name`          | Get last 10 feedbacks for a mess   |

---
