# WashEase Project Workflow Guide

## ✅ MongoDB Connection Status
**Your MongoDB is CONNECTED** ✓
- **Host**: localhost:27017
- **Database**: washease
- **Status**: Active

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [HTTP Methods Explained](#http-methods-explained)
3. [Backend Architecture](#backend-architecture)
4. [API Routes & Endpoints](#api-routes--endpoints)
5. [Frontend Routes & Redirects](#frontend-routes--redirects)
6. [Workflow Explanation](#workflow-explanation)
7. [Controllers](#controllers)
8. [Middleware](#middleware)
9. [Models](#models)
10. [How to Filter Data in JavaScript](#how-to-filter-data-in-javascript)

---

## 🎯 Project Overview

**WashEase** is a laundry management system with three user types:
- **Student**: Creates laundry requests
- **Washer/Employee**: Processes laundry orders
- **Admin**: Manages everything

---

## 🔌 HTTP Methods Explained

### **GET** - Read Data
- **Purpose**: Retrieve/fetch data from server
- **Usage**: Getting lists, details, information
- **Example**: Get all laundry orders, get user profile
- **No body data sent** (data comes in URL params or query strings)

### **POST** - Create Data
- **Purpose**: Create new resources/submit data
- **Usage**: Registration, login, creating orders
- **Example**: Sign up, create laundry request
- **Sends data in request body** (JSON)

### **PUT** - Update/Replace Data
- **Purpose**: Update existing resources (full update)
- **Usage**: Modify complete records
- **Example**: Update laundry status
- **Sends data in request body**

### **PATCH** - Partial Update
- **Purpose**: Update specific fields only
- **Usage**: Modify one or few fields
- **Example**: Update only status field

### **DELETE** - Remove Data
- **Purpose**: Delete resources
- **Usage**: Remove records
- **Example**: Delete an order (if implemented)

---

## 🏗️ Backend Architecture

```
Request Flow:
Client → Route → Middleware → Controller → Model → Database
                ↓
              Response
```

### Request Lifecycle:
1. **Route** matches the HTTP method and URL
2. **Middleware** validates authentication/authorization
3. **Controller** processes business logic
4. **Model** interacts with database
5. **Response** sent back to client

---

## 🌐 API Routes & Endpoints

### Base URL: `http://localhost:5001/api`

### 1. **Authentication Routes** (`/api/auth`)

#### **POST /api/auth/signup**
- **Method**: POST
- **Purpose**: Register new user
- **Access**: Public (no auth required)
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student",
    "hostelBlock": "A",
    "roomNumber": "101"
  }
  ```
- **Response**: User data + JWT token
- **Controller**: `registerUser` in `authController.js`

#### **POST /api/auth/login**
- **Method**: POST
- **Purpose**: User login
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: User data + JWT token
- **Controller**: `loginUser` in `authController.js`

---

### 2. **Laundry Routes** (`/api/laundry`)

#### **POST /api/laundry**
- **Method**: POST
- **Purpose**: Create new laundry request
- **Access**: Private (requires JWT token)
- **Middleware**: `protect` (checks if user is logged in)
- **Request Body**:
  ```json
  {
    "clothes": [
      { "itemType": "Shirt", "quantity": 3 },
      { "itemType": "Pant", "quantity": 2 }
    ],
    "specialInstructions": "Handle with care"
  }
  ```
- **Controller**: `createLaundryRequest` in `laundryController.js`

#### **GET /api/laundry**
- **Method**: GET
- **Purpose**: Get logged-in user's laundry requests
- **Access**: Private
- **Middleware**: `protect`
- **Response**: Array of user's laundry orders
- **Controller**: `getMyLaundry` in `laundryController.js`

#### **GET /api/laundry/all**
- **Method**: GET
- **Purpose**: Get all laundry requests (for admin/washer)
- **Access**: Private
- **Middleware**: `protect`
- **Response**: Array of all laundry orders
- **Controller**: `getAllLaundry` in `laundryController.js`

#### **PUT /api/laundry/:id**
- **Method**: PUT
- **Purpose**: Update laundry status
- **Access**: Private
- **Middleware**: `protect`
- **URL Parameter**: `:id` - laundry order ID
- **Request Body**:
  ```json
  {
    "status": "picked_up"  // or "in_progress", "ready", "delivered"
  }
  ```
- **Controller**: `updateLaundryStatus` in `laundryController.js`

---

### 3. **Employee Routes** (`/api/employee`)

#### **POST /api/employee/login**
- **Method**: POST
- **Purpose**: Employee login (washer/admin only)
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "washer@example.com",
    "password": "password123"
  }
  ```
- **Controller**: `employeeLogin` in `employeeController.js`

#### **GET /api/employee/orders**
- **Method**: GET
- **Purpose**: Get all assigned/pending orders for employee
- **Access**: Private (Employee only)
- **Middleware**: `employeeAuth` (checks if user is washer/admin)
- **Response**: Array of orders
- **Controller**: `getAssignedOrders` in `employeeController.js`

#### **GET /api/employee/orders/:id**
- **Method**: GET
- **Purpose**: Get single order details
- **Access**: Private (Employee only)
- **Middleware**: `employeeAuth`
- **Controller**: `getOrderDetails` in `employeeController.js`

#### **POST /api/employee/orders/:id/accept**
- **Method**: POST
- **Purpose**: Accept a pending order
- **Access**: Private (Employee only)
- **Middleware**: `employeeAuth`
- **Controller**: `acceptOrder` in `employeeController.js`

#### **POST /api/employee/orders/:id/reject**
- **Method**: POST
- **Purpose**: Reject a pending order
- **Access**: Private (Employee only)
- **Middleware**: `employeeAuth`
- **Request Body**:
  ```json
  {
    "reason": "Too many orders"
  }
  ```
- **Controller**: `rejectOrder` in `employeeController.js`

#### **PUT /api/employee/orders/:id/status**
- **Method**: PUT
- **Purpose**: Update order status (workflow progression)
- **Access**: Private (Employee only)
- **Middleware**: `employeeAuth`
- **Request Body**:
  ```json
  {
    "status": "picked_up",
    "notes": "Order picked up from room 101"
  }
  ```
- **Status Flow**: accepted → picked_up → in_progress → washed → ironed → ready → delivered
- **Controller**: `updateOrderStatus` in `employeeController.js`

---

## 🎨 Frontend Routes & Redirects

### Base URL: `http://localhost:5173` (Vite dev server)

### Public Routes (No Authentication Required)

#### `/` - Home Page
- **Component**: `Home.jsx`
- **Access**: Everyone
- **Redirects**: None

#### `/login` - User Login
- **Component**: `Login.jsx`
- **Access**: Everyone
- **On Success Redirect**:
  - Admin/Washer → `/admin`
  - Student → `/dashboard`

#### `/signup` - User Registration
- **Component**: `Signup.jsx`
- **Access**: Everyone
- **On Success**: Redirects to `/dashboard` or `/admin` (based on role)

#### `/employee/login` - Employee Login
- **Component**: `EmployeeLogin.jsx`
- **Access**: Everyone
- **On Success**: Redirects to `/employee/dashboard`

#### `/saas` - SaaS Landing Page
- **Component**: `SaaSLanding.jsx`
- **Access**: Everyone

---

### Protected Routes (Require Authentication)

#### `/dashboard` - Student Dashboard
- **Component**: `Dashboard.jsx`
- **Access**: Private (logged-in users)
- **Middleware**: `PrivateRoute`
- **If not logged in**: Redirects to `/login`

#### `/admin` - Admin/Washer Dashboard
- **Component**: `AdminDashboard.jsx`
- **Access**: Admin/Washer only
- **Middleware**: `AdminRoute`
- **If not logged in**: Redirects to `/login`
- **If not admin/washer**: Redirects to `/dashboard`

#### `/profile` - User Profile
- **Component**: `Profile.jsx`
- **Access**: Private
- **Middleware**: `PrivateRoute`
- **If not logged in**: Redirects to `/login`

#### `/laundry/:id` - Laundry Details
- **Component**: `LaundryDetails.jsx`
- **Access**: Private
- **Middleware**: `PrivateRoute`
- **URL Parameter**: `:id` - laundry order ID

#### `/employee/dashboard` - Employee Dashboard
- **Component**: `EmployeeDashboard.jsx`
- **Access**: Employee only
- **Middleware**: `EmployeeRoute`
- **If not logged in**: Redirects to `/employee/login`

#### `/employee/orders/:id` - Employee Order Details
- **Component**: `EmployeeOrderDetails.jsx`
- **Access**: Employee only
- **Middleware**: `EmployeeRoute`
- **URL Parameter**: `:id` - order ID

---

## 🔄 Workflow Explanation

### **Student Workflow:**

1. **Registration/Login**
   - User visits `/signup` or `/login`
   - Submits credentials → `POST /api/auth/signup` or `POST /api/auth/login`
   - Receives JWT token → Stored in `localStorage`
   - Redirected to `/dashboard`

2. **Create Laundry Request**
   - Student fills form → `POST /api/laundry`
   - Middleware `protect` verifies JWT token
   - Controller creates order with status: "pending"
   - Response: New order details

3. **View Orders**
   - Dashboard loads → `GET /api/laundry`
   - Middleware `protect` verifies JWT token
   - Controller fetches user's orders from database
   - Orders displayed on dashboard

4. **View Order Details**
   - Click order → Navigate to `/laundry/:id`
   - Fetches order details (could use same endpoint)

---

### **Employee/Washer Workflow:**

1. **Employee Login**
   - Visit `/employee/login`
   - Submits credentials → `POST /api/employee/login`
   - Controller checks if role is "washer" or "admin"
   - Receives JWT token → Stored in `localStorage` (as `employeeInfo`)
   - Redirected to `/employee/dashboard`

2. **View Available Orders**
   - Dashboard loads → `GET /api/employee/orders`
   - Middleware `employeeAuth` verifies JWT + role check
   - Controller fetches:
     - Orders assigned to employee
     - Pending orders (not assigned)
   - Orders displayed

3. **Accept Order**
   - Click "Accept" → `POST /api/employee/orders/:id/accept`
   - Middleware `employeeAuth` verifies authorization
   - Controller:
     - Checks if order is pending
     - Assigns order to employee
     - Updates status to "accepted"
     - Adds to activity log

4. **Update Order Status**
   - Change status → `PUT /api/employee/orders/:id/status`
   - Controller validates status progression
   - Updates status, dates, activity log

---

## 🎮 Controllers

**Purpose**: Handle business logic and coordinate between routes and database

### **Location**: `server/controllers/`

### 1. **authController.js**

#### `registerUser(req, res)`
- Validates database connection
- Checks if user already exists
- Creates new user with hashed password
- Returns user data + JWT token
- **Error Handling**: 400 (user exists), 500 (server error)

#### `loginUser(req, res)`
- Validates email and password
- Finds user by email
- Compares password (using bcrypt)
- Returns user data + JWT token if valid
- **Error Handling**: 401 (invalid credentials), 500 (server error)

---

### 2. **laundryController.js**

#### `createLaundryRequest(req, res)`
- Validates clothes array
- Creates new Laundry document
- Links to user via `req.user._id` (from middleware)
- Sets status: "pending"
- Returns created order

#### `getMyLaundry(req, res)`
- Finds all orders where `user === req.user._id`
- Sorts by `createdAt` (newest first)
- Populates user data
- Returns array of orders

#### `getAllLaundry(req, res)`
- Finds all orders (no filter)
- Populates user data
- Returns array of all orders

#### `updateLaundryStatus(req, res)`
- Validates status value
- Finds order by ID
- Updates status
- Updates pickup/delivery dates based on status
- Returns updated order

---

### 3. **employeeController.js**

#### `employeeLogin(req, res)`
- Similar to `loginUser` but checks role must be "washer" or "admin"
- Uses MongoDB query: `{ email, role: { $in: ['washer', 'admin'] } }`

#### `getAssignedOrders(req, res)`
- Finds orders where:
  - `assignedTo === employeeId` OR
  - `status === 'pending' AND assignedTo === null`
- Uses MongoDB `$or` operator
- Returns orders

#### `acceptOrder(req, res)`
- Finds order by ID
- Validates status is "pending"
- Checks if already assigned
- Assigns to employee
- Updates status to "accepted"
- Adds entry to activityLog

#### `rejectOrder(req, res)`
- Finds order by ID
- Sets status to "rejected"
- Stores rejection reason
- Adds to activityLog

#### `updateOrderStatus(req, res)`
- Validates status progression (statusFlow object)
- Checks if employee is assigned to order
- Updates status, dates
- Adds to activityLog
- Returns updated order

#### `getOrderDetails(req, res)`
- Finds order by ID
- Populates user, assignedTo, activityLog
- Returns full order details

---

## 🛡️ Middleware

**Purpose**: Intercept requests before they reach controllers. Handle authentication, authorization, validation.

### **Location**: `server/middleware/`

### 1. **authMiddleware.js**

#### `protect(req, res, next)`
- **What it does**:
  - Extracts JWT token from `Authorization` header
  - Verifies token using `jwt.verify()`
  - Finds user in database using token's `id`
  - Attaches user to `req.user`
  - Calls `next()` to continue to controller

- **Token Format**: `Bearer <token>`
- **If fails**: Returns 401 (Unauthorized)

- **Usage**:
  ```javascript
  router.post('/laundry', protect, createLaundryRequest);
  ```

#### `admin(req, res, next)`
- **What it does**:
  - Checks if `req.user.role === 'admin'`
  - Calls `next()` if admin
  - Returns 401 if not admin

- **Usage**: After `protect` middleware
  ```javascript
  router.get('/admin-only', protect, admin, adminController);
  ```

---

### 2. **employeeMiddleware.js**

#### `employeeAuth(req, res, next)`
- **What it does**:
  - Extracts and verifies JWT token
  - Finds user in database
  - **Checks role**: Must be "washer" OR "admin"
  - Attaches user to `req.user`
  - Calls `next()` if authorized

- **If role is not washer/admin**: Returns 403 (Forbidden)

- **Usage**:
  ```javascript
  router.use(employeeAuth); // Applies to all routes below
  router.get('/orders', getAssignedOrders);
  ```

---

### Middleware Execution Order:
```
Request → Middleware 1 → Middleware 2 → Controller → Response
```

Example:
```javascript
router.post('/route', protect, employeeAuth, controller);
```

---

## 📊 Models

**Purpose**: Define database schema, validate data, interact with MongoDB using Mongoose.

### **Location**: `server/models/`

### 1. **User.js**

#### Schema Structure:
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['student', 'washer', 'admin'], default: 'student'),
  hostelBlock: String,
  roomNumber: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

#### Methods:
- **`matchPassword(enteredPassword)`**: Compares entered password with hashed password
- **Pre-save hook**: Automatically hashes password before saving

#### Usage:
```javascript
const user = await User.create({ name, email, password });
const found = await User.findOne({ email });
const isValid = await user.matchPassword(password);
```

---

### 2. **Laundry.js**

#### Schema Structure:
```javascript
{
  user: ObjectId (ref: 'User', required),
  assignedTo: ObjectId (ref: 'User'),
  clothes: [
    {
      itemType: String (required),
      quantity: Number (required)
    }
  ],
  status: String (enum: ['pending', 'accepted', 'rejected', 'picked_up', 
                         'in_progress', 'washed', 'ironed', 'ready', 'delivered'],
                  default: 'pending'),
  rejectionReason: String,
  pickupDate: Date,
  deliveryDate: Date,
  specialInstructions: String,
  activityLog: [
    {
      status: String,
      updatedBy: ObjectId (ref: 'User'),
      updatedAt: Date,
      notes: String
    }
  ],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

#### Usage:
```javascript
const order = await Laundry.create({ user, clothes, status: 'pending' });
const orders = await Laundry.find({ user }).populate('user');
```

#### Population:
```javascript
Laundry.findById(id)
  .populate('user', 'name email')  // Populates user reference
  .populate('assignedTo', 'name email')  // Populates assignedTo reference
```

---

## 🔍 How to Filter Data in JavaScript

### 1. **Array.filter()** - Filter Arrays

#### Basic Syntax:
```javascript
const filtered = array.filter(callback);
```

#### Example 1: Filter by Status
```javascript
const orders = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'delivered' },
  { id: 3, status: 'pending' }
];

// Filter pending orders
const pendingOrders = orders.filter(order => order.status === 'pending');
// Result: [{ id: 1, status: 'pending' }, { id: 3, status: 'pending' }]
```

#### Example 2: Filter by User
```javascript
const orders = [
  { id: 1, user: 'user1' },
  { id: 2, user: 'user2' },
  { id: 3, user: 'user1' }
];

const user1Orders = orders.filter(order => order.user === 'user1');
// Result: [{ id: 1, user: 'user1' }, { id: 3, user: 'user1' }]
```

#### Example 3: Multiple Conditions
```javascript
const filtered = orders.filter(order => 
  order.status === 'pending' && order.user === 'user1'
);
```

#### Example 4: Filter by Date Range
```javascript
const today = new Date();
const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

const recentOrders = orders.filter(order => {
  const orderDate = new Date(order.createdAt);
  return orderDate >= weekAgo && orderDate <= today;
});
```

---

### 2. **MongoDB Query Filters** (in Controllers)

#### Example 1: Find by Single Field
```javascript
const orders = await Laundry.find({ status: 'pending' });
```

#### Example 2: Find by Multiple Fields (AND)
```javascript
const orders = await Laundry.find({ 
  status: 'pending',
  user: userId
});
```

#### Example 3: OR Condition
```javascript
const orders = await Laundry.find({
  $or: [
    { assignedTo: employeeId },
    { status: 'pending', assignedTo: null }
  ]
});
```

#### Example 4: Comparison Operators
```javascript
// Greater than
const orders = await Laundry.find({ quantity: { $gt: 5 } });

// Less than or equal
const orders = await Laundry.find({ quantity: { $lte: 10 } });

// In array
const orders = await Laundry.find({ status: { $in: ['pending', 'accepted'] } });
```

#### Example 5: Search/Regex
```javascript
// Case-insensitive search
const users = await User.find({ 
  name: { $regex: 'john', $options: 'i' } 
});
```

---

### 3. **Filter + Map Combination**
```javascript
// Filter and transform
const pendingIds = orders
  .filter(order => order.status === 'pending')
  .map(order => order._id);
```

---

### 4. **Filter + Sort**
```javascript
const sortedPending = orders
  .filter(order => order.status === 'pending')
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
```

---

### 5. **Filter in Frontend (React)**
```javascript
const [filter, setFilter] = useState('all');

const filteredOrders = orders.filter(order => {
  if (filter === 'all') return true;
  return order.status === filter;
});

// Render
{filteredOrders.map(order => <OrderCard key={order._id} order={order} />)}
```

---

### 6. **Real-World Example from Your Project**

#### Filter by Assigned Employee:
```javascript
// In employeeController.js
const orders = await Laundry.find({
  $or: [
    { assignedTo: employeeId },
    { status: 'pending', assignedTo: null }
  ]
})
  .populate('user', 'name email roomNumber hostelBlock')
  .sort({ createdAt: -1 });
```

#### Filter in Frontend Dashboard:
```javascript
// In Dashboard.jsx
const [statusFilter, setStatusFilter] = useState('all');

const filteredLaundry = laundry.filter(item => {
  if (statusFilter === 'all') return true;
  return item.status === statusFilter;
});
```

---

## 🔐 Authentication Flow

### **How JWT Works:**

1. **Login/Signup**:
   - User submits credentials
   - Server validates
   - Server creates JWT token with user ID
   - Token sent to client

2. **Storing Token**:
   - Client stores token in `localStorage`
   - Token format: `{ id: userId }` signed with secret

3. **Using Token**:
   - Client sends token in `Authorization: Bearer <token>` header
   - Middleware extracts and verifies token
   - If valid, attaches user to `req.user`
   - Controller can access `req.user._id`, `req.user.role`, etc.

4. **Token Expiry**:
   - Your tokens expire in 30 days
   - On expiry, middleware returns 401
   - Client redirects to login

---

## 📝 Summary

### **Complete Request Flow Example:**

**Student creates laundry request:**

1. Frontend: User submits form → `POST /api/laundry`
2. Route: `laundryRoutes.js` matches route
3. Middleware: `protect` checks JWT token
4. Controller: `createLaundryRequest` validates data
5. Model: `Laundry.create()` saves to MongoDB
6. Response: Returns created order to frontend
7. Frontend: Updates UI, shows success message

### **Complete Redirect Flow Example:**

**Student logs in:**

1. User visits `/login`
2. Submits credentials
3. `POST /api/auth/login` → Returns token + user data
4. Token saved in `localStorage` as `userInfo`
5. React checks user role:
   - If `role === 'admin' || 'washer'` → Redirect to `/admin`
   - Else → Redirect to `/dashboard`

---

## 🎯 Key Takeaways

1. **GET** = Read data
2. **POST** = Create data
3. **PUT** = Update data
4. **Middleware** = Validates before controller
5. **Controllers** = Business logic
6. **Models** = Database schema
7. **Filter** = Use `.filter()` for arrays, MongoDB queries for database
8. **Routes** = Match URLs to controllers
9. **Redirects** = React Router `Navigate` or `window.location`

---

## 🚀 Testing Your Endpoints

### Using cURL or Postman:

```bash
# Login
POST http://localhost:5001/api/auth/login
Body: { "email": "test@example.com", "password": "pass123" }

# Create Laundry (requires token)
POST http://localhost:5001/api/laundry
Headers: { "Authorization": "Bearer <token>" }
Body: { "clothes": [{ "itemType": "Shirt", "quantity": 2 }] }

# Get Orders (requires token)
GET http://localhost:5001/api/laundry
Headers: { "Authorization": "Bearer <token>" }
```

---

**End of Guide** 🎉

