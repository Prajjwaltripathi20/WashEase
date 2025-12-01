# Controllers Documentation

This directory contains all the route controllers for the WashEase API. Controllers handle the business logic and interact with the database models.

## 📁 Files

- `authController.js` - Authentication and user management
- `laundryController.js` - Laundry request management

---

## 🔐 Auth Controller (`authController.js`)

Handles user authentication, registration, and JWT token generation.

### Functions

#### `registerUser(req, res)`
**Route:** `POST /api/auth/signup`  
**Access:** Public  
**Description:** Registers a new user account

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required)",
  "role": "string (optional, default: 'student')",
  "hostelBlock": "string (optional, for students)",
  "roomNumber": "string (optional, for students)"
}
```

**Valid Roles:**
- `student` - Default role for regular users
- `washer` - For laundry service providers
- `admin` - For administrators

**Response (201 Created):**
```json
{
  "_id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "student",
  "hostelBlock": "A",
  "roomNumber": "101",
  "token": "jwt_token_here"
}
```

**Error Responses:**
- `400` - User already exists or invalid data
- `503` - Database not connected
- `500` - Server error

**Example:**
```javascript
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "student",
  "hostelBlock": "A",
  "roomNumber": "101"
}
```

---

#### `loginUser(req, res)`
**Route:** `POST /api/auth/login`  
**Access:** Public  
**Description:** Authenticates a user and returns JWT token

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "_id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "student",
  "hostelBlock": "A",
  "roomNumber": "101",
  "token": "jwt_token_here"
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid email or password
- `503` - Database not connected
- `500` - Server error

**Example:**
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

---

#### `generateToken(id)`
**Internal Function**  
**Description:** Generates a JWT token for user authentication

**Parameters:**
- `id` - User MongoDB ObjectId

**Returns:**
- JWT token string (expires in 30 days)

**Usage:**
```javascript
const token = generateToken(user._id);
```

---

## 🧺 Laundry Controller (`laundryController.js`)

Handles all laundry request operations including creation, retrieval, and status updates.

### Functions

#### `createLaundryRequest(req, res)`
**Route:** `POST /api/laundry`  
**Access:** Private (Requires authentication)  
**Description:** Creates a new laundry request for the authenticated user

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "clothes": [
    {
      "itemType": "string (required)",
      "quantity": "number (required, min: 1)"
    }
  ],
  "specialInstructions": "string (optional)"
}
```

**Valid Item Types:**
- T-Shirt, Shirt, Pant, Jeans, Trouser, Shorts, Jacket, Sweater, Dress, Skirt, Socks, Underwear, Towel, Bed Sheet, Pillow Cover, Other

**Response (201 Created):**
```json
{
  "_id": "laundry_id",
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  },
  "clothes": [
    {
      "itemType": "T-Shirt",
      "quantity": 2
    }
  ],
  "status": "pending",
  "specialInstructions": "Handle with care",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - Invalid clothes array or missing required fields
- `401` - Not authenticated
- `503` - Database not connected
- `500` - Server error

**Example:**
```javascript
POST /api/laundry
Authorization: Bearer <token>
Content-Type: application/json

