# WashEase 🧺

A Smart Digital Laundry Management System for hostels and residences. Track your clothes, schedule pickups, and get notified instantly.

## 🚀 Features

- **User Authentication** - Secure signup and login with JWT
- **Role-Based Access** - Support for Students, Washers, and Admins
- **Laundry Tracking** - Real-time status updates (Pending → Picked Up → In Progress → Ready → Delivered)
- **Dashboard** - Personal dashboard for students to manage requests
- **Admin Panel** - Comprehensive admin dashboard for managing all requests
- **Modern UI** - Beautiful, responsive design with smooth animations
- **Database Storage** - All data securely stored in MongoDB

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## 🏃 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd WashEase
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb://localhost:27017/washease
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5001
NODE_ENV=development
```

**For MongoDB Atlas:**
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string
- Replace `MONGO_URI` with your Atlas connection string

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5001`

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run on `http://localhost:5173` (or the port Vite assigns)

## 📁 Project Structure

```
WashEase/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (Auth)
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   │   └── README.md     # 📚 Controllers documentation
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── server.js          # Entry point
├── README.md              # Main documentation
├── START.md               # Quick start guide
├── GIT_SETUP.md          # Git push instructions
└── .gitignore            # Git ignore rules
```

## 🔐 User Roles

- **Student** - Can create laundry requests and view their own requests
- **Washer** - Can view all requests and update status
- **Admin** - Full access to all features

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Laundry (Protected)
- `POST /api/laundry` - Create laundry request
- `GET /api/laundry` - Get user's laundry requests
- `GET /api/laundry/all` - Get all requests (Admin/Washer)
- `PUT /api/laundry/:id` - Update laundry status (Admin/Washer)

> 📚 **Detailed API Documentation:** See [`server/controllers/README.md`](server/controllers/README.md) for complete controller documentation with request/response examples, error codes, and testing examples.

## 🗄️ Database Collections

- **users** - User accounts with authentication
- **laundries** - Laundry requests with status tracking

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally, or
- Check your MongoDB Atlas connection string
- Verify network access in Atlas (if using cloud)

### Port Already in Use
- Change `PORT` in server `.env` file
- Or kill the process using the port

### Frontend Not Connecting to Backend
- Ensure backend is running on port 5001
- Check `vite.config.js` proxy configuration
- Verify CORS is enabled in server

## 📝 Environment Variables

### Server (.env)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
NODE_ENV=development
```

## 🎨 Features in Detail

- ✅ User registration and authentication
- ✅ Role-based access control
- ✅ Create and manage laundry requests
- ✅ Real-time status tracking
- ✅ Admin dashboard with statistics
- ✅ Responsive design
- ✅ Smooth animations and transitions
- ✅ Error handling and validation
- ✅ Secure password hashing
- ✅ JWT token authentication

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ for easy laundry management
