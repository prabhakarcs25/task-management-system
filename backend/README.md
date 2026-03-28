# 🚀 Task Management API - Scalable REST Backend

A production-ready REST API with JWT authentication, role-based access control (RBAC), and comprehensive task management system built with Node.js, Express, and MongoDB.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Security](#security)
- [Scalability](#scalability)
- [Deployment](#deployment)

## ✨ Features

### Authentication & Authorization
- ✅ User registration with password hashing (bcryptjs)
- ✅ Secure login with JWT tokens
- ✅ Role-based access control (User vs Admin)
- ✅ Token validation and refresh
- ✅ Secure password storage

### Task Management (CRUD)
- ✅ Create tasks with title, description, priority, due date
- ✅ Read tasks with advanced filtering and pagination
- ✅ Update task status, priority, and details
- ✅ Delete tasks with ownership validation
- ✅ Task statistics for admin users

### API Features
- ✅ RESTful API design with proper HTTP status codes
- ✅ Input validation and sanitization
- ✅ Error handling with detailed messages
- ✅ Request logging with Morgan
- ✅ Rate limiting for API protection
- ✅ CORS enabled for frontend integration
- ✅ API versioning (v1)

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Logging:** Morgan
- **Environment:** dotenv
- **Rate Limiting:** express-rate-limit

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
├── controllers/         # Business logic
│   ├── authController.js
│   └── taskController.js
├── models/             # Database schemas
│   ├── User.js
│   └── Task.js
├── middleware/         # Custom middleware
│   └── auth.js
├── routes/             # API routes
│   ├── authRoutes.js
│   └── taskRoutes.js
├── utils/              # Utility functions
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
├── server.js           # Server entry point
├── package.json        # Dependencies
└── README.md          # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
```

### Step 4: Configure .env File
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/task-management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Step 5: Start MongoDB
```bash
# If using local MongoDB
mongod

# OR use MongoDB Atlas (cloud)
```

### Step 6: Run Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server runs on: `http://localhost:5000`

## 🔐 Configuration

### JWT Configuration
- **Secret Key:** Set a strong random string in `.env`
- **Expiry:** Configurable (default: 7 days)
- **Algorithm:** HS256

### Rate Limiting
- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Applied To:** All `/api/` routes

### CORS
- Configured for frontend URL (default: `http://localhost:3000`)
- Credentials enabled
- Methods: GET, POST, PUT, DELETE, OPTIONS

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```http
GET /health
```

---

## 🔐 Authentication Routes

### 1. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Validation Rules:**
- Name: 2-50 characters
- Email: Valid email format, unique
- Password: Min 6 chars, must contain letter and number
- Confirm Password: Must match password

---

### 2. Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "lastLogin": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 3. Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "lastLogin": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

## 📝 Task Routes

All task routes require authentication (Authorization header with JWT token).

### 4. Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high",
  "dueDate": "2024-02-01",
  "tags": ["documentation", "important"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "task_id",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "pending",
      "priority": "high",
      "dueDate": "2024-02-01T00:00:00Z",
      "tags": ["documentation", "important"],
      "owner": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "isCompleted": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Validation Rules:**
- Title: 3-100 characters (required)
- Description: Max 1000 characters
- Priority: low, medium, high
- Due Date: Valid ISO 8601 date
- Tags: Array of strings

---

### 5. Get All Tasks
```http
GET /tasks?status=pending&priority=high&page=1&limit=10&sortBy=newest
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: pending, in-progress, completed (optional)
- `priority`: low, medium, high (optional)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `sortBy`: newest, oldest, due-date (default: newest)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [...],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

---

### 6. Get Task by ID
```http
GET /tasks/:id
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "task": {
      "_id": "task_id",
      "title": "Complete project documentation",
      ...
    }
  }
}
```

---

### 7. Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in-progress",
  "priority": "medium"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {...}
  }
}
```

---

### 8. Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": "task_id"
  }
}
```

---

### 9. Get Task Statistics (Admin Only)
```http
GET /tasks/stats/all
Authorization: Bearer <admin-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task statistics retrieved successfully",
  "data": {
    "totalTasks": 150,
    "byStatus": [
      { "_id": "pending", "count": 45 },
      { "_id": "in-progress", "count": 60 },
      { "_id": "completed", "count": 45 }
    ]
  }
}
```

---

## 🔑 Authentication

### Token Format
```
Authorization: Bearer <jwt-token>
```

### Token Payload
```json
{
  "userId": "user_id",
  "role": "user",
  "iat": 1234567890,
  "exp": 1235172690
}
```

### Token Refresh Strategy
- Tokens expire after 7 days
- On token expiration, users must login again
- Production: Implement token refresh endpoint

---

## 🗄 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user | admin),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (pending | in-progress | completed),
  priority: String (low | medium | high),
  dueDate: Date,
  owner: ObjectId (ref: User),
  tags: [String],
  isCompleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- User: `email` (unique)
- Task: `owner`, `status`, `createdAt`, `owner + status`

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common Status Codes
- **400:** Bad Request (validation error)
- **401:** Unauthorized (missing/invalid token)
- **403:** Forbidden (insufficient permissions)
- **404:** Not Found
- **429:** Too Many Requests (rate limited)
- **500:** Internal Server Error

### Example Error Responses

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

**Authentication Error:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Authorization Error:**
```json
{
  "success": false,
  "message": "Access denied. Required role(s): admin"
}
```

---

## 🔒 Security

### Implemented Security Features

1. **Password Security**
   - Hashed with bcryptjs (10 salt rounds)
   - Never returned in responses
   - Min 6 characters with letters and numbers

2. **Token Security**
   - JWT with HS256 algorithm
   - Secure secret key in .env
   - 7-day expiration
   - Sent via Authorization header

3. **Input Validation**
   - Email format validation
   - String length limits
   - Enum validation for status/priority
   - Sanitization of input

4. **API Security**
   - CORS enabled with specific origin
   - Rate limiting (100 req/15 min)
   - Morgan logging
   - Error messages don't expose internals

5. **Ownership Validation**
   - Users can only see/modify their tasks
   - Admin can access all tasks

### Security Best Practices
- Never commit `.env` file
- Use strong JWT_SECRET (32+ characters)
- Change passwords regularly
- Monitor rate limit alerts
- Use HTTPS in production
- Implement request signing

---

## 📈 Scalability

### Current Architecture
- **Monolithic:** Single Express server
- **Database:** MongoDB with proper indexing
- **API:** RESTful with clear separation of concerns

### Scaling Strategies

#### 1. Horizontal Scaling
```
Load Balancer
    ↓