{
  "clothes": [
    { "itemType": "T-Shirt", "quantity": 3 },
    { "itemType": "Jeans", "quantity": 2 }
  ],
  "specialInstructions": "Please use cold water"
}
```

---

#### `getMyLaundry(req, res)`
**Route:** `GET /api/laundry`  
**Access:** Private (Requires authentication)  
**Description:** Retrieves all laundry requests for the authenticated user

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "_id": "laundry_id",
    "user": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    },
    "clothes": [
      {
        "itemType": "T-Shirt",
        "quantity": 3
      }
    ],
    "status": "pending",
    "specialInstructions": "Handle with care",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Notes:**
- Results are sorted by creation date (newest first)
- Only returns requests belonging to the authenticated user

**Error Responses:**
- `401` - Not authenticated
- `503` - Database not connected
- `500` - Server error

**Example:**
```javascript
GET /api/laundry
Authorization: Bearer <token>
```

---

#### `getAllLaundry(req, res)`
**Route:** `GET /api/laundry/all`  
**Access:** Private (Admin/Washer only)  
**Description:** Retrieves all laundry requests from all users (admin/washer access)

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "_id": "laundry_id",
    "user": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "roomNumber": "101",
      "hostelBlock": "A"
    },
    "clothes": [
      {
        "itemType": "T-Shirt",
        "quantity": 3
      }
    ],
    "status": "pending",
    "specialInstructions": "Handle with care",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Notes:**
- Results are sorted by creation date (newest first)
- Includes user details (name, email, roomNumber, hostelBlock)
- Only accessible by users with `admin` or `washer` role

**Error Responses:**
- `401` - Not authenticated or insufficient permissions
- `503` - Database not connected
- `500` - Server error

**Example:**
```javascript
GET /api/laundry/all
Authorization: Bearer <admin_token>
```

---

#### `updateLaundryStatus(req, res)`
**Route:** `PUT /api/laundry/:id`  
**Access:** Private (Admin/Washer only)  
**Description:** Updates the status of a laundry request

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**
- `id` - Laundry request MongoDB ObjectId

**Request Body:**
```json
{
  "status": "string (required)"
}
```

**Valid Status Values:**
- `pending` - Request created, awaiting pickup
- `picked_up` - Items have been collected
- `in_progress` - Currently being washed
- `ready` - Washing complete, ready for delivery
- `delivered` - Delivered to user

**Response (200 OK):**
```json
{
  "_id": "laundry_id",
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "roomNumber": "101",
    "hostelBlock": "A"
  },
  "clothes": [
    {
      "itemType": "T-Shirt",
      "quantity": 3
    }
  ],
  "status": "picked_up",
  "pickupDate": "2024-01-01T12:00:00.000Z",
  "specialInstructions": "Handle with care",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Automatic Date Updates:**
- When status changes to `picked_up`, `pickupDate` is automatically set
- When status changes to `delivered`, `deliveryDate` is automatically set

**Error Responses:**
- `400` - Invalid status or missing status field
- `401` - Not authenticated or insufficient permissions
- `404` - Laundry request not found
- `503` - Database not connected
- `500` - Server error

**Example:**
```javascript
PUT /api/laundry/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "picked_up"
}
```

---

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained through:
- `POST /api/auth/signup` - Returns token on successful registration
- `POST /api/auth/login` - Returns token on successful login

Tokens expire after 30 days.

---

## 📊 Status Flow

Laundry requests follow this status progression:

```
pending → picked_up → in_progress → ready → delivered
```

**Status Descriptions:**
- **pending**: Request submitted, awaiting collection
- **picked_up**: Items collected from user
- **in_progress**: Currently being washed/processed
- **ready**: Washing complete, ready for delivery
- **delivered**: Successfully delivered to user

---

## 🛡️ Error Handling

All controllers include comprehensive error handling:

1. **Database Connection Check**: All endpoints check if MongoDB is connected before processing
2. **Input Validation**: Validates required fields and data types
3. **Error Logging**: Errors are logged to console for debugging
4. **User-Friendly Messages**: Returns clear error messages to clients

**Common Error Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `503` - Service Unavailable (database not connected)
- `500` - Internal Server Error

---

## 🧪 Testing Examples

### Using cURL

**Register User:**
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student",
    "hostelBlock": "A",
    "roomNumber": "101"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create Laundry Request:**
```bash
curl -X POST http://localhost:5001/api/laundry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "clothes": [
      {"itemType": "T-Shirt", "quantity": 3},
      {"itemType": "Jeans", "quantity": 2}
    ],
    "specialInstructions": "Cold wash only"
  }'
```

**Get My Laundry:**
```bash
curl -X GET http://localhost:5001/api/laundry \
  -H "Authorization: Bearer <token>"
```

**Update Status (Admin):**
```bash
curl -X PUT http://localhost:5001/api/laundry/<laundry_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"status": "picked_up"}'
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- User passwords are automatically hashed using bcrypt before storage
- JWT tokens should be stored securely on the client side
- Database connection status is checked before each operation
- User data is populated in laundry responses for better context

---

## 🔄 Dependencies

**authController.js:**
- `../models/User` - User model
- `jsonwebtoken` - JWT token generation
- `../config/db` - Database connection check

**laundryController.js:**
- `../models/Laundry` - Laundry model
- `../config/db` - Database connection check

---

## 📚 Related Files

- **Routes:** `../routes/authRoutes.js`, `../routes/laundryRoutes.js`
- **Middleware:** `../middleware/authMiddleware.js`
- **Models:** `../models/User.js`, `../models/Laundry.js`

---

*Last Updated: 2024*

