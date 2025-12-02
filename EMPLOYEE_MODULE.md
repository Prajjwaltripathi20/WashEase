# Employee Management Module Documentation

## 📋 Overview

The Employee Management Module provides a complete system for laundry employees to manage orders, track status updates, and maintain activity logs. This module includes both backend APIs and a protected frontend dashboard.

## 🏗️ Architecture

### Backend Components

1. **Employee Authentication**
   - JWT-based login system
   - Role verification (washer/admin only)
   - Secure token generation

2. **Order Management APIs**
   - Get assigned orders
   - Accept/Reject orders
   - Update order status with validation
   - Activity logging

3. **Database Schema Updates**
   - Laundry model extended with:
     - `assignedTo` - Employee assignment
     - `activityLog` - Complete status change history
     - Extended status enum

### Frontend Components

1. **Employee Login Page** (`/employee/login`)
   - Clean, modern design
   - Email/password authentication
   - Error handling

2. **Employee Dashboard** (`/employee/dashboard`)
   - Statistics overview
   - Order list with filters
   - Real-time updates

3. **Order Details Page** (`/employee/orders/:id`)
   - Complete order information
   - Status update buttons
   - Activity timeline
   - Accept/Reject functionality

## 🔐 Authentication

### Employee Login

**Endpoint:** `POST /api/employee/login`

**Request:**
```json
{
  "email": "employee@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "employee_id",
  "name": "Employee Name",
  "email": "employee@example.com",
  "role": "washer",
  "token": "jwt_token_here"
}
```

**Access:** Only users with `washer` or `admin` role can login.

## 📡 API Endpoints

### 1. Get Assigned Orders
**Endpoint:** `GET /api/employee/orders`  
**Access:** Private (Employee)  
**Description:** Returns all orders assigned to the logged-in employee or pending orders

**Response:**
```json
[
  {
    "_id": "order_id",
    "user": {
      "name": "Customer Name",
      "email": "customer@example.com",
      "roomNumber": "101",
      "hostelBlock": "A"
    },
    "assignedTo": {
      "name": "Employee Name",
      "email": "employee@example.com"
    },
    "clothes": [
      {
        "itemType": "T-Shirt",
        "quantity": 3
      }
    ],
    "status": "accepted",
    "activityLog": [...]
  }
]
```

### 2. Accept Order
**Endpoint:** `POST /api/employee/orders/:id/accept`  
**Access:** Private (Employee)  
**Description:** Accepts a pending order and assigns it to the employee

**Response:** Updated order object with `status: "accepted"` and activity log entry

### 3. Reject Order
**Endpoint:** `POST /api/employee/orders/:id/reject`  
**Access:** Private (Employee)  
**Description:** Rejects a pending order with optional reason

**Request:**
```json
{
  "reason": "Unable to process this order"
}
```

**Response:** Updated order object with `status: "rejected"` and activity log entry

### 4. Update Order Status
**Endpoint:** `PUT /api/employee/orders/:id/status`  
**Access:** Private (Employee)  
**Description:** Updates order status with validation

**Request:**
```json
{
  "status": "picked_up",
  "notes": "Picked up from room 101"
}
```

**Valid Status Flow:**
```
accepted → picked_up → in_process → washed → ironed → ready → delivered
```

**Response:** Updated order object with new status and activity log entry

### 5. Get Order Details
**Endpoint:** `GET /api/employee/orders/:id`  
**Access:** Private (Employee)  
**Description:** Returns complete order details including activity log

## 📊 Status Flow

The order status follows a strict progression:

1.  **pending** - Order created, awaiting employee acceptance
2.  **accepted** - Employee accepted the order
3.  **picked_up** - Items collected from customer
4.- `in_progress`: Laundry is being washed/processed
5.  **washed** - Washing completed
6.  **ironed** - Ironing completed
7.  **ready** - Ready for delivery
8.  **delivered** - Successfully delivered

**Special Status:**
- **rejected** - Order rejected by employee (with reason)

## 📝 Activity Logging

Every status change is automatically logged with:
- Status value
- Employee who made the change
- Timestamp
- Optional notes

**Activity Log Structure:**
```json
{
  "status": "picked_up",
  "updatedBy": {
    "_id": "employee_id",
    "name": "Employee Name",
    "email": "employee@example.com"
  },
  "updatedAt": "2024-01-01T12:00:00.000Z",
  "notes": "Picked up from room 101"
}
```

