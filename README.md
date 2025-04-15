# 🚀 MERN Stack App with Docker

This project is a full-stack application built using:

- **MongoDB** (database)
- **Express.js** (backend)
- **React** (frontend)
- **Docker + Docker Compose** (for containerization)

---

## 🗂 Project Structure

```
my-app/
├── backend/             # Express.js API
│   ├── Dockerfile
│   ├── package.json
│   └── index.js
├── frontend/            # React App
│   ├── Dockerfile
│   ├── package.json
│   └── public/
├── docker-compose.yml   # Orchestrates all containers
```

---

## 🐳 Dockerized Setup

### 📦 Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/)

---

### ▶️ Getting Started

1. Clone this repo:

   ```bash
   git clone https://github.com/ravali0423/Project.git
   cd Project
   ```

2. Run Docker Compose Build:

   ```bash
   docker-compose up --build
   ```

3. Run Docker Build in Background:

   ```bash
   docker-compose up -d
   ```

4. Visit:

   - **Frontend**: `http://localhost:3000`
   - **Backend**: `http://localhost:5008`
   - **MongoDB**: Running on `mongodb://localhost:27017`

---

## 🎨 Tailwind CSS Setup (Frontend)

Tailwind is already configured in the `frontend/` directory. You can use utility classes right away in your React components.

To manually set it up:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Add the following to `tailwind.config.js`:

```js
content: ["./src/**/*.{js,jsx,ts,tsx}"];
```

And in `index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## ⚙️ Environment Variables

Update or set the following in `docker-compose.yml` under `backend`:

```env
MONGO_URL=mongodb://mongo:27017/atlantis
```

---

## 📁 Useful Scripts

In the **backend** and **frontend** folders:

```bash
npm install   # install dependencies
npm start     # run the server/app
```

---

## 💡 Tech Stack

- React 18+
- Express 4+
- MongoDB
- Node.js (v23.10.0 or use `node:current` in Dockerfile)
- Docker & Docker Compose

---

## 📜 License

MIT License. Feel free to use and customize!
