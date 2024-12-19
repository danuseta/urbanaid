# Complete UrbanAID API Documentation

## Base URL
```
http://localhost:5000/api/
```

## Authentication
Most endpoints require authentication using JWT (JSON Web Token). Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication Routes

#### 1. Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "nama": "string",
  "email": "string",
  "password": "string"
}
```

**Response:** (201 Created)
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "integer",
    "nama": "string",
    "email": "string",
    "role": "user"
  }
}
```

#### 2. Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "token": "string",
  "user": {
    "id": "integer",
    "nama": "string",
    "email": "string",
    "role": "string"
  }
}
```

```http
POST /auth/admin/create
```

**Request Body:**
```json
{
  "nama": "string",
  "email": "string",
  "password": "string",
  "role": "admin"
}
```

**Response:** (201 Created)
```json
{
  "status": "success",
  "message": "Admin created successfully",
  "data": {
    "id": "integer",
    "nama": "string",
    "email": "string",
    "role": "admin"
  }
}
```

#### 4. Update User Profile
```http
PUT /auth/profile/{id}
```

**Request Body:**
```json
{
  "nama": "string",
  "email": "string",
  "password": "string (optional)"
}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "id": "integer",
    "nama": "string",
    "email": "string"
  }
}
```

```http
PUT /auth/admin/profile/{id}
```

**Request Body:**
```json
{
  "nama": "string",
  "email": "string",
  "password": "string (optional)"
}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "message": "Admin profile updated successfully",
  "data": {
    "id": "integer",
    "nama": "string",
    "email": "string",
    "role": "admin"
  }
}
```

### Statistics Routes

#### 1. Get Reports Statistics
```http
GET /statistics/reports
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "total_reports": "integer",
    "pending_reports": "integer",
    "completed_reports": "integer",
    "rejected_reports": "integer"
  }
}
```

#### 2. Get Reviews Statistics
```http
GET /statistics/reviews
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "total_reviews": "integer",
    "average_rating": "number",
    "rating_distribution": {
      "1": "integer",
      "2": "integer",
      "3": "integer",
      "4": "integer",
      "5": "integer"
    }
  }
}
```

#### 3. Get User Statistics
```http
GET /statistics/user/{userId}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "total_reports": "integer",
    "completed_reports": "integer",
    "pending_reports": "integer",
    "rejected_reports": "integer",
    "average_rating": "number"
  }
}
```

#### 4. Get Dashboard Statistics
```http
GET /statistics/dashboard
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "total_users": "integer",
    "total_reports": "integer",
    "total_completed": "integer",
    "recent_reports": [{
      "id": "integer",
      "judul": "string",
      "status": "string",
      "created_at": "timestamp"
    }]
  }
}
```

### Reports Routes

#### 1. Create Report
```http
POST /reports
```

**Request Body:**
```json
{
  "judul": "string",
  "jenis_infrastruktur": "string",
  "tanggal_kejadian": "timestamp",
  "deskripsi": "string",
  "alamat": "string",
  "bukti_lampiran": "file",
  "latitude": "numeric",
  "longitude": "numeric"
}
```

**Response:** (201 Created)
```json
{
  "status": "success",
  "message": "Report created successfully",
  "data": {
    "id": "integer",
    "judul": "string",
    "status": "pending"
  }
}
```

#### 2. Get All Reports
```http
GET /reports
```

**Query Parameters:**
- `page`: integer (optional)
- `limit`: integer (optional)
- `status`: string (optional)
- `sort`: string (optional)

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "reports": [{
      "id": "integer",
      "judul": "string",
      "status": "string",
      "created_at": "timestamp"
    }],
    "pagination": {
      "total": "integer",
      "page": "integer",
      "totalPages": "integer"
    }
  }
}
```

#### 3. Get User Reports
```http
GET /reports/user
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": [{
    "id": "integer",
    "judul": "string",
    "status": "string",
    "created_at": "timestamp"
  }]
}
```

#### 4. Get Report Detail
```http
GET /reports/{id}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": "integer",
    "judul": "string",
    "jenis_infrastruktur": "string",
    "tanggal_kejadian": "timestamp",
    "deskripsi": "string",
    "alamat": "string",
    "bukti_lampiran": "string",
    "status": "string",
    "latitude": "numeric",
    "longitude": "numeric",
    "created_at": "timestamp",
    "user": {
      "id": "integer",
      "nama": "string"
    }
  }
}
```

