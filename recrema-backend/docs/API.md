# Recrema API Documentation

## Base URL
`/api/v1`

---

## 1. Authentication

### Login
- **Method:** `POST`
- **Path:** `/auth/login`
- **Authentication:** None
- **Role:** None
- **Request Body:**
  ```json
  {
    "identifier": "client@example.com", // or clientCode "C-1001"
    "password": "securepassword123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "...",
        "email": "client@example.com",
        "role": "client",
        "clientCode": "C-1001",
        "isActive": true
      }
    }
  }
  ```
  *Note: Sets an `HttpOnly` cookie containing the JWT.*
- **Common Errors:** `401 Unauthorized` (Invalid credentials), `400 Bad Request` (Validation)

### Logout
- **Method:** `POST`
- **Path:** `/auth/logout`
- **Authentication:** None (Clears cookie regardless)
- **Role:** None
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { "message": "Logged out successfully" }
  }
  ```

### Get Current User
- **Method:** `GET`
- **Path:** `/auth/me`
- **Authentication:** Required
- **Role:** Any
- **Success Response (200 OK):** User object (no password hash).
- **Common Errors:** `401 Unauthorized` (Not logged in or inactive)

---

## 2. Client Waste API

### Create Waste Entry
- **Method:** `POST`
- **Path:** `/waste`
- **Authentication:** Required
- **Role:** `client`
- **Request Body:**
  ```json
  {
    "quantityKg": 15.5,
    "wasteDate": "2026-10-06T00:00:00Z",
    "notes": "Optional notes here"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "clientId": "...",
      "quantityKg": 15.5,
      "wasteDate": "2026-10-06T00:00:00Z",
      "notes": "Optional notes here",
      "status": "pending",
      "_id": "..."
    }
  }
  ```
- **Common Errors:** `400 Bad Request` (Validation error, e.g., negative quantity)

### List Client Waste Entries
- **Method:** `GET`
- **Path:** `/waste`
- **Authentication:** Required
- **Role:** `client`
- **Query Parameters:** `page` (default: 1), `limit` (default: 20, max: 100)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
  }
  ```

### Get Single Waste Entry
- **Method:** `GET`
- **Path:** `/waste/:id`
- **Authentication:** Required
- **Role:** `client`
- **Success Response (200 OK):** Returns the specific entry if owned by the client.
- **Common Errors:** `404 Not Found` (Not found or belongs to another client)

---

## 3. Admin API

### Get Pending Waste Entries
- **Method:** `GET`
- **Path:** `/admin/waste/pending`
- **Authentication:** Required
- **Role:** `admin`
- **Query Parameters:** `page`, `limit`, `startDate`, `endDate`, `clientId`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": { ... }
  }
  ```
  *Note: Entries are populated with `clientId` containing name, email, and clientCode.*

### Get All Waste Entries (Filtered)
- **Method:** `GET`
- **Path:** `/admin/waste`
- **Authentication:** Required
- **Role:** `admin`
- **Query Parameters:** `status`, `clientId`, `startDate`, `endDate`, `page`, `limit`
- **Success Response (200 OK):** Same structure as pending, but includes approved/rejected.

### Approve Waste Entry
- **Method:** `PATCH`
- **Path:** `/admin/waste/:id/approve`
- **Authentication:** Required
- **Role:** `admin`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { "status": "approved", "approvedBy": "...", "approvedAt": "..." }
  }
  ```
- **Common Errors:** `409 Conflict` (Already evaluated)

### Reject Waste Entry
- **Method:** `PATCH`
- **Path:** `/admin/waste/:id/reject`
- **Authentication:** Required
- **Role:** `admin`
- **Request Body:**
  ```json
  {
    "rejectionReason": "Quality issues"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { "status": "rejected", "rejectionReason": "Quality issues" }
  }
  ```

---

## 4. Insights API

### Get Summary Insights
- **Method:** `GET`
- **Path:** `/insights`
- **Authentication:** None (Public)
- **Role:** None
- **Query Parameters:** `startDate`, `endDate`, `year`, `month`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "totalWasteKg": 150.5,
      "contributingClients": 5,
      "approvedEntries": 12
    }
  }
  ```

### Get Trends
- **Method:** `GET`
- **Path:** `/insights/trends`
- **Authentication:** None (Public)
- **Role:** None
- **Query Parameters:** `period` (required, 'monthly' or 'yearly')
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "period": "monthly",
    "data": [
      { "period": "2026-05", "totalWasteKg": 45.5 },
      { "period": "2026-06", "totalWasteKg": 105.0 }
    ]
  }
  ```

---

## 5. Partner Management API

All partner-management endpoints require an authenticated user with the `admin` role. Partners are stored as `User` documents with `role: "client"`.

### Create Partner
- **Method:** `POST`
- **Path:** `/admin/partners`
- **Request Body:** `name`, `email`, `clientCode`, `password`
- **Success:** `201 Created`
- **Errors:** `400 Bad Request`, `409 Conflict` for duplicate email or client code

### List Partners
- **Method:** `GET`
- **Path:** `/admin/partners`
- **Query Parameters:** `page`, `limit` (maximum 100), `search`, `active` (`true` or `false`)
- **Success:** `200 OK` with `data` and `pagination`

### Get Partner
- **Method:** `GET`
- **Path:** `/admin/partners/:id`
- **Errors:** `400 Bad Request` for an invalid ID, `404 Not Found`

### Update Partner Status
- **Method:** `PATCH`
- **Path:** `/admin/partners/:id/status`
- **Request Body:** `{ "isActive": false }`
- **Success:** `200 OK`

### Reset Partner Password
- **Method:** `PATCH`
- **Path:** `/admin/partners/:id/reset-password`
- **Request Body:** `{ "password": "new-password" }`
- **Success:** `200 OK`

Password hashes and plaintext passwords are never included in responses or audit logs.

### Get Top Contributors
- **Method:** `GET`
- **Path:** `/insights/contributors`
- **Authentication:** None (Public)
- **Role:** None
- **Query Parameters:** `limit` (default: 10, max: 100)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      { "clientId": "...", "clientName": "Client A", "totalWasteKg": 250.5 }
    ]
  }
  ```
