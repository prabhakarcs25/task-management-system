# 🚀 Deployment Guide

Complete guide for deploying the Task Management System to production.

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All code is reviewed and tested
- [ ] No console.log statements (use proper logging)
- [ ] No hardcoded secrets or credentials
- [ ] Error handling implemented
- [ ] Input validation in place
- [ ] CORS configured for production domain

### Security
- [ ] JWT_SECRET is 32+ random characters
- [ ] Database password is strong (16+ chars)
- [ ] HTTPS/SSL enabled
- [ ] CORS origins are specific (not *)
- [ ] Rate limiting active
- [ ] No sensitive data in logs
- [ ] API authentication tested

### Database
- [ ] MongoDB backup strategy planned
- [ ] Indexes created
- [ ] Connection pooling configured
- [ ] Replica set for high availability (optional)
- [ ] Automatic backups enabled

### Infrastructure
- [ ] Server capacity adequate
- [ ] Auto-scaling configured
- [ ] Load balancer setup
- [ ] DNS configured
- [ ] SSL certificate installed
- [ ] Firewall rules configured

### Monitoring
- [ ] Error tracking setup (Sentry)
- [ ] Performance monitoring (DataDog, New Relic)
- [ ] Log aggregation (ELK Stack)
- [ ] Uptime monitoring (Pingdom, Statuspage)
- [ ] Alerts configured

---

## 🚀 Deployment Options

### Option 1: Heroku (Simplest)

#### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository

#### Steps

**1. Create Heroku Apps**
```bash
# Create backend app
heroku create task-management-api
heroku create task-management-ui

# Or use existing app
heroku apps:destroy task-management-api --confirm
heroku create task-management-api
```

**2. Configure Environment Variables**
```bash
# Backend
heroku config:set \
  NODE_ENV=production \
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/task-management \
  JWT_SECRET=your-32-char-random-secret \
  JWT_EXPIRY=7d \
  FRONTEND_URL=https://task-management-ui.herokuapp.com \
  -a task-management-api

# Frontend
heroku config:set \
  REACT_APP_API_URL=https://task-management-api.herokuapp.com/api/v1 \
  -a task-management-ui
```

**3. Deploy Backend**
```bash
cd backend
git subtree push --prefix backend heroku main
# or
heroku deploy:github -a task-management-api
```

**4. Deploy Frontend**
```bash
cd frontend
git subtree push --prefix frontend heroku main
# or
heroku deploy:github -a task-management-ui
```

**5. Verify Deployment**
```bash
# Check backend logs
heroku logs --tail -a task-management-api

# Check frontend logs
heroku logs --tail -a task-management-ui

# Test API
curl https://task-management-api.herokuapp.com/api/v1/health
```

### Option 2: AWS Elastic Beanstalk

#### Prerequisites
- AWS account
- AWS CLI configured
- EB CLI installed

#### Steps

**1. Create EB Environment**
```bash
cd backend
eb init -p node.js-18 task-management-api --region us-east-1
eb create task-management-prod
```

**2. Configure Environment Variables**
```bash
eb setenv \
  NODE_ENV=production \
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/task-management \
  JWT_SECRET=your-32-char-random-secret \
  FRONTEND_URL=https://yourdomain.com
```

**3. Deploy**
```bash
eb deploy
```

**4. View Logs**
```bash
eb logs
```

**5. Monitor**
```bash
eb status
eb open
```

### Option 3: DigitalOcean App Platform

#### Prerequisites
- DigitalOcean account
- GitHub repository connected

#### Steps

**1. Create App from GitHub**
- Go to DigitalOcean Dashboard
- Click "Create" → "Apps"
- Select GitHub repository
- Authorize GitHub access

**2. Configure Build Settings**
```yaml
name: task-management-system
services:
  - name: backend
    github:
      path: backend
    build_command: npm install && npm run build
    run_command: npm start
    
  - name: frontend
    github:
      path: frontend
    build_command: npm install && npm run build
    run_command: npm start
```

**3. Set Environment Variables**
- Backend:
  - MONGODB_URI
  - JWT_SECRET
  - FRONTEND_URL

**4. Deploy**
- Click "Deploy"
- Monitor progress
- Test endpoints

### Option 4: Docker + AWS ECS

#### Prerequisites
- AWS account with ECR access
- Docker installed
- AWS CLI configured

#### Steps

**1. Create ECR Repository**
```bash
aws ecr create-repository --repository-name task-api
aws ecr create-repository --repository-name task-ui
```

**2. Build and Push Images**
```bash
# Backend
cd backend
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
docker build -t task-api .
docker tag task-api:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/task-api:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/task-api:latest

# Frontend
cd ../frontend
docker build -t task-ui .
docker tag task-ui:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/task-ui:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/task-ui:latest
```

