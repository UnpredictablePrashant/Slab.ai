# Slab.ai

Slab.ai comprises a React/Vite frontend (`frontend/`) plus three Node.js microservices (`backend/projectService`, `backend/paymentService`, `backend/userService`). It requires MongoDB, Redis, AWS S3, and Razorpay.

## Prerequisites

- Node.js 18+ and npm 9+ (for local runs)
- Docker + Docker Compose (for containerized runs)
- MongoDB (default `mongodb://localhost:27017/slabai` locally)
- **Redis** (`redis://localhost:6379` locally; used by projectService)
- AWS S3 bucket + credentials (project assets and downloadable bundles)
- Razorpay account (public key + secret)

## Environment Variables

Create a `.env` inside each backend service folder. Template (adjust per service):

```bash
MONGO_URI="mongodb://localhost:27017/slabai" # use mongodb://mongo:27017/slabai in Docker
PORT=3003                                    # change per service
RAZORPAY_KEY_ID="rzp_test_xxxx"
RAZORPAY_KEY_SECRET="xxxxx"
AWS_SECRET_ACCESS_KEY="xxxxx"
AWS_ACCESS_KEY_ID="xxxxx"
AWS_REGION="ap-south-1"
S3_BUCKET_NAME="slabai"
DOWNLOAD_URL="http://localhost:3003"
REDIS_URL="redis://localhost:6379"           # only projectService uses this
# projectService admin auth
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="changeMe"
ADMIN_JWT_SECRET="super-secret-key"
# ADMIN_TOKEN_TTL_SECONDS=86400
```

- **projectService**: needs Mongo/S3, `REDIS_URL`, and admin credentials above.
- **paymentService**: needs Mongo/S3, Razorpay keys.
- **userService**: needs Mongo only.

Frontend: copy `frontend/.env.example` to `frontend/.env` and set:

```bash
VITE_PROJECT_SERVICE_URL=http://localhost:3002
VITE_PAYMENT_SERVICE_URL=http://localhost:3003
VITE_USER_SERVICE_URL=http://localhost:3001
VITE_RAZORPAY_KEY_ID=rzp_test_xxxx   # public key only
```

> For Docker Compose, use `mongodb://mongo:27017/slabai` and `redis://redis:6379` in the backend `.env` files so containers can reach each other.

## Local (non-Docker) Run

1. Start MongoDB and Redis locally.
2. Configure `.env` in each service folder and `frontend/.env`.
3. In four terminals:
   - **Project catalog / assets**
     ```bash
     cd backend/projectService
     npm install
     node index.js   # or npm run dev if added
     ```
   - **Payments + download streaming**
     ```bash
     cd backend/paymentService
     npm install
     node index.js
     ```
   - **User leads / contact intake**
     ```bash
     cd backend/userService
     npm install
     node index.js
     ```
   - **Frontend**
     ```bash
     cd frontend
     npm install
     npm run dev -- --host --port 5173   # http://localhost:5173
     ```
4. Admin login is at `http://localhost:5173/admin/login` using the credentials from `backend/projectService/.env`. Project creation lives at `/admin/projects`.

## Dockerfiles

- `backend/projectService/Dockerfile`
- `backend/paymentService/Dockerfile`
- `backend/userService/Dockerfile`
- `frontend/Dockerfile`

Backend images expose their respective ports (3002/3003/3001). The frontend image builds static assets and serves them via `npm run preview` on port `4173`.

## Docker Compose (one-command stack)

`docker-compose.yml` at the repo root runs MongoDB, Redis, all backend services, and the frontend.

1. Ensure backend `.env` files use `mongodb://mongo:27017/slabai` and `redis://redis:6379` (projectService).
2. Build and start:
   ```bash
   docker compose build
   docker compose up
   ```
3. Access:
   - Frontend: http://localhost:4173
   - Project service: http://localhost:3002
   - Payment service: http://localhost:3003
   - User service: http://localhost:3001
   - MongoDB: localhost:27017 (volume-backed)
   - Redis: localhost:6379 (volume-backed)

Stop with `docker compose down` (add `-v` to remove volumes).

---

## User Service API Documentation

Base URL: `/api/user-leads`

### Endpoints

#### 1. Create User Lead
- **Method**: POST
- **Endpoint**: `/`
- **Description**: Creates a new user lead in the system
- **Request Body**:
  ```json
  {
    "name": "string",
    "countryCode": "string (+XX format)",
    "phoneNo": "string (10 digits)",
    "email": "string (valid email)"
  }
  ```
- **Response**:
  - Success (201):
    ```json
    {
      "id": "string",
      "name": "string",
      "countryCode": "string",
      "phoneNo": "string",
      "email": "string",
      "creationDateTime": "date"
    }
    ```
  - Error (400):
    ```json
    {
      "message": "Error message"
    }
    ```

#### 2. Get All User Leads
- **Method**: GET
- **Endpoint**: `/`
- **Description**: Retrieves all user leads from the system
- **Response**:
  - Success (200): Array of user lead objects
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "countryCode": "string",
        "phoneNo": "string",
        "email": "string",
        "creationDateTime": "date"
      }
    ]
    ```
  - Error (500):
    ```json
    {
      "message": "Error message"
    }
    ```

#### 3. Get User Lead by ID
- **Method**: GET
- **Endpoint**: `/:id`
- **Parameters**: 
  - `id`: User lead ID (path parameter)
- **Response**:
  - Success (200):
    ```json
    {
      "id": "string",
      "name": "string",
      "countryCode": "string",
      "phoneNo": "string",
      "email": "string",
      "creationDateTime": "date"
    }
    ```
  - Error (404):
    ```json
    {
      "message": "User lead not found"
    }
    ```

#### 4. Update User Lead
- **Method**: PUT
- **Endpoint**: `/:id`
- **Parameters**: 
  - `id`: User lead ID (path parameter)
- **Request Body**:
  ```json
  {
    "name": "string (optional)",
    "countryCode": "string (optional)",
    "phoneNo": "string (optional)",
    "email": "string (optional)"
  }
  ```
- **Response**:
  - Success (200):
    ```json
    {
      "id": "string",
      "name": "string",
      "countryCode": "string",
      "phoneNo": "string",
      "email": "string",
      "creationDateTime": "date"
    }
    ```
  - Error (404):
    ```json
    {
      "message": "User lead not found"
    }
    ```

#### 5. Delete User Lead
- **Method**: DELETE
- **Endpoint**: `/:id`
- **Parameters**: 
  - `id`: User lead ID (path parameter)
- **Response**:
  - Success (200):
    ```json
    {
      "message": "User lead deleted successfully"
    }
    ```
  - Error (404):
    ```json
    {
      "message": "User lead not found"
    }
    ```

### Data Validation Rules
1. **Country Code**:
   - Must be in format: +XX (e.g., +91)
   - Must contain 1-3 digits after '+'

2. **Phone Number**:
   - Must be exactly 10 digits
   - Only numeric characters allowed

3. **Email**:
   - Must be a valid email format
   - Will be stored in lowercase
   - Must be unique in the system

### Notes
- All timestamps are in ISO format
- All string fields are automatically trimmed
- Email addresses are automatically converted to lowercase
- The API returns appropriate HTTP status codes for different scenarios
- All endpoints return JSON responses
