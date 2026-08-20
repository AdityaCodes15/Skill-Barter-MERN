# Skill Barter

A full-stack MERN application that allows users to exchange skills with each other through a structured skill-barter system.

Instead of paying for every learning opportunity, users can offer a skill they know in exchange for learning a skill they want.

---

## 🚀 Project Overview

Skill Barter is a peer-to-peer skill exchange platform.

Users can:

- Create an account
- Securely log in using JWT authentication
- Create and update their profile
- Add skills they can teach
- Add skills they want to learn
- Discover users with complementary skills
- Send skill-barter requests
- Receive barter requests
- Accept or reject requests
- Track sent request status
- Access protected pages after authentication

The application follows a full-stack architecture where the React frontend communicates with an Express/Node.js backend, which stores application data in MongoDB Atlas.

---

## ✨ Key Features

### 🔐 Authentication

- User registration
- User login
- Password hashing
- JWT-based authentication
- Protected frontend routes
- Authentication middleware
- Logout functionality

### 👤 User Profiles

Users can manage:

- Name
- Email
- Bio
- Location
- Skills they can teach
- Skills they want to learn

### 🤝 Skill Matching

The platform identifies users whose skills complement each other.

For example:

```text
User A
Can Teach: React
Wants to Learn: Python

        ⇅

User B
Can Teach: Python
Wants to Learn: React