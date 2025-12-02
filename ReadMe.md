# 🔐 User Management API - Node.js/Express

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-darkblue)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

A robust **User Management API** built with **Node.js, Express, and PostgreSQL** featuring **dual authentication** (JWT + Session), secure password handling, and comprehensive user management operations.

The APi Docs is found here http://localhost:8000/api-docs

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Running the Server](#running-the-server)
- [Testing](#testing)
- [API Examples](#api-examples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Features

### 🔐 **Authentication**
- **JWT Tokens** for API access (Access + Refresh tokens)
- **Session-based** authentication for web apps
- **Password hashing** with bcrypt
- **Email verification** support
- **Password reset** functionality

### 👤 **User Management**
- **User registration** with validation
- **Profile management** (update, delete)
- **Role-based access** (User, Admin)
- **User search** and filtering
- **Account status** management (active/inactive)

### 🛡️ **Security**
- **Input validation** with express-validator
- **Rate limiting** (100 requests/15min per IP)
- **CORS protection** with configurable origins
- **Security headers** with Helmet.js
- **SQL injection prevention** with Sequelize

### 📊 **Developer Experience**
- **Swagger API documentation**
- **Comprehensive logging** with Morgan
- **Health check endpoint**
- **Error handling middleware**
- **Database connection pooling**

## 🛠️ Tech Stack

### Backend
- **Node.js** (v18+)
- **Express.js** (v4.x)
- **PostgreSQL** (v14+)
- **Sequelize ORM** (v6.x)

### Authentication & Security
- **jsonwebtoken** (JWT implementation)
- **bcrypt** (Password hashing)
- **express-session** (Session management)
- **express-validator** (Input validation)
- **helmet** (Security headers)
- **express-rate-limit** (Rate limiting)

### Utilities
- **dotenv** (Environment variables)
- **morgan** (HTTP request logging)
- **cors** (Cross-Origin Resource Sharing)
- **swagger-ui-express** (API documentation)
- **yaml** (Swagger documentation parsing)

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/user-management-api.git
cd user-management-api

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials. Node the Database was connected loally so configure yours in the virtual environment

# Start the server
nodemon server.js

##  Authentication Endpoints

Method	Endpoint	Description	Auth Required
POST	/api/auth/register	Register new user	No
POST	/api/auth/login	User login	No
POST	/api/auth/logout	User logout	Yes
POST	/api/auth/refresh-token	Refresh JWT token	No
GET	/api/auth/me	Get current user	Yes
PUT	/api/auth/profile	Update profile	Yes

## Database Schema
Users Table
sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);

Development Mode
bash
npm run dev


