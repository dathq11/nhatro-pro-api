# NhàTrọ Pro – Backend API

Backend cho ứng dụng quản lý nhà/phòng cho thuê. Xây dựng bằng NestJS + PostgreSQL + Prisma.

## Yêu cầu

- Node.js >= 18
- PostgreSQL (local hoặc cloud như Supabase, Neon, Railway...)

## Cài đặt

### 1. Clone repo

```bash
git clone https://github.com/dathq11/nhatro-pro-api.git
cd nhatro-pro-api
```

### 2. Cài dependencies

```bash
npm install
```

### 3. Tạo file `.env`

```bash
cp .env.example .env
```

Mở file `.env` và điền thông tin:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nhatro"
AUTH_USERNAME="your-username"
AUTH_PASSWORD="your-password"
AUTH_SECRET="your-random-secret-key"
```

> `AUTH_SECRET` nên là chuỗi ngẫu nhiên dài >= 32 ký tự.

### 4. Tạo database schema

```bash
npx prisma migrate deploy
```

### 5. Chạy server

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Server mặc định chạy tại `http://localhost:3001`

## Cấu trúc API

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/properties` | Danh sách tòa nhà |
| GET | `/api/rooms` | Danh sách phòng |
| GET | `/api/contracts` | Danh sách hợp đồng |
| GET | `/api/transactions` | Danh sách giao dịch |
| GET | `/api/dashboard/summary` | Tổng quan dashboard |
