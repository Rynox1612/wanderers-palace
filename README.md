# 🏡 Wanderers-Palace

> **A Full-Stack Booking Platform for Wanderers & Tourists**

---

## 📌 Overview

**Wanderers-Palace** is a full-stack web application (currently **undeployed**) built to simulate a **room booking system** for tourists and wanderers.

- 🧠 Built with a proper **MVC structure**
- 🗃️ Uses **MongoDB** as the database
- 🧩 Comes with **sample data**, which you can **directly clone and insert** into your own MongoDB
- 🛠️ Supports **full CRUD**: Create, Read, Update, and Delete functionality
- 🚀 Ready to be deployed once routes and views are finalized

---

## 📁 Features

- 📝 Add new room listings
- ✏️ Edit room information
- ❌ Delete a room
- 📜 View all rooms

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB using Mongoose
- **Templating Engine**: EJS

---

## 📦 Getting Started

### 🔄 Clone the Repo

```bash
git clone https://github.com/Rynox1612/wanderers-palace.git
cd wanderers-palace
```

### 🔒 Authentication & Security

- User passwords are securely hashed before storage
- Utilizes cryptographic hashing functions and salting for password protection
- Implements secure session management
- Follows standard security practices for user data protection

---

### what is hashing function ??

- It converts any string in a fixed length unreadable string
- It is an one way function
- For every input there is a fixed output
- small changes in input causes a big change in the output
- Example :- SHA-256, MD5, CRC, Bcrypt.

### What is Salting ??

- Salting adds random data to password before hashing
- Each user gets a unique salt, making rainbow table attacks harder
- Even if two users have same password, their hashes will be different
- Example: password + "x7#k9" -> hash("passwordx7#k9")

### What is Passport.js?

- Popular authentication middleware for Node.js
- Supports multiple authentication strategies (Local, OAuth, JWT)
- Easy to integrate with Express applications
- Maintains persistent login sessions
- Flexible and modular authentication system
