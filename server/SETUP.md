# WashEase Server Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Connection String
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/washease

# For MongoDB Atlas, use your connection string:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/washease?retryWrites=true&w=majority

# JWT Secret Key (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5001

# Environment
NODE_ENV=development
```

### 3. Generate JWT Secret (Optional but Recommended)
Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and use it as your `JWT_SECRET` in the `.env` file.

### 4. Start MongoDB
**Local MongoDB:**
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services panel
```

**MongoDB Atlas:**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Replace `<password>` with your database password

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 6. Verify Installation
- Server should start on port 5001 (or your specified PORT)
- You should see: `✅ MongoDB Connected: ...`
- Visit http://localhost:5001 to see: `{"message":"WashEase API is running...","status":"OK"}`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Laundry
- `POST /api/laundry` - Create laundry request (Protected)
- `GET /api/laundry` - Get user's laundry requests (Protected)
- `GET /api/laundry/all` - Get all laundry requests (Admin/Washer)
- `PUT /api/laundry/:id` - Update laundry status (Admin/Washer)

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify MONGO_URI in .env file
- For Atlas: Check network access and credentials

### Port Already in Use
- Change PORT in .env file
- Or kill the process using the port

### JWT Secret Error
- Make sure JWT_SECRET is set in .env
- Use a strong, random string

## Database Collections

The application will automatically create these collections:
- `users` - User accounts
- `laundries` - Laundry requests