**3. Create ECS Cluster**
```bash
aws ecs create-cluster --cluster-name task-management
```

**4. Register Task Definitions**
```bash
aws ecs register-task-definition --cli-input-json file://task-definition-backend.json
aws ecs register-task-definition --cli-input-json file://task-definition-frontend.json
```

**5. Create Services**
```bash
aws ecs create-service \
  --cluster task-management \
  --service-name task-api \
  --task-definition task-api \
  --desired-count 2 \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=task-api,containerPort=5000
```

### Option 5: Render (Easiest Alternative)

#### Prerequisites
- Render account
- GitHub repository

#### Steps

**1. Deploy Backend**
- Go to render.com
- Click "New +" → "Web Service"
- Connect GitHub repo
- Select branch: main
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables
- Deploy

**2. Deploy Frontend**
- Click "New +" → "Static Site"
- Connect GitHub repo
- Build command: `npm install && npm run build`
- Publish directory: `build`
- Add environment variable: `REACT_APP_API_URL`
- Deploy

---

## 🔒 Security Configuration

### HTTPS/SSL Setup

**Using Let's Encrypt (Free)**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

**Using AWS Certificate Manager**
- Request certificate in ACM
- Validate domain
- Attach to CloudFront/ALB

### Environment Variables Template

```env
# Node Environment
NODE_ENV=production
LOG_LEVEL=info

# Server Configuration
PORT=5000
HOST=0.0.0.0

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management?retryWrites=true&w=majority

# Authentication
JWT_SECRET=generate-strong-random-secret-32-chars-minimum
JWT_EXPIRY=7d

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com

# Logging
LOG_LEVEL=error
SENTRY_DSN=your-sentry-dsn

# Optional: Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### SSL/TLS Configuration

**Nginx Configuration**
```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 Monitoring & Logging

### Error Tracking with Sentry

**1. Create Sentry Account**
- Sign up at sentry.io
- Create project for Node.js
- Get DSN

**2. Integrate with Backend**
```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
// ... your routes ...
app.use(Sentry.Handlers.errorHandler());
```

### Logging Setup

**Winston Logger**
```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('Application started');
```

### Performance Monitoring

**Using DataDog**
```bash
npm install dd-trace
```

```javascript
const tracer = require('dd-trace').init();
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

**.github/workflows/deploy.yml**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install & Test Backend
        run: |
          cd backend
          npm install
          npm test
      
      - name: Install & Build Frontend
        run: |
          cd frontend
          npm install
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Heroku
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          git push https://heroku:$HEROKU_API_KEY@git.heroku.com/task-management-api.git main
          git push https://heroku:$HEROKU_API_KEY@git.heroku.com/task-management-ui.git main
```

---

## 📈 Scaling Configuration

### Load Balancer Setup (Nginx)

```nginx
upstream backend {
    least_conn;
    server backend-1:5000;
    server backend-2:5000;
    server backend-3:5000;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Database Optimization

**MongoDB Connection Pooling**
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 50,
  minPoolSize: 10,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority'
});
```

---

## 🧪 Post-Deployment Testing

### Health Checks
```bash
# Test API
curl https://api.yourdomain.com/api/v1/health

# Test Frontend
curl https://yourdomain.com
```

### Smoke Tests
```bash
# Register
curl -X POST https://api.yourdomain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123","confirmPassword":"Test123"}'

# Login
curl -X POST https://api.yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}'
```

### Performance Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 https://api.yourdomain.com/api/v1/health

# Using wrk
wrk -t4 -c100 -d30s https://api.yourdomain.com/api/v1/health
```

---

## 📚 Useful Commands

### Database Backup
```bash
# MongoDB
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/task-management" --out ./backup

# Restore
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/task-management" ./backup
```

### View Logs
```bash
# Heroku
heroku logs --tail -a task-management-api

# Docker
docker logs task-management-api

# System
tail -f /var/log/app.log
```

### Restart Services
```bash
# Docker Compose
docker-compose restart

# Heroku
heroku dyno:restart -a task-management-api

# PM2
pm2 restart task-api
```

---

## 🚨 Troubleshooting

### API Connection Issues
- Check MongoDB URI
- Verify firewall rules
- Check network connectivity
- Review error logs

### High Memory Usage
- Monitor MongoDB connections
- Check for memory leaks
- Optimize queries
- Increase available memory

### Slow API Response
- Check database indexes
- Review query performance
- Monitor server load
- Consider caching

### CORS Errors
- Verify FRONTEND_URL
- Check allowed origins
- Test from different domains

---

## 📞 Support

For deployment issues:
- Check logs first
- Review error messages
- Consult provider documentation
- Contact support team

---

**Last Updated:** January 2024
