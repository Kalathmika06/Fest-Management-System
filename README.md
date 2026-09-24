# Fest Volunteer Management App

A full-stack volunteer management system for college fests, matching the
provided design: a **purple** volunteer portal (login/register, dashboard,
browse & apply to opportunities, my applications, profile, announcements)
and a **green** admin portal (dashboard, all volunteers, role allocation,
opportunities, announcements, reports).

**Stack**
- Frontend: HTML5, CSS3, **AngularJS 1.x** (loaded via CDN, no build step)
- Backend: **Node.js** + **Express**
- Database: **MongoDB** (via Mongoose)
- Auth: JWT (JSON Web Tokens), passwords hashed with bcrypt

```
fest-volunteer-app/
├── backend/               Node/Express API + MongoDB models
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/            User, Opportunity, Application, Announcement, RoleAllocation
│   ├── routes/            auth, opportunities, applications, announcements, roleAllocation, volunteers
│   ├── server.js          App entry point (also serves the frontend)
│   ├── seed.js            Creates a default admin + starter data
│   └── package.json
└── frontend/               Static site, served by Express
    ├── volunteer/          login, register, dashboard, opportunities, my-applications, profile, announcements
    ├── admin/               login, dashboard, volunteers, volunteer-detail, role-allocation, opportunities, announcements, reports
    ├── css/style.css        Shared styles (purple + green themes)
    ├── js/app.js             Angular module + API/auth services
    ├── js/volunteer-controllers.js
    ├── js/admin-controllers.js
    └── assets/               (empty — add your own images/logo here, see "Adding your own images" below)
```

---

## 1. Prerequisites

Install these once on your machine:

1. **Node.js** (v18 or later) — https://nodejs.org
2. **MongoDB Community Server** — https://www.mongodb.com/try/download/community
   - After installing, make sure the MongoDB service is running:
     - Windows: it usually runs automatically as a service (check "Services" app for "MongoDB").
     - macOS (Homebrew): `brew services start mongodb-community`
     - Linux: `sudo systemctl start mongod`
   - Alternatively, use a free cloud database at https://www.mongodb.com/cloud/atlas and skip installing MongoDB locally (see step 3).

---

## 2. Install & configure the backend

Open a terminal in the `backend` folder:

```bash
cd fest-volunteer-app/backend
npm install
```

Create your environment file from the example:

```bash
cp .env.example .env
```

Open `.env` and check the values (defaults work for a local MongoDB install):

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/festVolunteerDB
JWT_SECRET=fest_volunteer_super_secret_key_change_me
```

> **Using MongoDB Atlas instead of a local database?** Replace `MONGO_URI`
> with your Atlas connection string, e.g.
> `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/festVolunteerDB`

---

## 3. Seed the database (creates the admin login)

This creates a default admin account and a few starter opportunities/
announcements (matching the wireframe) so you have something to see
immediately:

```bash
node seed.js
```

You should see:
```
Default admin created -> email: admin@tce.edu | password: admin123
Starter opportunities added.
Starter announcements added.
Seeding complete.
```

(You can edit `seed.js` any time to change the default admin credentials,
then delete the `users` collection in MongoDB and re-run it.)

---

## 4. Run the app

Still inside `backend`:

```bash
npm start
```

You should see:
```
MongoDB connected: mongodb://127.0.0.1:27017/festVolunteerDB
Server running on http://localhost:5000
```

The same Express server serves **both** the API and the static frontend, so
there's nothing else to start.

Open your browser to:

- **Volunteer portal:** http://localhost:5000/volunteer/login.html
- **Admin portal:** http://localhost:5000/admin/login.html
  - Login with: `admin@tce.edu` / `admin123`

For development with auto-restart on file changes, use `npm run dev`
instead of `npm start` (requires the `nodemon` dev dependency, already in
`package.json`).

---

## 5. How the pieces connect

1. **Frontend → Backend**: Every AngularJS page loads `js/app.js`, which
   defines an `ApiService`/`AuthService` that call the REST API at `/api/...`
   using Angular's `$http`. Because Express serves the frontend from the
   same origin (`http://localhost:5000`), no CORS configuration is needed
   for local use (CORS is still enabled in `server.js` in case you ever
   split the frontend onto a different port/host).
2. **Auth**: Login/Register call `/api/auth/...`, which returns a JWT. The
   token is stored in `localStorage` and automatically attached to every
   subsequent API call via an Angular HTTP interceptor
   (`authInterceptor` in `js/app.js`). Backend routes are protected with
   the `auth` / `adminOnly` middleware in `backend/middleware/auth.js`.
3. **Backend → MongoDB**: `server.js` calls `connectDB()` on startup, which
   uses Mongoose to connect using `MONGO_URI` from `.env`. All data
   (volunteers, opportunities, applications, announcements, role
   allocations) is stored in MongoDB collections defined by the Mongoose
   models in `backend/models/`.
4. **Page navigation**: Since this is a lightweight multi-page app (not a
   single-page Angular app with routing), each `.html` file is a full page
   that loads Angular fresh and mounts one controller. The left sidebar is
   a shared partial (`partials/sidebar.html`) pulled in with `ng-include`,
   so it looks identical across every page — exactly like the wireframe.

---

## 6. Adding your own images

You mentioned you'll add the real photos/logo yourself — here's where they
go. Drop your files into `frontend/assets/` and then update these spots
(each is already marked with a `TODO` comment in the HTML/CSS):

| What | File | What to change |
|---|---|---|
| Concert photo, volunteer login/register | `frontend/volunteer/login.html`, `register.html` | Replace the `background:linear-gradient(...)` on `.auth-image` with `background-image:url('../assets/your-photo.jpg'); background-size:cover; background-position:center;` |
| Concert photo, admin login | `frontend/admin/login.html` | Same as above |
| College/fest logo | `frontend/volunteer/login.html`, `frontend/admin/login.html` | Replace the emoji `<div>` inside `.logo-wrap` with `<img src="../assets/logo.png" />` |
| Volunteer avatar | `frontend/volunteer/profile.html`, `frontend/admin/volunteer-detail.html` | Replace `<div class="avatar-circle"></div>` with `<img src="../assets/avatar.png" class="avatar-circle" />` |

---

## 7. Default test accounts

| Role | Identifier | Password |
|---|---|---|
| Admin | `admin@tce.edu` | `admin123` |
| Volunteer | Register your own via "Register here" on the volunteer login page | — |

---

## 8. Troubleshooting

- **"MongoDB connection error"** — make sure MongoDB is running locally
  (`mongod`), or that your Atlas `MONGO_URI` is correct and your IP is
  whitelisted in Atlas's Network Access settings.
- **Blank page / Angular errors in console** — make sure you're loading
  pages through `http://localhost:5000/...` (started by `npm start`), not
  by double-clicking the HTML files directly — `ng-include` and the API
  calls require a real HTTP server, which Express provides.
- **Port 5000 already in use** — change `PORT` in `.env` to something else,
  e.g. `5050`, and restart with `npm start`.
