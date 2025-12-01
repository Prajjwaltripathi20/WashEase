# 🚀 Quick Start Guide

## Step 1: Start the Backend Server

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb://localhost:27017/washease
JWT_SECRET=your_secret_key_here
PORT=5001
```

**Start the server:**
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5001
📡 API available at http://localhost:5001
```

## Step 2: Start the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or similar)

## Step 3: Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## Troubleshooting

### "Cannot connect to server" Error

1. **Check if backend is running:**
   - Look for `🚀 Server running on port 5001` in terminal
   - Visit http://localhost:5001 - should show API status

2. **Check MongoDB:**
   - If using local MongoDB: `brew services start mongodb-community` (macOS)
   - Or use MongoDB Atlas (free cloud database)

3. **Check .env file:**
   - Make sure `.env` exists in `server` directory
   - Verify `PORT=5001` is set

### MongoDB Connection Issues

**Option 1: Use MongoDB Atlas (Recommended - Free)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

**Option 2: Use Local MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Then use: MONGO_URI=mongodb://localhost:27017/washease
```

### Port Already in Use

If port 5001 is busy:
1. Change `PORT=5001` to another port (e.g., `PORT=5002`) in `.env`
2. Update `vite.config.js` in client to match the new port

## Testing the Setup

1. **Backend Health Check:**
   - Visit: http://localhost:5001
   - Should see: `{"message":"WashEase API is running...","status":"OK"}`

2. **Frontend:**
   - Visit: http://localhost:5173
   - Should see the WashEase homepage

3. **Create Account:**
   - Click "Sign Up"
   - Fill in the form
   - Should successfully create account and redirect to dashboard

## Need Help?

- Check server terminal for error messages
- Check browser console (F12) for frontend errors
- Verify MongoDB is running and accessible
- Ensure `.env` file has correct values

