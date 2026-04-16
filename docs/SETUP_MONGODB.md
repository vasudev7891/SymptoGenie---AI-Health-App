# MongoDB Setup Guide for SymptoGenie

## Problem
MongoDB is not installed or running on your system, which is why registration is failing.

## Solution: Use MongoDB Atlas (Free Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** or **"Sign Up"**
3. Create an account with your email
4. Create a new project (or use default)

### Step 2: Create a Cluster
1. Click **"Build a Database"**
2. Select **Free tier** (M0 Sandbox)
3. Choose your preferred cloud provider (AWS, Azure, or GCP)
4. Select **N. Virginia** region (or closest to you)
5. Click **"Create Cluster"** (takes 2-3 minutes)

### Step 3: Create Database User
1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Username: `symptogenie`
4. Password: Create a strong password (save it!)
5. Database User Privileges: **Read and write to any database**
6. Click **"Add User"**

### Step 4: Get Connection String
1. In the left sidebar, click **"Database"** (under Deployment)
2. Click **"Connect"** on your cluster
3. Select **"Drivers"** option
4. Select **Node.js** as driver
5. Copy the connection string (looks like `mongodb+srv://username:password@cluster.mongodb.net/`)

### Step 5: Update Environment Variables
Replace the MongoDB URI in your `.env` file:

```env
# From:
MONGODB_URI=mongodb://localhost:27017/symptogenie

# To:
MONGODB_URI=mongodb+srv://symptogenie:YOUR_PASSWORD@your-cluster.mongodb.net/symptogenie?retryWrites=true&w=majority
```

**Important:** Replace:
- `YOUR_PASSWORD` with your database user password
- `your-cluster` with your actual cluster name

### Step 6: Test Connection
1. Stop the backend server (Ctrl+C)
2. Restart it: `npm start`
3. You should see: ✅ Connected to MongoDB
4. Try registering again

---

## Alternative: Install MongoDB Locally

### Option A: Docker (Easiest)
```bash
docker run --name mongodb -d -p 27017:27017 mongo:latest
```

### Option B: Windows Installation
1. Download: https://www.mongodb.com/try/download/community
2. Run installer
3. Keep MongoDB URI as: `mongodb://localhost:27017/symptogenie`
4. Start MongoDB: Services > MongoDB > Start

---

## Troubleshooting

### Connection Timeout
- Check if MongoDB is running
- Verify hostname/port in .env
- For Atlas: Check firewall settings (add your IP address)

### Authentication Failed
- Double-check username/password
- Ensure special characters in password are URL-encoded

### Still Getting Registration Error
1. Check browser console for exact error (F12)
2. Check backend logs for detailed error message
3. Verify network request is reaching backend (http://localhost:5000/api/auth/register)

---

## Quick Test
Once MongoDB is connected, try:
```bash
# In backend folder
npm run seed
```

This will seed test data (test users, hospitals, doctors)
