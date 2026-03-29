# 🎯 Task Management System - Full Stack Application

A production-ready full-stack web application featuring secure user authentication, role-based access control, and comprehensive task management. Built with Node.js/Express backend and React frontend.



https://task-management-system-ui-k8dy.onrender.com


## 📸 Overview

```
┌─────────────────────────────────────────┐
│    Frontend (React 18)                  │
│  - Login/Register                       │
│  - Dashboard with Task Management       │
│  - Responsive Design                    │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────┐
│    Backend (Express.js)                 │
│  - JWT Authentication                   │
│  - Role-Based Access Control            │
│  - Task CRUD Operations                 │
│  - Rate Limiting & Validation           │
└──────────────┬──────────────────────────┘
               │ MongoDB Driver
┌──────────────▼──────────────────────────┐
│    Database (MongoDB)                   │
│  - User Collection                      │
│  - Task Collection                      │
│  - Indexes & Optimization               │
└─────────────────────────────────────────┘
```

## ✨ Key Features

### 🔐 Security
- ✅ Secure user authentication with JWT
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (User/Admin)
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Rate limiting

### 📋 Task Management
- ✅ Full CRUD operations on tasks
- ✅ Task filtering by status and priority
- ✅ Pagination support
- ✅ Task ownership validation
- ✅ Admin statistics dashboard

### 🎨 User Experience
- ✅ Responsive mobile-first design
- ✅ Real-time form validation
- ✅ Success/error notifications
- ✅ Loading states
- ✅ Clean, intuitive UI

### 📈 Scalability
- ✅ Modular project structure
- ✅ Database indexing
- ✅ API versioning (v1)
- ✅ Prepared for microservices
- ✅ Docker support

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 4.18
- **Database:** MongoDB
- **Authentication:** JWT
- **Validation:** express-validator
- **Password:** bcryptjs
- **Logging:** Morgan
- **Rate Limiting:** express-rate-limit

### Frontend
- **Framework:** React 18
- **Routing:** React Router 6
- **HTTP:** Axios
- **Styling:** CSS3 with variables
- **Build:** Create React App

### DevOps
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Version Control:** Git

## 📁 Project Structure

```
task-management-system/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── server.js
│   ├── README.md
│   ├── Dockerfile
│   └── postman_collection.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskFilter.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md (this file)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start backend
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Default API URL is http://localhost:5000/api/v1

# Start frontend
npm start
# App opens on http://localhost:3000
```

### 3. Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/v1
- **Postman Collection:** Import `backend/postman_collection.json`

## 🐳 Docker Setup

### Using Docker Compose
```bash
# Build and start all services
docker-compose up -d

# Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
# - MongoDB: localhost:27017

# Stop services
docker-compose down
```

### Manual Docker Setup

**Backend:**
```bash
cd backend
docker build -t task-api .
docker run -p 5000:5000 -e MONGODB_URI=mongodb://mongo:27017/task-management task-api
```

**Frontend:**
```bash
cd frontend
docker build -t task-ui .
docker run -p 3000:3000 task-ui
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (protected)

### Tasks (All protected)
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks` - Get all tasks with filters
- `GET /api/v1/tasks/:id` - Get single task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `GET /api/v1/tasks/stats/all` - Get statistics (admin only)

## 🔑 Sample Credentials

### Test Account
```
Email: demo@example.com
Password: Demo123
```

*Create your own account by registering on the application.*

## 📚 Detailed Documentation

- **Backend Setup & API Docs:** [backend/README.md](./backend/README.md)
- **Frontend Setup & Usage:** [frontend/README.md](./frontend/README.md)

## 🔒 Security Features

### Password Security
- Minimum 6 characters
- Must contain letters and numbers
- Hashed with bcryptjs (10 salt rounds)

### JWT Authentication
- 7-day token expiration
- HS256 algorithm
- Secure secret key in environment

### Request Validation
- Email format validation
- Input length limits
- Type checking
- Enum validation

### API Security
- Rate limiting (100 req/15 min)
- CORS enabled
- Morgan request logging
- Error handling without info leakage

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: String ("user" | "admin"),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String ("pending" | "in-progress" | "completed"),
  priority: String ("low" | "medium" | "high"),
  dueDate: Date,
  owner: ObjectId (ref: User),
  tags: [String],
  isCompleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- User: `email`
- Task: `owner`, `status`, `createdAt`, `owner+status`

## 🧪 Testing

### Using Postman
1. Import `backend/postman_collection.json`
2. Set variables: `baseUrl`, `token`
3. Run requests in order

