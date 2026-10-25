# R P Global Projects — REST API & Centralized Backend

Production-ready Node.js, Express, and TypeScript REST API powered by **MongoDB (Mongoose)** for **R P Global Projects** ([rpglobalprojects.com](https://rpglobalprojects.com/)). Handles public RFQ inquiries, raw water test report uploads, career applications with CV parsing, product catalog management, and enterprise backoffice operations.

---

## 🚀 Technology Stack

* **Runtime:** [Node.js](https://nodejs.org/) (v18+ or v20+)
* **Framework:** [Express.js](https://expressjs.com/) (v4.21)
* **Language:** TypeScript 5 (Target ES2022, CommonJS output in `dist/`)
* **Database & ODM:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) (v8.10)
* **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
* **File Uploads:** [Multer](https://github.com/expressjs/multer) (Disk storage in `uploads/` with 10MB limit)
* **Security & Utility:** [Helmet](https://helmetjs.github.io/), CORS, Morgan (HTTP logger), Zod (Validation), TSX (TypeScript execution engine)

---

## 📁 Directory Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.ts                      # Mongoose connection manager with auto-reconnect & error resilience
│   ├── models/
│   │   ├── User.ts                    # Admin staff accounts (bcrypt password hashing, RBAC)
│   │   ├── Product.ts                 # 6 Core Industrial Plant schemas & technical specifications
│   │   ├── Lead.ts                    # RFQ submissions, inlet chemistry, water test report PDF URLs
│   │   ├── JobOpening.ts              # Career listings with departments, requirements, active status
│   │   ├── JobApplication.ts          # Candidate applications with uploaded resume URLs & ATS stages
│   │   ├── ProjectGallery.ts          # Commissioned plant installations with KLD capacity & client sector
│   │   └── ClientTestimonial.ts       # Verified client feedback and ratings
│   ├── middlewares/
│   │   ├── auth.ts                    # JWT token verification and requireRole RBAC guard
│   │   ├── upload.ts                  # Multer disk storage for water test reports, resumes, and photos
│   │   └── errorHandler.ts            # Centralized API error response handler
│   ├── controllers/
│   │   ├── authController.ts          # Staff login and current user profile
│   │   ├── productController.ts       # Public product lookup & Admin CMS operations
│   │   ├── rfqController.ts           # Public RFQ submission with PDF upload & Admin CRM pipeline
│   │   ├── jobController.ts           # Public career openings, candidate CV upload & ATS pipeline
│   │   ├── galleryController.ts       # Public installation gallery & Admin photo uploads
│   │   └── adminController.ts         # Dashboard analytics & KPI aggregation
│   ├── routes/
│   │   ├── authRoutes.ts              # /api/v1/auth
│   │   ├── productRoutes.ts           # /api/v1/products
│   │   ├── rfqRoutes.ts               # /api/v1/rfq
│   │   ├── jobRoutes.ts               # /api/v1/jobs
│   │   ├── galleryRoutes.ts           # /api/v1/gallery
│   │   └── adminRoutes.ts             # /api/v1/admin
│   ├── seed/
│   │   └── seed.ts                    # Complete seed script populating 6 plants, jobs, gallery & admin
│   └── index.ts                       # Express app entrypoint & middleware pipeline
├── uploads/                           # Local storage for resumes, reports, and project images
├── package.json
├── tsconfig.json
└── .env
```

---

## 🗄️ Database Schemas & Models

1. **`User`**:
   * Admin credentials with bcrypt salt hashing.
   * Roles: `SUPER_ADMIN`, `SALES_MANAGER`, `HR_MANAGER`, `EDITOR`.

2. **`Product`**:
   * 6 Core Industrial Plants:
     * `Demineralization (DM) Plant` (`slug: demineralization-plants`)
     * `Effluent Treatment Plant (ETP)` (`slug: effluent-treatment-plants`)
     * `Reverse Osmosis (RO) Plant` (`slug: reverse-osmosis-plants`)
     * `Sewage Treatment Plant (STP)` (`slug: sewage-treatment-plants`)
     * `Water Softening Plant` (`slug: water-softening-plants`)
     * `Water Treatment Plant (WTP)` (`slug: water-treatment-plants`)
   * Dynamic technical specs array (`label`, `value`, `unit`, `category`), process flowchart steps (`stepNumber`, `title`, `description`), and key engineering features.

3. **`Lead`**:
   * Lead capture with company name, contact person, phone, email, required plant category, capacity in KLD, raw water source, inlet parameters, and attached test report PDF path.
   * CRM Statuses: `NEW`, `CONTACTED`, `TECHNICAL_EVALUATION`, `PROPOSAL_SENT`, `WON`, `LOST`.
   * Internal remarks log with timestamps.

4. **`JobOpening` & `JobApplication`**:
   * Job opening listings with departments, qualifications, and active state.
   * Candidate applications with contact info, experience, and uploaded resume CV.
   * ATS Stages: `SUBMITTED`, `SHORTLISTED`, `INTERVIEW_SCHEDULED`, `REJECTED`, `HIRED`.

5. **`ProjectGallery`**:
   * Commissioned installations across India with title, plant category, design capacity (e.g. `500 KLD`, `25 m³/hr`), location, client sector, completion year, and featured flag.

---

## 🔌 API Endpoints Catalog

Base URL: `http://localhost:5000/api/v1`

### 1. Health & Status
* `GET /health` — API status check (uptime, environment, timestamp).

### 2. Authentication (`/auth`)
* `POST /auth/login` — Staff login (Email + Password). Returns JWT token & user profile.
* `GET /auth/me` — *(Authenticated)* Returns current authenticated user profile.

### 3. Products & Plants (`/products`)
* `GET /products` — List all published plant solutions.
* `GET /products/:slug` — Retrieve comprehensive technical specs by slug.
* `POST /products` — *(Admin)* Create a new plant solution.
* `PUT /products/:id` — *(Admin)* Update plant specs, process flowchart, or descriptions.
* `DELETE /products/:id` — *(Admin)* Delete plant entry.

### 4. RFQ Leads CRM (`/rfq`)
* `POST /rfq` — *(Public)* Submit engineering inquiry with optional `waterReport` PDF upload (`multipart/form-data`).
* `GET /rfq` — *(Admin)* List leads with status and category filtering.
* `GET /rfq/:id` — *(Admin)* Get full lead profile with inlet chemistry.
* `PATCH /rfq/:id/status` — *(Admin)* Update pipeline status (`NEW` ➔ `WON`/`LOST`).
* `POST /rfq/:id/notes` — *(Admin)* Append internal engineering notes.

### 5. Careers & ATS (`/jobs`)
* `GET /jobs` — *(Public)* List active career openings.
* `GET /jobs/:identifier` — *(Public)* Get job details by ID or slug.
* `POST /jobs/:id/apply` — *(Public)* Apply for position with `resume` PDF/DOC upload (`multipart/form-data`).
* `POST /jobs` — *(Admin)* Create new job opening.
* `PATCH /jobs/:id` — *(Admin)* Update job opening or toggle active status.
* `GET /jobs/admin/applications` — *(Admin)* View candidate pipeline.
* `PATCH /jobs/admin/applications/:appId/status` — *(Admin)* Move candidate to next hiring stage.

### 6. Project Gallery (`/gallery`)
* `GET /gallery` — *(Public)* List commissioned plant installations (supports `?category=...`).
* `POST /gallery` — *(Admin)* Upload new installation project with photo (`multipart/form-data`).
* `DELETE /gallery/:id` — *(Admin)* Delete gallery item.

### 7. Operations Analytics (`/admin`)
* `GET /admin/summary` — *(Admin)* Aggregate counts of total leads, pending evaluations, active jobs, applications, and recent incoming inquiries.

---

## ⚙️ Environment Variables

Create `.env` in `server/`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/rpglobal
JWT_SECRET=rpglobal_super_secret_jwt_key_2026_industrial_clean_tech
CLIENT_URL=http://localhost:3000
```

---

## 🛠️ Development & Build Commands

```bash
# Install dependencies
npm install

# Seed verified industrial plants and default admin user
npm run seed

# Start development server with hot-reload (tsx watch)
npm run dev

# Compile TypeScript to dist/
npm run build

# Start production server
npm start
```

### Default Seed Admin Credentials
* **Email:** `admin@rpglobalprojects.com`
* **Password:** `Admin@RPGlobal2026!`