[Server 1] [Server 2] [Server 3]
    ↓
  MongoDB
```
- Deploy multiple instances behind load balancer (AWS ELB, Nginx)
- Use PM2 or Docker containers
- Share session/token validation

#### 2. Database Optimization
- Connection pooling
- Read replicas for heavy queries
- Sharding for large datasets
- Caching layer (Redis)

#### 3. Caching Layer
```javascript
// Add Redis for session/token caching
const redis = require('redis');
const client = redis.createClient();

// Cache user sessions
app.use((req, res, next) => {
  if (req.headers.authorization) {
    const cacheKey = `token:${req.headers.authorization}`;
    // Check cache first
  }
});
```

#### 4. Microservices Architecture
```
API Gateway
    ↓
[Auth Service] [Task Service] [User Service]
    ↓
  MongoDB Cluster
```

#### 5. Caching Strategy
- **In-Memory:** Node cache for frequently accessed data
- **Redis:** Session storage, token validation
- **CDN:** Static assets and API responses
- **Cache Invalidation:** On create/update/delete

#### 6. Database Optimization
- Connection pooling (100-200 connections)
- Replica sets for high availability
- Proper indexes on frequently queried fields
- Data archival for old tasks

#### 7. Message Queuing
```javascript
// For async task processing
const queue = require('bull');
const emailQueue = new queue('emails');

// Send confirmation emails async
emailQueue.add({ email: user.email });
```

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:5000/api/v1/health

# Using wrk
wrk -t4 -c100 -d30s http://localhost:5000/api/v1/health
```

### Monitoring
- APM Tools: New Relic, DataDog
- Logging: ELK Stack (Elasticsearch, Logstash, Kibana)
- Metrics: Prometheus + Grafana
- Alerts: PagerDuty, Slack integration

---

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/task-management
      - JWT_SECRET=your-secret-key
    depends_on:
      - mongo
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Run with Docker Compose
```bash
docker-compose up -d
```

---

## 🚀 Production Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/task-management
JWT_SECRET=<STRONG_RANDOM_KEY_32_CHARS>
JWT_EXPIRY=7d
FRONTEND_URL=https://yourdomain.com
LOG_LEVEL=info
```

### Deployment Checklist
- [ ] Set secure JWT_SECRET
- [ ] Use MongoDB Atlas or managed MongoDB
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging
- [ ] Configure backups
- [ ] Use environment-specific configs
- [ ] Enable rate limiting
- [ ] Set up CI/CD pipeline
- [ ] Test all endpoints
- [ ] Document API thoroughly

### Deployment Platforms
- **Heroku:** Simple deployment
- **AWS:** EC2, ECS, or Elastic Beanstalk
- **DigitalOcean:** App Platform or Droplets
- **Railway:** Easy Node.js deployment
- **Render:** Free tier available

---

## 📊 API Versioning

Current version: **v1**

Future versions can be added as:
- `/api/v2/auth/login`
- `/api/v2/tasks`

Backward compatibility maintained for older versions.

---

## 🧪 Testing Endpoints

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Pass123","confirmPassword":"Pass123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Pass123"}'
```

**Create Task:**
```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"My Task","priority":"high"}'
```

### Using Postman
1. Import the Postman collection: `postman_collection.json`
2. Set environment variables: `token`, `baseUrl`
3. Run requests in order

---

## 📝 Logging

### Morgan Logging
```
GET /api/v1/tasks 200 - 45.230 ms
POST /api/v1/tasks 201 - 120.105 ms
PUT /api/v1/tasks/:id 200 - 85.340 ms
DELETE /api/v1/tasks/:id 200 - 25.120 ms
```

### Error Logging
```
Error: Invalid token
  at authenticate (middleware/auth.js:12:5)
  at Layer.handle (...)
  at next (...)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

For issues and questions:
- Email: support@example.com
- GitHub Issues: [Create Issue](https://github.com/yourrepo/issues)
- Documentation: [Full Docs](https://docs.example.com)

---

## 🎯 Future Enhancements

- [ ] Email notifications
- [ ] Task reminders
- [ ] Real-time updates (WebSocket)
- [ ] File attachments
- [ ] Task dependencies
- [ ] Team collaboration
- [ ] Mobile app
- [ ] Analytics dashboard

---

**Last Updated:** January 2024
**API Version:** 1.0.0
