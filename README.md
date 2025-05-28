
📄 README.md

# Tekna Task Management App

This project is a full-featured task management application, developed as a technical challenge for Tekna.  
The backend is built with **Node.js + Express + Prisma + PostgreSQL**, and the frontend with **Angular + Angular Material**.

---

## 🚀 Technologies

- Backend: Node.js, Express, Prisma ORM, PostgreSQL, JWT
- Frontend: Angular 19, Angular Material, TypeScript
- Documentation: Swagger (via swagger-ui-express)
- Containerization: Docker, Docker Compose

---

## 🛠️ Prerequisites (for local execution)

- Node.js (v22+)
- PostgreSQL (v15+)
- Angular CLI (v19+)
- Docker + Docker Compose (if you want to run everything in containers)

---

## 📦 How to run locally

## 🔹 Backend

1️⃣ Clone the repository  
```bash
git clone <REPOSITORY_URL>
cd backend

2️⃣ Install dependencies

npm install

3️⃣ Configure the .env file
Create a .env file with:

DATABASE_URL=postgres://user:password@localhost:5432/database_name
JWT_SECRET=your_secret_key

4️⃣ Run migrations and seed

npx prisma migrate dev
npx ts-node prisma/seed.ts

5️⃣ Start the server

npm run dev

The API will be available at:

http://localhost:3000

🔹 Frontend

1️⃣ Go to the frontend directory

cd ../frontend

2️⃣ Install dependencies

npm install

3️⃣ Run the application

ng serve

The frontend will be available at:

http://localhost:4200


---

## 🐳 How to run with Docker

1️⃣ Make sure you have Docker and Docker Compose installed.

2️⃣ Execute:

docker-compose up --build

This will: ✅ Launch the PostgreSQL database
✅ Start the backend at http://localhost:3000
✅ Start the frontend at http://localhost:4200


---

## 🧪 How to run backend tests

In the backend directory, run:

npm run test

Tests are managed with Jest.


---

## 📖 Swagger (API Documentation)

After starting the backend, access:

http://localhost:3000/api-docs

Here you can explore all available routes, test API calls, and understand the request/response contracts.


---



