# How to Access Admin Dashboard

## Step 1: Create Admin User

### Option A: Using cURL (Command Line)
```bash
curl -X POST http://localhost:8080/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "phone": "9876543210",
    "password": "admin123"
  }'
```

### Option B: Using Browser/Postman
**URL:** `POST http://localhost:8080/auth/admin/register`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "phone": "9876543210",
  "password": "admin123"
}
```

## Step 2: Login as Admin

### Option A: Using cURL
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "admin@example.com",
    "password": "admin123"
  }'
```

### Option B: Using Frontend
1. Go to `http://localhost:3000/login`
2. Enter:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Click Login

## Step 3: Access Admin Dashboard

After successful login, navigate to:
```
http://localhost:3000/dashboard/admin
```

## Alternative: Direct Database Admin Creation

If you have direct database access, you can create an admin user by inserting directly into the users table:

```sql
INSERT INTO users (name, email, phone, password, role, verified, active, created_at, updated_at) 
VALUES ('Admin User', 'admin@example.com', '9876543210', '$2a$10$hashed_password', 'ROLE_ADMIN', true, true, NOW(), NOW());
```

## Notes:
- Make sure your backend is running on `http://localhost:8080`
- Make sure your frontend is running on `http://localhost:3000`
- The admin dashboard has authentication guards that check for `ROLE_ADMIN` or `ADMIN` roles
- If you face any issues, check the browser console for error messages

## Testing the Admin Dashboard
Once you're logged in as admin, you should see:
- Dashboard statistics (users, vendors, products, revenue)
- Navigation tabs (Overview, Users, Vendors, Products, Orders, Support)
- Top selling products list
- Various admin management tools
