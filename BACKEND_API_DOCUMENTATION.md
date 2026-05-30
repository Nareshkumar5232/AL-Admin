# AL HIKMATH ENTERPRISES - Admin Backend API Documentation

## Base URL
```
http://localhost:8000/api
```

## Environment Setup
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Authentication Flow
All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer {token}
```

---

## 🔐 AUTHENTICATION ENDPOINTS

### POST /admin/login
**Login admin user**
- **Method**: POST
- **Auth**: None (public)
- **Request Body**:
```json
{
  "email": "admin@gmail.com",
  "password": "admin@123"
}
```
- **Response (200)**:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "admin-001",
    "name": "Admin User",
    "email": "admin@gmail.com",
    "role": "Super Admin",
    "avatar": "url-to-avatar"
  }
}
```

### POST /admin/logout
**Logout admin user**
- **Method**: POST
- **Auth**: Required
- **Response (200)**:
```json
{
  "success": true
}
```

### GET /admin/profile
**Get current admin profile**
- **Method**: GET
- **Auth**: Required
- **Response (200)**:
```json
{
  "id": "admin-001",
  "name": "Admin User",
  "email": "admin@gmail.com",
  "role": "Super Admin",
  "avatar": "url-to-avatar"
}
```

### PUT /admin/profile
**Update admin profile**
- **Method**: PUT
- **Auth**: Required
- **Request Body**:
```json
{
  "name": "New Admin Name",
  "email": "newemail@gmail.com",
  "avatar": "new-avatar-url"
}
```
- **Response (200)**: Updated user object

### POST /admin/change-password
**Change admin password**
- **Method**: POST
- **Auth**: Required
- **Request Body**:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```
- **Response (200)**:
```json
{
  "success": true
}
```

---

## 📦 PRODUCT ENDPOINTS

### GET /products
**Get all products with optional filters**
- **Method**: GET
- **Auth**: Required
- **Query Parameters**:
  - `category` (string, optional): Filter by category slug
  - `status` (string, optional): Filter by status (active/inactive)
  - `search` (string, optional): Search by name, brand, or ID
  - `page` (number, optional): Pagination page (default: 1)
  - `limit` (number, optional): Items per page (default: 10)
- **Response (200)**:
```json
{
  "products": [
    {
      "id": "prod-001",
      "name": "Product Name",
      "description": "Product description",
      "category": "electronics",
      "price": 5999.99,
      "originalPrice": 7999.99,
      "stock": 50,
      "images": ["url1", "url2"],
      "brand": "Samsung",
      "rating": 4.5,
      "reviewCount": 120,
      "status": "active",
      "isFeatured": true,
      "specifications": {
        "ram": "8GB",
        "storage": "256GB"
      },
      "tags": ["electronics", "mobile"],
      "createdAt": "2024-05-27T10:00:00Z"
    }
  ],
  "total": 248,
  "pages": 25
}
```

### GET /products/:id
**Get single product**
- **Method**: GET
- **Auth**: Required
- **Response (200)**: Product object (same structure as above)

### POST /products
**Create new product**
- **Method**: POST
- **Auth**: Required
- **Request Body**:
```json
{
  "name": "New Product",
  "description": "Product description",
  "category": "electronics",
  "price": 5999.99,
  "originalPrice": 7999.99,
  "stock": 50,
  "images": ["url1", "url2"],
  "brand": "Samsung",
  "status": "active",
  "isFeatured": true,
  "specifications": {
    "ram": "8GB",
    "storage": "256GB"
  },
  "tags": ["electronics", "mobile"]
}
```
- **Response (201)**: Created product object

### PUT /products/:id
**Update product**
- **Method**: PUT
- **Auth**: Required
- **Request Body**: Same as POST (partial updates allowed)
- **Response (200)**: Updated product object

### DELETE /products/:id
**Delete product**
- **Method**: DELETE
- **Auth**: Required
- **Response (200)**:
```json
{
  "success": true
}
```

### POST /products/upload-images
**Upload product images**
- **Method**: POST
- **Auth**: Required
- **Content-Type**: multipart/form-data
- **Form Data**:
  - `productId` (string): Product ID
  - `files` (files): Multiple image files
- **Response (200)**:
```json
{
  "images": ["url1", "url2", "url3"]
}
```

### DELETE /products/image/:imageId
**Delete single product image**
- **Method**: DELETE
- **Auth**: Required
- **Response (200)**:
```json
{
  "success": true
}
```

---

## 🛒 ORDER ENDPOINTS

### GET /orders
**Get all orders with optional filters**
- **Method**: GET
- **Auth**: Required
- **Query Parameters**:
  - `status` (string, optional): Filter by status (pending/confirmed/processing/shipped/delivered/cancelled)
  - `paymentMethod` (string, optional): Filter by payment method (upi/card/cod/netbanking/wallet)
  - `search` (string, optional): Search by customer name, email, or order ID
  - `page` (number, optional): Pagination page
  - `limit` (number, optional): Items per page
- **Response (200)**:
```json
{
  "orders": [
    {
      "id": "ORD-2024-00001",
      "customerId": "cust-001",
      "customerName": "Customer Name",
      "customerEmail": "customer@example.com",
      "products": [
        {
          "productId": "prod-001",
          "productName": "Product Name",
          "quantity": 2,
          "price": 5999.99
        }
      ],
      "total": 11999.98,
      "status": "pending",
      "paymentMethod": "upi",
      "shippingAddress": "Address details",
      "createdAt": "2024-05-27T10:00:00Z",
      "updatedAt": "2024-05-27T10:00:00Z"
    }
  ],
  "total": 1847,
  "pages": 185
}
```

### GET /orders/:id
**Get single order**
- **Method**: GET
- **Auth**: Required
- **Response (200)**: Order object

### POST /orders
**Create new order**
- **Method**: POST
- **Auth**: Required
- **Request Body**:
```json
{
  "customerId": "cust-001",
  "customerName": "Customer Name",
  "customerEmail": "customer@example.com",
  "products": [
    {
      "productId": "prod-001",
      "productName": "Product Name",
      "quantity": 2,
      "price": 5999.99
    }
  ],
  "total": 11999.98,
  "status": "pending",
  "paymentMethod": "upi",
  "shippingAddress": "Address details"
}
```
- **Response (201)**: Created order object

### PUT /orders/:id/status
**Update order status**
- **Method**: PUT
- **Auth**: Required
- **Request Body**:
```json
{
  "status": "confirmed"
}
```
- **Valid statuses**: pending, confirmed, processing, shipped, delivered, cancelled
- **Response (200)**: Updated order object

### PUT /orders/:id
**Update order details**
- **Method**: PUT
- **Auth**: Required
- **Request Body**: Order object with fields to update
- **Response (200)**: Updated order object

### DELETE /orders/:id
**Delete order**
- **Method**: DELETE
- **Auth**: Required
- **Response (200)**:
```json
{
  "success": true
}
```

---

## 👥 CUSTOMER ENDPOINTS

### GET /customers
**Get all customers with optional filters**
- **Method**: GET
- **Auth**: Required
- **Query Parameters**:
  - `status` (string, optional): Filter by status (active/inactive)
  - `search` (string, optional): Search by name, email, or phone
  - `page` (number, optional): Pagination page
  - `limit` (number, optional): Items per page
- **Response (200)**:
```json
{
  "customers": [
    {
      "id": "cust-001",
      "name": "Customer Name",
      "email": "customer@example.com",
      "phone": "+91 9876543210",
      "avatar": "avatar-url",
      "ordersCount": 5,
      "totalSpent": 45999.99,
      "status": "active",
      "joinedAt": "2024-01-15T10:00:00Z",
      "lastOrderAt": "2024-05-27T10:00:00Z",
      "address": "Customer address"
    }
  ],
  "total": 892,
  "pages": 90
}
```

### GET /customers/:id
**Get single customer**
- **Method**: GET
- **Auth**: Required
- **Response (200)**: Customer object

### POST /customers
**Create new customer**
- **Method**: POST
- **Auth**: Required
- **Request Body**:
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+91 9876543210",
  "address": "Customer address",
  "status": "active"
}
```
- **Response (201)**: Created customer object

