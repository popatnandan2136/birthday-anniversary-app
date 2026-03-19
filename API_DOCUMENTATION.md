# 📝 API Documentation - Complete Reference

## Base URL

**Development:** `http://localhost:3001/api`  
**Production:** `https://your-backend-url.vercel.app/api`

---

## 🔐 Authentication Endpoints

### POST `/auth/register`

Register a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "active",
      "createdAt": "2024-03-19T10:30:00Z"
    }
  }
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email already registered. Please login or use a different email."
}
```

---

### POST `/auth/login`

Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "active"
    }
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### GET `/auth/me`

Get current logged-in user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "avatar": "https://...",
      "isEmailVerified": false,
      "status": "active",
      "createdAt": "2024-03-19T10:30:00Z",
      "updatedAt": "2024-03-19T10:30:00Z"
    }
  }
}
```

---

### PUT `/auth/update-profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Jane Doe",
  "phoneNumber": "+9876543210"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Jane Doe",
      "email": "john@example.com",
      "phoneNumber": "+9876543210",
      "status": "active"
    }
  }
}
```

---

### POST `/auth/logout`

Logout user (invalidate token).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful. Please remove token from client."
}
```

---

## 🎉 Event/Wish Endpoints

### POST `/events/create`

Create a new birthday or anniversary event.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request (Form Data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| personName | String | Yes | Name of person (e.g., "Sister", "Mom") |
| eventType | String | Yes | "birthday" or "anniversary" |
| eventDate | Date | Yes | ISO format: "2024-12-25" |
| message | String | No | Greeting message (max 1000 chars) |
| templateType | String | No | "sister-cute", "elder-sister", "brother", "child-cartoon", "default" |
| image | File | No | JPEG, PNG, GIF, WebP (max 5MB) |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "event": {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "personName": "Sister",
      "eventType": "birthday",
      "eventDate": "2024-12-25T00:00:00Z",
      "message": "Happy Birthday!",
      "templateType": "sister-cute",
      "imageUrl": "https://res.cloudinary.com/...",
      "publicUrl": "http://localhost:5173/wish/sister-xyz123",
      "slug": "sister-xyz123",
      "isPublic": true,
      "viewCount": 0,
      "status": "active",
      "createdAt": "2024-03-19T10:30:00Z"
    }
  }
}
```

---

### GET `/events/user/{userId}`

Get all events created by a specific user (authenticated).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "personName": "Sister",
        "eventType": "birthday",
        "eventDate": "2024-12-25T00:00:00Z",
        "message": "Happy Birthday!",
        "templateType": "sister-cute",
        "imageUrl": "https://res.cloudinary.com/...",
        "viewCount": 5,
        "status": "active",
        "createdAt": "2024-03-19T10:30:00Z"
      }
    ],
    "count": 1
  }
}
```

---

### GET `/events/id/{eventId}`

Get a specific event by ID (must own it).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "event": {
      "_id": "507f1f77bcf86cd799439012",
      "personName": "Sister",
      "eventType": "birthday",
      "eventDate": "2024-12-25T00:00:00Z",
      "message": "Happy Birthday!",
      "templateType": "sister-cute",
      "imageUrl": "https://res.cloudinary.com/...",
      "slug": "sister-xyz123",
      "isPublic": true,
      "viewCount": 5,
      "status": "active",
      "createdAt": "2024-03-19T10:30:00Z"
    }
  }
}
```

---

### GET `/events/slug/{slug}`

Get public event by slug (NO authentication required).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "event": {
      "_id": "507f1f77bcf86cd799439012",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "personName": "Sister",
      "eventType": "birthday",
      "eventDate": "2024-12-25T00:00:00Z",
      "message": "Happy Birthday!",
      "templateType": "sister-cute",
      "imageUrl": "https://res.cloudinary.com/...",
      "viewCount": 6,
      "status": "active"
    }
  }
}
```

**Note:** This increments the `viewCount` automatically.

---

### PUT `/events/{eventId}`

Update an event (authorized users only).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request:** Same as create (provide only fields to update)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "event": { ... }
  }
}
```

---

### DELETE `/events/{eventId}`

Delete an event (soft delete - status changed to "deleted").

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## 🏥 Health Check

### GET `/health`

Check if server is running.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-03-19T10:30:00Z"
}
```

---

## 📊 Status Codes

| Code | Meaning | Common Reasons |
|------|---------|-----------------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | No permission (e.g., trying to delete someone else's event) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database/server issue |

---

## 🔒 Authentication

### Token Management

**Storage (Frontend):**
```javascript
// After login
localStorage.setItem('authToken', response.data.token);

// In API calls
headers: { Authorization: `Bearer ${token}` }

// On logout
localStorage.removeItem('authToken');
```

**Token Format:**
- JWT (JSON Web Token)
- Expires: 7 days (configurable via JWT_EXPIRE env var)
- Includes: userId, email, issued time, expiration time

**401 Handling:**
When API returns 401:
1. Token is invalid or expired
2. Clear localStorage
3. Redirect to /login
4. User must login again

---

## 📥 File Upload Specifications

**Supported Formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

**Size Limits:**
- Maximum: 5MB
- Recommended: < 2MB for faster uploads

**Upload Flow:**
1. File sent to backend with form data
2. Stored temporarily in system temp folder
3. Uploaded to Cloudinary
4. Temporary file deleted
5. Cloudinary URL returned and stored in DB

---

## 🛠️ Example Frontend Implementation

```javascript
import { eventsAPI } from './services/apiService';
import { useAuth } from './hooks/useAuth';

function CreateEvent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCreateEvent(formData) {
    setLoading(true);
    setError(null);
    
    try {
      const eventData = {
        personName: formData.personName,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        message: formData.message,
        templateType: formData.templateType,
      };
      
      const response = await eventsAPI.createEvent(
        eventData,
        formData.imageFile
      );
      
      console.log('Event created:', response.data.event);
      // Redirect to event page or dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Creation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    // Component JSX
  );
}
```

---

## 🔄 CORS Configuration

The API accepts requests from:
- Development: `http://localhost:5173`
- Production: Your Vercel frontend domain (set via FRONTEND_URL env var)

Update `FRONTEND_URL` in `/api/.env` for different deployments.

