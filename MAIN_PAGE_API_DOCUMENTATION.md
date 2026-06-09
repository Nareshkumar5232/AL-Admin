# Non-Admin API Endpoints

This file lists all non-admin API endpoints in the `al-hikmath_backend` project.

## Health Check
- `GET /health`

## Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Products
- `GET /api/product/`
- `GET /api/product/:id`
- `GET /api/product/:id/image`
- `GET /api/product/:id/image/:imageId`

## Cart
- `GET /api/cart/`
- `PATCH /api/cart/:product_id`
- `DELETE /api/cart/:product_id`
- `POST /api/cart/:product_id`

## Orders
- `GET /api/order/`
- `GET /api/order/:id`
- `POST /api/order/`

## Wishlist
- `GET /api/wishlist/`
- `POST /api/wishlist/`
- `DELETE /api/wishlist/:id`

## Payment
- `POST /api/payment/process`
- `POST /api/payment/verify`
- `POST /api/payment/webhook`

## Reviews
- `GET /api/review/product/:productId`
- `POST /api/review/`
- `GET /api/review/my-reviews`
- `PUT /api/review/:id`
- `DELETE /api/review/:id`
- `POST /api/review/:id/helpful`
