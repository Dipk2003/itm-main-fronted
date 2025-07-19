# iTech Backend-Frontend Integration Guide

## 🚀 Quick Start

### Prerequisites
- Java 21+ installed and in PATH
- Node.js 18+ and npm installed
- MySQL server running (XAMPP, WAMP, or standalone)
- Git installed

### Easy Start Option
1. **Double-click** `start-servers.bat` to start both servers automatically
2. **Or run**: `npm run start-integration`

### Manual Start Option
1. **Start Backend**: 
   ```bash
   cd D:\itech-backend\itech-backend
   ./mvnw.cmd spring-boot:run
   ```

2. **Start Frontend**:
   ```bash
   cd "C:\Users\Dipanshu pandey\OneDrive\Desktop\itm-main-fronted-main"
   npm install
   npm run dev
   ```

## 📋 Project Structure

```
iTech Project/
├── Backend (Spring Boot)
│   └── D:\itech-backend\itech-backend\
│       ├── src/main/java/com/itech/itech_backend/
│       ├── src/main/resources/application.properties
│       ├── pom.xml
│       └── uploads/ (file storage)
│
└── Frontend (Next.js)
    └── C:\Users\Dipanshu pandey\OneDrive\Desktop\itm-main-fronted-main\
        ├── src/app/ (Next.js pages)
        ├── src/components/
        ├── src/lib/ (API integration)
        ├── .env.local (environment config)
        └── package.json
```

## 🔧 Configuration Details

### Backend Configuration
- **Port**: 8080
- **Database**: MySQL (localhost:3306/itech_db)
- **JWT Secret**: Configured in application.properties
- **CORS**: Enabled for all origins
- **File Uploads**: Stored in `uploads/` directory

### Frontend Configuration
- **Port**: 3000
- **API URL**: http://localhost:8080
- **Environment**: Configured in `.env.local`
- **Framework**: Next.js 15+ with TypeScript

## 🌐 API Integration

### Key API Endpoints
```
Authentication:
- POST /auth/user/register
- POST /auth/user/login
- POST /auth/vendor/register
- POST /auth/vendor/login
- GET  /auth/profile

Products:
- GET    /api/products
- POST   /api/products
- GET    /api/products/{id}
- PUT    /api/products/{id}
- DELETE /api/products/{id}

Orders:
- GET  /api/orders
- POST /api/orders
- GET  /api/orders/{id}

Cart:
- GET    /api/cart
- POST   /api/cart/add
- DELETE /api/cart/{id}
```

### Frontend API Client
The frontend uses Axios with the following configuration:
- Base URL: `http://localhost:8080`
- JWT token automatically added to requests
- CORS enabled with credentials
- Error handling for 401/403 responses

## 🚦 Server URLs

Once both servers are running:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend App | http://localhost:3000 | Main application |
| Backend API | http://localhost:8080 | REST API server |
| API Health | http://localhost:8080/actuator/health | Backend health check |
| API Test | http://localhost:8080/test | Backend test endpoint |

## 🔐 Authentication Flow

1. **User Registration/Login**: Frontend sends credentials to `/auth/user/login`
2. **JWT Token**: Backend returns JWT token
3. **Token Storage**: Frontend stores token in localStorage
4. **API Requests**: Token included in Authorization header
5. **Automatic Logout**: On token expiration or 401 errors

## 📁 File Upload Integration

- **Backend**: Files stored in `uploads/` directory
- **Access**: Files accessible via `/api/files/**` URLs
- **Frontend**: Upload forms use FormData with proper headers
- **Supported**: Images, documents, Excel files for bulk import

## 🛠️ Database Setup

### MySQL Database Configuration
```sql
-- Create database
CREATE DATABASE itech_db;

-- Create user (optional)
CREATE USER 'itech_user'@'localhost' IDENTIFIED BY 'itech_password';
GRANT ALL PRIVILEGES ON itech_db.* TO 'itech_user'@'localhost';
FLUSH PRIVILEGES;
```

### Default Configuration
The backend is configured to use:
- **Host**: localhost:3306
- **Database**: itech_db
- **Username**: root
- **Password**: root

## 🔧 Troubleshooting

### Common Issues

#### Backend Won't Start
- ✅ Check if Java 21+ is installed: `java -version`
- ✅ Check if MySQL is running
- ✅ Check database connection in application.properties
- ✅ Check if port 8080 is available

#### Frontend Won't Start
- ✅ Check if Node.js is installed: `node --version`
- ✅ Run `npm install` to install dependencies
- ✅ Check if port 3000 is available
- ✅ Verify `.env.local` configuration

#### API Connection Issues
- ✅ Check backend is running on http://localhost:8080
- ✅ Check CORS configuration in backend
- ✅ Verify API_URL in frontend environment
- ✅ Check browser network tab for errors

#### Database Connection
- ✅ Start MySQL server (XAMPP/WAMP Control Panel)
- ✅ Create database: `CREATE DATABASE itech_db;`
- ✅ Check MySQL credentials in application.properties
- ✅ Test connection: `mysql -u root -p`

### Logs and Debugging

#### Backend Logs
- Spring Boot logs appear in the console
- Check for database connection errors
- JWT configuration issues logged as DEBUG

#### Frontend Logs
- Next.js logs in terminal
- Browser console for client-side errors
- Network tab for API call failures

## 📦 Development Workflow

### Making Changes

1. **Backend Changes**:
   - Edit Java files in `src/main/java/com/itech/itech_backend/`
   - Spring Boot auto-reloads on file changes
   - Database changes may require restart

2. **Frontend Changes**:
   - Edit files in `src/app/`, `src/components/`, etc.
   - Next.js hot-reloads automatically
   - API changes require backend restart

### Environment Switching

#### Development (Local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NODE_ENV=development
```

#### Production
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NODE_ENV=production
```

## 🚀 Deployment

### Backend Deployment
- Build: `mvn clean package`
- Run: `java -jar target/itech-backend-0.0.1-SNAPSHOT.jar`
- Docker: Use included Dockerfile

### Frontend Deployment
- Build: `npm run build`
- Start: `npm start`
- Static export: `npm run export` (if configured)

## 📞 Support

### Getting Help
1. Check this integration guide
2. Review console logs (both backend and frontend)
3. Check network requests in browser DevTools
4. Verify environment configuration
5. Test API endpoints directly (Postman/curl)

### Common Commands
```bash
# Backend
cd D:\itech-backend\itech-backend
./mvnw.cmd clean compile  # Clean build
./mvnw.cmd spring-boot:run # Start server

# Frontend
cd "C:\Users\Dipanshu pandey\OneDrive\Desktop\itm-main-fronted-main"
npm install               # Install dependencies
npm run dev              # Start development server
npm run build            # Build for production
```

---

**Happy Coding! 🎉**

Both your backend and frontend are now properly integrated and ready for development!