### Manual Testing
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"Test123",
    "confirmPassword":"Test123"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123"
  }'

# Create Task (replace TOKEN)
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My First Task",
    "priority":"high"
  }'
```

## 📈 Scalability Notes

### Current Architecture
- Monolithic Node.js application
- Single MongoDB instance
- Stateless API servers

### Future Scaling Options

#### 1. Horizontal Scaling
```yaml
Load Balancer (Nginx/HAProxy)
├── Server Instance 1
├── Server Instance 2
└── Server Instance 3
    ↓
MongoDB Cluster
```

#### 2. Database Optimization
- MongoDB replication
- Read replicas for heavy queries
- Sharding for large datasets
- Connection pooling

#### 3. Caching Layer
- Redis for session management
- Cache frequently accessed tasks
- Token validation caching

#### 4. Microservices
```
API Gateway
├── Auth Service (Node.js)
├── Task Service (Node.js)
├── Notification Service (Node.js)
└── Analytics Service (Python)
    ↓
Message Queue (RabbitMQ/Kafka)
    ↓
Separate Databases (MongoDB replicas)
```

#### 5. DevOps Pipeline
- GitHub Actions for CI/CD
- Docker image builds
- Automated testing
- Blue-green deployments

## 🚢 Deployment Guide

### Heroku
```bash
# Backend
heroku create task-management-api
heroku config:set MONGODB_URI=your_uri
git push heroku main

# Frontend
netlify deploy --prod --dir=frontend/build
```

### AWS
```bash
# Backend: Elastic Beanstalk or ECS
# Frontend: S3 + CloudFront
# Database: MongoDB Atlas or RDS
```

### DigitalOcean
```bash
# Create Droplet
# Install Node.js and MongoDB
# Clone repository
# Set environment variables
# Start services with PM2
```

### Environment Setup
```env
# Production Backend
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/task-management
JWT_SECRET=<STRONG_KEY_32_CHARS>
FRONTEND_URL=https://yourdomain.com
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      - name: Deploy backend
        run: npm run deploy:backend
      - name: Deploy frontend
        run: npm run deploy:frontend
```

## 📋 Checklist for Deployment

- [ ] Secure JWT_SECRET (32+ chars)
- [ ] MongoDB URI configured
- [ ] CORS domain configured
- [ ] Environment variables set
- [ ] HTTPS/SSL enabled
- [ ] Rate limiting active
- [ ] Logging configured
- [ ] Backups enabled
- [ ] Monitoring setup
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Team access controls

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/name`
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support & Contact

- 📧 Email: support@example.com
- 💬 Issues: [GitHub Issues](https://github.com/yourname/task-management/issues)
- 📖 Docs: [Full Documentation](https://docs.example.com)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ User authentication
- ✅ Task CRUD operations
- ✅ Role-based access
- ✅ REST API

### Phase 2
- [ ] Email notifications
- [ ] Task reminders
- [ ] WebSocket for real-time updates
- [ ] File attachments

### Phase 3
- [ ] Team collaboration
- [ ] Task dependencies
- [ ] Advanced analytics
- [ ] Mobile app

### Phase 4
- [ ] AI task suggestions
- [ ] Voice commands
- [ ] Integration with calendar
- [ ] API marketplace

## ⭐ Highlights

- **Security:** Military-grade JWT + bcrypt password hashing
- **Performance:** Database indexing + pagination
- **Scalability:** Ready for microservices architecture
- **Developer Experience:** Clear code structure + comprehensive docs
- **User Experience:** Modern, responsive, intuitive UI
- **Production Ready:** Error handling, logging, rate limiting

## 🎓 Learning Outcomes

Build this project to learn:
- Node.js & Express backend development
- React frontend development
- JWT authentication & authorization
- MongoDB database design
- REST API design principles
- Full-stack web development
- Docker containerization
- Deployment and DevOps

## 📚 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [React Docs](https://react.dev/)
- [JWT Introduction](https://jwt.io/introduction)

---

## 🎉 Getting Started Now

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd task-management-system
   ```

2. **Setup backend** (see [backend/README.md](./backend/README.md))
   ```bash
   cd backend && npm install && npm run dev
   ```

3. **Setup frontend** (see [frontend/README.md](./frontend/README.md))
   ```bash
   cd frontend && npm install && npm start
   ```

4. **Register and login** at http://localhost:3000

5. **Start managing tasks!** 🚀

---

**Project Version:** 1.0.0  
**Last Updated:** January 2024  
**Maintenance Status:** Active Development  

---

Made with PRABHAKAR SINGH ❤️ for full-stack developers