### PUT /customers/:id
**Update customer**
- **Method**: PUT
- **Auth**: Required
- **Request Body**: Customer object with fields to update
- **Response (200)**: Updated customer object

### DELETE /customers/:id
**Delete customer**
- **Method**: DELETE
- **Auth**: Required
- **Response (200)**:
```json
{
  "success": true
}
```

---

## 📂 CATEGORY ENDPOINTS

### GET /categories
**Get all categories**
- **Method**: GET
- **Auth**: Required
- **Response (200)**:
```json
{
  "categories": [
    {
      "id": "cat-001",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices",
      "productCount": 248,
      "icon": "Package",
      "color": "#9EFF00"
    }
  ]
}
```

### GET /categories/:id
**Get single category**
- **Method**: GET
- **Auth**: Required
- **Response (200)**: Category object

### POST /categories
**Create new category**
- **Method**: POST
- **Auth**: Required
- **Request Body**:
```json
{
  "name": "New Category",
  "slug": "new-category",
  "description": "Category description",
  "icon": "Package",
  "color": "#9EFF00"
}
```
- **Response (201)**: Created category object

### PUT /categories/:id
**Update category**
- **Method**: PUT
- **Auth**: Required
- **Request Body**: Category object with fields to update
- **Response (200)**: Updated category object

### DELETE /categories/:id
**Delete category**
- **Method**: DELETE
- **Auth**: Required
- **Response (200)**:
```json
{
  "success": true
}
```

---

## ⭐ REVIEW ENDPOINTS

