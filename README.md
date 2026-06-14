<div align="center">

# 📱 SocialPulse - Full Stack Social Media Platform

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

A feature-rich, modern social media platform built with MongoDB, Express, React, and Node.js. Experience real-time messaging, seamless media sharing, and an intuitive UI.

</div>

<br />

## ✨ Features

- 💬 **Real-time Chat & Notifications:** Powered by Socket.io for instant, lag-free communication and live updates when users interact with your content.
- 📸 **Media Sharing (Posts & Loops):** Upload images, videos, and short-form "Loops" (Reels) seamlessly with integrated Cloudinary cloud storage.
- 📱 **Responsive Modern UI:** A premium, glassmorphism-inspired design with micro-animations (`animate-explode`) built entirely using Tailwind CSS.
- ❤️ **Interactive Feed:** Like, comment, save posts, and explore new content on the dynamic Explore page.
- 🔒 **Secure Authentication:** Robust user authentication with JWT, secure cookie handling, and encrypted passwords.
- 👥 **Follow System:** Connect with other users, view their profiles, and build your network.

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Redux Toolkit** (State Management)
- **Tailwind CSS** (Styling & Animations)
- **Socket.io-client** (Real-time updates)
- **React Router Dom** (Navigation)

### Backend
- **Node.js & Express.js** (API Server)
- **MongoDB & Mongoose** (Database & ODM)
- **Socket.io** (WebSockets Server)
- **Cloudinary & Multer** (Media Uploads & Storage)
- **JSON Web Tokens (JWT)** (Authentication)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB account (or local instance)
- Cloudinary account (for media storage)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/manavsharma111/social-media-app-mern.git
   cd social-media-app-mern
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder and add your credentials:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the Application:**
   Open two terminals and run the following commands:
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📂 Project Structure

```text
social-media-app-mern/
├── backend/
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/     # API route logic (auth, post, user, etc.)
│   ├── middlewares/     # Auth & upload middlewares
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express API routes
│   ├── server.js        # Entry point for backend
│   └── socket.js        # Socket.io configuration
│
└── frontend/
    ├── src/
    │   ├── assets/      # Static assets and images
    │   ├── components/  # Reusable UI components
    │   ├── hooks/       # Custom React hooks (API calls)
    │   ├── pages/       # Main application views
    │   ├── redux/       # Redux slices and store configuration
    │   ├── App.jsx      # Main React component
    │   └── main.jsx     # Frontend entry point
    └── tailwind.config.js
```

---
<div align="center">
  <i>Built with ❤️ using the MERN Stack</i>
</div>
