# 🔧 Troubleshooting Guide

## 500 Internal Server Error - Registration/Login Issues

### ❌ Problem: POST /auth/register returns 500

#### **Step 1: Check MongoDB Connection**

```bash
# Terminal 1: Start MongoDB
mongod

# You should see:
# ✅ MongoDB connected
```

If MongoDB is not connected:
```bash
# Install MongoDB (if not installed)
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb
# Windows: Download from mongodb.com

# Start MongoDB
mongod
```

#### **Step 2: Check Backend Logs**

Look at your backend terminal for error messages:

```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Start MongoDB first!

```
❌ ValidationError: email: Email already registered
```

**Solution:** Use a different email address

#### **Step 3: Verify .env File**

Make sure your backend/.env file exists and has:

```env
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

#### **Step 4: Check Network**

Make sure backend is running on port 5000:

```bash
# Terminal where backend is running should show:
✅ MongoDB connected
🚀 Server running on port 5000
```

Test the health endpoint:
```bash
curl http://localhost:5000/api/v1/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Frontend Shows "Error during registration"

### Check Browser Console

1. Open browser DevTools: **F12 or Right-click → Inspect**
2. Go to **Console** tab
3. Look for error messages

### Common Issues

#### 1. API URL is Wrong

**Problem:** `Error: Network Error`

**Check:** Frontend .env file
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

Make sure backend is running on port 5000!

#### 2. CORS Error

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Backend is running but CORS is not configured correctly

In `backend/server.js`, check:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',  // Should match your frontend URL
  credentials: true
}));
```

#### 3. MongoDB Connection Failed

**Problem:** Backend returns 500 error

**Solution:**
1. Start MongoDB: `mongod`
2. Check backend logs for "MongoDB connection error"
3. Verify MONGODB_URI in .env

---

## Complete Setup Checklist

### ✅ Step 1: Start MongoDB

```bash
# Check if MongoDB is running
mongod

# You should see port 27017 listening
```

### ✅ Step 2: Setup Backend

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start backend
npm run dev

# Expected output:
# ✅ MongoDB connected
# 🚀 Server running on port 5000
```

### ✅ Step 3: Setup Frontend

```bash
cd frontend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start frontend
npm start

# Should open browser on http://localhost:3000
```

### ✅ Step 4: Test Registration

1. Go to http://localhost:3000
2. Click Register
3. Fill form:
   - **Name:** John Doe
   - **Email:** john@test.com
   - **Password:** Test123 (letters + numbers)
   - **Confirm:** Test123
4. Click Register
5. Should redirect to dashboard

---

## Debugging Tips

### Enable Debug Logging

In `backend/controllers/authController.js`, errors are now logged with:
```javascript
console.error('Register error:', error);
```

Check backend terminal for full error details.

### Test with Postman

```
POST http://localhost:5000/api/v1/auth/register

Body (JSON):
{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "Test123",
  "confirmPassword": "Test123"
}
```

Expected Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@test.com",
      "role": "user"
    },
    "token": "eyJ..."
  }
}
```

### Check Database

```bash
# Connect to MongoDB
mongo

# Use the database
use task-management

# Check users collection
db.users.find()
```

---

## Reset Everything

If something is broken, try a complete reset:

```bash
# Stop all processes (Ctrl+C in terminals)

# 1. Clear npm cache
npm cache clean --force

# 2. Remove node_modules and reinstall
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install

# 3. Reset MongoDB
# Delete database and restart
mongod

# 4. Restart
cd backend && npm run dev
cd frontend && npm start
```

---

## Still Having Issues?

### Provide These Details

When asking for help, include:

1. **Backend logs** - Copy the entire error message
2. **Frontend console errors** - F12 → Console tab
3. **MongoDB status** - Is `mongod` running?
4. **Port status** - Is something using port 5000 or 3000?

### Check Ports

```bash
# macOS/Linux
lsof -i :5000      # Check if port 5000 is used
lsof -i :3000      # Check if port 3000 is used

# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

Kill process using port:
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
taskkill /PID <PID> /F
```

---

## Quick Fix Summary

| Error | Solution |
|-------|----------|
| 500 error on register | Start MongoDB: `mongod` |
| "Connection refused" | MongoDB not running |
| CORS error | Check REACT_APP_API_URL in .env |
| Port 5000 in use | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| Module not found | Run `npm install` in backend/frontend |
| Email already registered | Use different email |
| Password validation fails | Must have letters + numbers, min 6 chars |

---

**Need more help? Check the README files in backend/ and frontend/ folders!**