### GET /reviews
**Get all reviews with optional filters**
- **Method**: GET
- **Auth**: Required
- **Query Parameters**:
  - `status` (string, optional): Filter by status (pending/approved/rejected)
  - `productId` (string, optional): Filter by product
  - `page` (number, optional): Pagination page
  - `limit` (number, optional): Items per page
- **Response (200)**:
```json
{
  "reviews": [
    {
      "id": "rev-001",
      "customerId": "cust-001",
      "customerName": "Customer Name",
      "customerAvatar": "avatar-url",
      "productId": "prod-001",
      "productName": "Product Name",
      "rating": 5,
      "comment": "Great product!",
      "status": "approved",
      "createdAt": "2024-05-27T10:00:00Z"
    }
  ],
  "total": 500,
  "pages": 50
}
```

### GET /reviews/:id
**Get single review**
- **Method**: GET
- **Auth**: Required
- **Response (200)**: Review object

### PUT /reviews/:id
**Update review (status/content)**
- **Method**: PUT
- **Auth**: Required
- **Request Body**:
```json
{
  "status": "approved",
  "comment": "Updated comment"
}
```
- **Response (200)**: Updated review object

### DELETE /reviews/:id
**Delete review**
- **Method**: DELETE
- **Auth**: Required
- **Response (200)**:
```json
{
  "success": true
}
```

---

## ⚙️ SETTINGS ENDPOINTS

### GET /settings
**Get store settings**
- **Method**: GET
- **Auth**: Required
- **Response (200)**:
```json
{
  "storeName": "AL HIKMATH ENTERPRISES PVT LTD",
  "storeAddress": "No.16/127, Inbharajapuram 1st Street, Bajanai Kovil Street, Choolaimedu - 600094",
  "phone1": "+91 9342698344",
  "phone2": "+91 9342798344",
  "email": "contact@alhikmath.com",
  "taxId": "GSTIN29AAAAA1111A1Z1",
  "logo": "logo-url",
  "theme": "dark"
}
```

### PUT /settings
**Update store settings**
- **Method**: PUT
- **Auth**: Required
- **Request Body**:
```json
{
  "storeName": "AL HIKMATH ENTERPRISES PVT LTD",
  "storeAddress": "New Address",
  "phone1": "+91 9342698344",
  "phone2": "+91 9342798344",
  "email": "contact@alhikmath.com",
  "taxId": "GSTIN29AAAAA1111A1Z1",
  "theme": "dark"
}
```
- **Response (200)**: Updated settings object

---

## 📊 DASHBOARD ENDPOINTS

### GET /dashboard/stats
**Get dashboard statistics**
- **Method**: GET
- **Auth**: Required
- **Response (200)**:
```json
{
  "totalProducts": 248,
  "totalOrders": 1847,
  "totalCustomers": 892,
  "totalRevenue": 2456890,
  "pendingOrders": 45,
  "activeProducts": 230,
  "newCustomersThisMonth": 125,
  "revenueThisMonth": 245000
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters",
  "details": "..."
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized access",
  "message": "Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "message": "The requested resource does not exist"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Data Types

### ProductCategory
- `electrical-appliances`
- `electronics`
- `mobile-accessories`
- `computer-accessories`
- `chargers`
- `earphones`
- `smart-devices`

### OrderStatus
- `pending`
- `confirmed`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

### PaymentMethod
- `upi`
- `card`
- `cod`
- `netbanking`
- `wallet`

### ReviewStatus
- `pending`
- `approved`
- `rejected`

### CustomerStatus
- `active`
- `inactive`

---

## Implementation Notes

1. **Token Storage**: Frontend stores token in localStorage as `admin_token`
2. **Token Refresh**: Implement token refresh mechanism if using JWT
3. **CORS**: Configure CORS to allow frontend origin
4. **Rate Limiting**: Recommended to implement rate limiting
5. **Validation**: Validate all inputs on backend
6. **Pagination**: Default page size is 10, max is 100
7. **Search**: Implement full-text search for product names, customer names, order IDs
8. **Timestamps**: Use ISO 8601 format for all dates

---

## Database Schema Recommendations

### Products Table
- id, name, description, category, price, originalPrice, stock
- images (JSON array), brand, rating, reviewCount
- status, isFeatured, specifications (JSON), tags (JSON array)
- createdAt, updatedAt, createdBy

### Orders Table
- id, customerId, customerName, customerEmail
- products (JSON array with product details)
- total, status, paymentMethod, shippingAddress
- createdAt, updatedAt

### Customers Table
- id, name, email, phone, avatar, ordersCount, totalSpent
- status, joinedAt, lastOrderAt, address

### Categories Table
- id, name, slug (unique), description, productCount, icon, color
- createdAt, updatedAt

### Reviews Table
- id, customerId, customerName, customerAvatar
- productId, productName, rating, comment, status
- createdAt, updatedAt

### Admin Users Table
- id, name, email (unique), password (hashed), role, avatar
- createdAt, updatedAt, lastLogin

### Settings Table
- storeName, storeAddress, phone1, phone2, email, taxId, logo, theme
- updatedAt, updatedBy