## 🎨 Frontend Features

### Employee Dashboard

**Features:**
- Statistics cards (Total, Pending, Assigned, In Progress, Ready, Delivered)
- Filter buttons (All, Pending, My Orders, Ready)
- Order list with status badges
- Click to view details

**UI Elements:**
- Loading indicators
- Error messages
- Real-time updates
- Responsive design

### Order Details Page

**Features:**
- Customer information display
- Items list with quantities
- Current status badge
- Accept/Reject buttons (for pending orders)
- Status update buttons (step-by-step progression)
- Activity timeline with full history
- Special instructions display
- Notes input for status updates

**Status Update Buttons:**
- Only shows next valid status
- Disabled when not assigned to employee
- Includes loading states
- Optional notes field

## 🔒 Security Features

1. **Role-Based Access**
   - Only `washer` or `admin` roles can access employee routes
   - Middleware validates role on every request

2. **Token Authentication**
   - JWT tokens required for all protected routes
   - Tokens expire after 30 days
   - Auto-logout on token expiration

3. **Assignment Validation**
   - Employees can only update orders assigned to them
   - Status progression validation prevents invalid changes

4. **Input Validation**
   - All inputs validated on backend
   - Error messages for invalid operations

## 🚀 Usage Guide

### For Employees

1. **Login:**
   - Navigate to `/employee/login`
   - Enter email and password
   - Redirected to dashboard

2. **View Orders:**
   - Dashboard shows all available orders
   - Filter by status or view assigned orders
   - Click any order to view details

3. **Accept Order:**
   - Click "Accept Order" on pending orders
   - Order is assigned to you
   - Status changes to "accepted"

4. **Update Status:**
   - Click status update buttons in sequence
   - Add optional notes
   - Status progresses automatically

5. **Reject Order:**
   - Click "Reject Order" on pending orders
   - Provide rejection reason
   - Order status changes to "rejected"

### For Administrators

- Create employee accounts with `role: "washer"` or `role: "admin"`
- Employees use same User model but with different role
- All employee actions are logged in activity log

## 📱 Mobile Responsive

All employee pages are fully responsive:
- Mobile-friendly layouts
- Touch-optimized buttons
- Readable on all screen sizes

## 🧪 Testing

### Test Employee Login

```bash
curl -X POST http://localhost:5001/api/employee/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@example.com",
    "password": "password123"
  }'
```

### Test Get Orders

```bash
curl -X GET http://localhost:5001/api/employee/orders \
  -H "Authorization: Bearer <employee_token>"
```

### Test Accept Order

```bash
curl -X POST http://localhost:5001/api/employee/orders/<order_id>/accept \
  -H "Authorization: Bearer <employee_token>"
```

### Test Update Status

```bash
curl -X PUT http://localhost:5001/api/employee/orders/<order_id>/status \
  -H "Authorization: Bearer <employee_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "picked_up",
    "notes": "Picked up successfully"
  }'
```

## 🔄 Integration

The employee module integrates seamlessly with:
- Existing user authentication system
- Laundry order management
- Admin dashboard
- Customer dashboard

## 📚 Related Files

**Backend:**
- `server/controllers/employeeController.js` - Employee API logic
- `server/routes/employeeRoutes.js` - Employee routes
- `server/middleware/employeeMiddleware.js` - Employee authentication
- `server/models/Laundry.js` - Updated with activity logs

**Frontend:**
- `client/src/context/EmployeeContext.jsx` - Employee state management
- `client/src/pages/EmployeeLogin.jsx` - Login page
- `client/src/pages/EmployeeDashboard.jsx` - Dashboard
- `client/src/pages/EmployeeOrderDetails.jsx` - Order details
- `client/src/components/EmployeeNavbar.jsx` - Employee navigation

## 🎯 Key Features Summary

✅ JWT-based employee authentication  
✅ Role-based access control  
✅ Order assignment system  
✅ Status progression with validation  
✅ Complete activity logging  
✅ Accept/Reject functionality  
✅ Real-time UI updates  
✅ Mobile-responsive design  
✅ Error handling and validation  
✅ Protected routes  
✅ Activity timeline visualization  

---

*Last Updated: 2024*