#### 5. Update Report
```http
PUT /reports/{id}
```

**Request Body:**
```json
{
  "judul": "string",
  "jenis_infrastruktur": "string",
  "tanggal_kejadian": "timestamp",
  "deskripsi": "string",
  "alamat": "string",
  "bukti_lampiran": "file (optional)"
}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "message": "Report updated successfully",
  "data": {
    "id": "integer",
    "judul": "string",
    "status": "string"
  }
}
```

#### 6. Delete Report
```http
DELETE /reports/{id}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "message": "Report deleted successfully"
}
```

#### 7. Get Nearby Reports
```http
GET /reports/nearby
```

**Query Parameters:**
- `latitude`: numeric (required)
- `longitude`: numeric (required)
- `radius`: numeric (optional, default: 5km)

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": [{
    "id": "integer",
    "judul": "string",
    "latitude": "numeric",
    "longitude": "numeric",
    "distance": "numeric",
    "status": "string"
  }]
}
```

#### 8. Get Incoming Reports
```http
GET /reports/incoming
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": [{
    "id": "integer",
    "judul": "string",
    "status": "pending",
    "created_at": "timestamp"
  }]
}
```

#### 9. Accept Report
```http
POST /reports/{id}/accept
```

**Request Body:**
```json
{
  "keterangan_laporan": "string"
}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "message": "Report accepted successfully"
}
```

#### 10. Reject Report
```http
POST /reports/{id}/reject
```

**Request Body:**
```json
{
  "keterangan_laporan": "string"
}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "message": "Report rejected successfully"
}
```

### History Routes

#### 1. Get All History
```http
GET /riwayat
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": [{
    "id": "integer",
    "judul": "string",
    "status": "string",
    "tanggal_selesai": "timestamp",
    "created_at": "timestamp"
  }]
}
```

#### 2. Get User History
```http
GET /riwayat/user
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": [{
    "id": "integer",
    "judul": "string",
    "status": "string",
    "tanggal_selesai": "timestamp"
  }]
}
```

#### 3. Get History Detail
```http
GET /riwayat/{id}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": "integer",
    "judul": "string",
    "jenis_infrastruktur": "string",
    "deskripsi": "string",
    "tanggal_kejadian": "timestamp",
    "tanggal_selesai": "timestamp",
    "alamat": "string",
    "status": "string",
    "keterangan_laporan": "string",
    "bukti_lampiran": "string",
    "latitude": "numeric",
    "longitude": "numeric"
  }
}
```

### Reviews Routes

#### 1. Create Review
```http
POST /reviews
```

**Request Body:**
```json
{
  "laporan_id": "integer",
  "rating": "integer (1-5)",
  "review_text": "string"
}
```

**Response:** (201 Created)
```json
{
  "status": "success",
  "message": "Review submitted successfully",
  "data": {
    "id": "integer",
    "rating": "integer",
    "review_text": "string"
  }
}
```

#### 2. Get Report Reviews
```http
GET /reviews/laporan/{id}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": [{
    "id": "integer",
    "user_id": "integer",
    "rating": "integer",
    "review_text": "string",
    "created_at": "timestamp",
    "user": {
      "nama": "string"
    }
  }]
}
```


#### 1. Get All Admins
```http
GET /superadmin/admins
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": [{
    "id": "integer",
    "nama": "string",
    "email": "string",
    "role": "admin",
    "last_login": "timestamp"
  }]
}
```

#### 2. Get Admin Detail
```http
GET /superadmin/admins/{id}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": "integer",
    "nama": "string",
    "email": "string",
    "role": "admin",
    "created_at": "timestamp",
    "last_login": "timestamp"
  }
}
```

#### 3. Create Admin
```http
POST /superadmin/admins
```

**Request Body:**
```json
{
  "nama": "string",
  "email": "string",
  "password": "string",
  "role": "admin"
}
```

**Response:** (201 Created)
```json
{
  "status": "success",
  "message": "Admin created successfully",
  "data": {
    "id": "integer",
    "nama": "string",
    "email": "string"
  }
}
```

#### 4. Update Admin
```http
PUT /superadmin/admins/{id}
```

**Request Body:**
```json
{
  "nama": "string",
  "email": "string",
  "password": "string (optional)"
}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "message": "Admin updated successfully",
  "data": {
    "id": "integer",
    "nama": "string",
    "email": "string"
  }
}
```

#### 5. Delete Admin
```http
DELETE /superadmin/admins/{id}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "message": "Admin deleted successfully"
}
```

#### 6. Get All Users
```http
GET /superadmin/users
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": [{
    "id": "integer",
    "nama": "string",
    "email": "string",
    "created_at": "timestamp"
  }]
}
```

#### 7. Get User Detail
```http
GET /superadmin/users/{id}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": "integer",
    "nama": "string",
    "email": "string",
    "created_at": "timestamp",
    "reports_count": "integer"
  }
}
```

#### 8. Update User
```http
PUT /superadmin/users/{id}
```

**Request Body:**
```json
{
  "nama": "string",
  "email": "string",
  "password": "string (optional)"
}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "id": "integer",
    "nama": "string",
    "email": "string"
  }
}
```

#### 9. Delete User (continued)
```http
DELETE /superadmin/users/{id}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

