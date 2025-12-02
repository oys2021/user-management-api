# 🔐 User Management API - Node.js/Express

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-darkblue)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

A robust **User Management API** built with **Node.js, Express, and PostgreSQL** featuring **dual authentication** (JWT + Session), secure password handling, and comprehensive user management operations.

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
# Edit .env with your database credentials

# Start the server
npm run dev