#### 10. Get Superadmin Statistics
```http
GET /superadmin/statistics
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "total_users": "integer",
    "total_admins": "integer",
    "total_reports": "integer",
    "reports_by_status": {
      "pending": "integer",
      "accepted": "integer",
      "rejected": "integer",
      "completed": "integer"
    },
    "average_resolution_time": "string",
    "reports_by_month": [{
      "month": "string",
      "count": "integer"
    }]
  }
}
```

```json
{
  "status": "error",
  "message": "Internal server error"
}
```

## Data Models

### User
```json
{
  "id": "integer",
  "nama": "string",
  "email": "string",
  "role": "string (user)",
  "created_at": "timestamp"
}
```

### Admin
```json
{
  "id": "integer",
  "nama": "string",
  "email": "string",
  "role": "string (admin/superadmin)",
  "last_login": "timestamp",
  "created_at": "timestamp"
}
```

### Report
```json
{
  "id": "integer",
  "judul": "string",
  "jenis_infrastruktur": "string",
  "tanggal_kejadian": "timestamp",
  "deskripsi": "string",
  "alamat": "string",
  "bukti_lampiran": "string",
  "user_id": "integer",
  "status": "string (pending/accepted/rejected)",
  "created_at": "timestamp",
  "latitude": "numeric",
  "longitude": "numeric"
}
```

### History (Riwayat)
```json
{
  "id": "integer",
  "judul": "string",
  "jenis_infrastruktur": "string",
  "deskripsi": "string",
  "tanggal_kejadian": "timestamp",
  "tanggal_selesai": "timestamp",
  "alamat": "string",
  "status": "string (diterima/ditolak)",
  "keterangan_laporan": "string",
  "bukti_lampiran": "string",
  "user_id": "integer",
  "created_at": "timestamp",
  "latitude": "numeric",
  "longitude": "numeric"
}
```

### Review
```json
{
  "id": "integer",
  "laporan_id": "integer",
  "user_id": "integer",
  "rating": "integer (1-5)",
  "review_text": "string",
  "created_at": "timestamp"
}
```

## General Notes

1. **Authentication:**
   - All routes except `/auth/login` and `/auth/register` require JWT authentication
   - Token must be included in the Authorization header
   - Token expires after 24 hours

2. **File Upload:**
   - Maximum file size: 5MB
   - Supported formats: jpg, jpeg, png, pdf
   - Files are stored in secured cloud storage

3. **Rate Limiting:**
   - 100 requests per minute per IP
   - 1000 requests per hour per user

4. **Pagination:**
   - Default page size: 10 items
   - Maximum page size: 100 items
   - Use `page` and `limit` query parameters

5. **Timestamps:**
   - All timestamps are returned in ISO 8601 format
   - Timezone: UTC

6. **Coordinates:**
   - Latitude and longitude use decimal degrees
   - Precision: 6 decimal places

7. **Request Headers:**
```http
Content-Type: application/json
Authorization: Bearer <token>
Accept: application/json
```

8. **Response Headers:**
```http
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## Versioning
The current API version is v1. Include the version in the URL:
```
https://api.urbanaid.com/api/v1/{endpoint}
```

## Support
For API support, contact:
- Email: api.support@urbanaid.com
- Documentation: https://docs.urbanaid.com
- Status Page: https://status.urbanaid.com
