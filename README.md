# JUSWADRAWS — Digital Art Portfolio, Commission Platform & Interactive Sketch Community

Welcome to the official source repository for **JUSWADRAWS**, the personal digital art universe of independent illustrator Joshua Lagare.

This project is built with an expressive aesthetic combining **gritty anime energy** (inspired by *Gachiakuta* and *My Hero Academia*), **editorial art direction**, and a **tactile interactive sketchbook playground**.

---

## 🎨 Creative Highlights & Features

- **64 Original Artworks & Studies**: Directly cataloged from the artist's real vault across four collections: *Commissioned Work*, *My Photo (Self-Portraits)*, *Personal Works*, and *Sketches and Studies*.
- **Interactive Community Sketchpad**: Full HTML5 Canvas with freehand ink tools, multiple colors, adjustable brush diameters (2px–26px), eraser, undo/redo stack, local PNG export, and moderated cloud submission to the public doodle wall.
- **Official Commission Price Matrix & Estimator**: Exact Philippine Peso (PHP ₱) and US Dollar (USD $) rates with real-time add-on complexity handling (custom quote for character sheets in USD, additional characters, and scenic backgrounds).
- **Inquiry Transmission**: Connected to **EmailJS** to deliver structured client inquiries directly to `joshualagare255@gmail.com`, with anti-spam honeypot protection and 30-second submission throttling.
- **Private Artist Dashboard (`/admin`)**: Supabase Auth-protected portal for doodle moderation (approve/reject/delete), client inquiry review, cloud artwork uploads, and live Open/Closed commission status toggles.
- **Dynamic Dark/Light System**: Near-black charcoal/graphite manga screentones by default, with an instant switch to warm newsprint paper without screen flash.
- **Zero Heavy Bloat**: Built purely with React 18, Vite, Lucide React, and lightweight GSAP/CSS animations.

---

## 🛠️ Technology Stack

| Role | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 |
| **Bundler & Dev Server** | Vite 5 |
| **Routing** | React Router v6 (SPA with Vercel rewrites) |
| **Icons** | Lucide React |
| **Database & Storage** | Supabase (PostgreSQL with Row Level Security) |
| **Authentication** | Supabase Auth |
| **Inquiry Delivery** | EmailJS Browser SDK |
| **Deployment** | Vercel |

---

## 📁 Repository Structure

```text
art-portfolio2/
├── artworks/                   # Single source of truth for all 64 original pieces
│   ├── commissioned work/      # Client commissions
│   ├── my photo/               # Favicon, juswa-font asset & 3 self-portraits
│   ├── personal works/         # OCs, fan art & conceptual pieces
│   └── sketches and studies/   # Studies, anatomy & rough WIPs
├── public/                     # Public assets & browser favicon
├── scripts/
│   └── generate-manifest.js    # Manifest scanner that indexes artworks/
├── src/
│   ├── assets/                 # Icons, textures
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx          # Header, wordmark & mobile drawer
│   │   ├── Footer.jsx          # Socials, verified links & copyright
│   │   ├── SoftwareTools.jsx   # Animated tools of the trade
│   │   ├── ImageViewerModal.jsx# Fullscreen keyboard-navigable image modal
│   │   └── FloatingCommissionButton.jsx
│   ├── context/
│   │   ├── ThemeContext.jsx    # Dark/light mode persistence
│   │   └── AuthContext.jsx     # Supabase admin session provider
│   ├── data/
│   │   └── artworksManifest.js # Auto-generated artwork index
│   ├── pages/
│   │   ├── Home.jsx            # Hero, featured gallery, bio spotlight
│   │   ├── Artworks.jsx        # Editorial gallery with search & filters
│   │   ├── About.jsx           # Artist bio, influences & social channels
│   │   ├── Commissions.jsx     # Official rates, terms & live estimator
│   │   ├── Contact.jsx         # Commission inquiry form with EmailJS
│   │   ├── SketchWall.jsx      # Interactive canvas & community doodle wall
│   │   └── Admin.jsx           # Protected artist moderation dashboard
│   ├── styles/
│   │   ├── theme.css           # Theme custom properties
│   │   └── global.css          # Screentones, manga panels & typography
│   ├── utils/
│   │   ├── supabaseClient.js   # Supabase client & health checks
│   │   └── emailService.js     # EmailJS delivery & spam safeguards
│   ├── App.jsx                 # Routing and layout
│   └── main.jsx                # Application root
├── supabase/
│   └── migrations/
│       └── 20261011_initial_schema.sql # Production PostgreSQL & RLS schema
├── .env.example                # Safe environment variable placeholders
├── vercel.json                 # SPA route rewrite configuration
└── vite.config.js              # Vite config with artworks streaming plugin
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or newer (tested on Node v24.20.0)
- **Git**

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Local Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update the keys with your credentials (see setup sections below).

### 4. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
```
This bundles the frontend into `dist/` and automatically copies all `artworks/` files into `dist/artworks/` for seamless deployment.

---

## 🗄️ Supabase Backend Setup

To enable the **Doodle Wall**, **Admin Dashboard**, and **Inquiry Logging**:

1. Log into [Supabase](https://supabase.com/) and create a new project.
2. In the Supabase SQL Editor, copy and run the entire contents of:
   `supabase/migrations/20261011_initial_schema.sql`
   This automatically creates:
   - `doodles` table (with RLS: public can only view `status = 'approved'` and insert `status = 'pending'`).
   - `commission_inquiries` table (with RLS: private to authenticated admin).
   - `artworks` table (for dashboard-managed additions).
   - `site_settings` table (for live Open/Closed commission toggle).
   - `doodles` and `artworks` public storage buckets.
3. **Create Your First Admin User**:
   - Go to **Authentication > Users** in Supabase.
   - Click **Add User > Create User**.
   - Enter your email (e.g. `joshualagare255@gmail.com`) and choose a strong password.
   - Toggle "Auto Confirm User" so you can log in immediately.
4. **Copy API Keys**:
   - Go to **Project Settings > API**.
   - Copy the **Project URL** into `VITE_SUPABASE_URL`.
   - Copy the **anon / public key** into `VITE_SUPABASE_ANON_KEY`.

---

## ✉️ EmailJS Inquiry Delivery Setup

To receive inquiry notifications directly in your Gmail inbox:

1. Register or sign into [EmailJS](https://www.emailjs.com/).
2. In **Email Services**, connect your Gmail (`joshualagare255@gmail.com`). Note the **Service ID**.
3. In **Email Templates**, create a template with the following variables:
   - Subject: `New Commission Inquiry from {{client_name}} ({{artwork_type}})`
   - Body:
     ```text
     Client Name: {{client_name}}
     Reply Email: {{client_email}}
     Artwork Tier: {{artwork_type}}
     Currency & Rate: {{currency}} ({{estimated_price}})
     Deadline: {{deadline}}
     Additional Characters: {{additional_characters}}
     Detailed Background: {{detailed_background}}
     Preferred Style: {{preferred_style}}
     
     Description:
     {{description}}
     
     Reference Links:
     {{reference_links}}
     
     Notes:
     {{notes}}
     ```
   Note the **Template ID**.
4. In **Account > API Keys**, copy your **Public Key**.
5. Add these three keys to your `.env` and Vercel:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

---

## 🚀 Deploying to Vercel

1. Push your repository to **GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete JUSWADRAWS digital art portfolio & interactive sketch community"
   git remote add origin https://github.com/your-username/art-portfolio2.git
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Select your GitHub repository.
4. **Framework Preset**: Vite will be detected automatically.
5. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
6. Click **Deploy**. Vercel will build the project and deploy it with full SPA routing (`vercel.json`).

---

## 🖼️ Adding or Updating Artwork

1. Drop new images into any of the subfolders inside `artworks/`:
   - `artworks/commissioned work/`
   - `artworks/personal works/`
   - `artworks/sketches and studies/`
   - `artworks/my photo/`
2. Run the manifest generator:
   ```bash
   node scripts/generate-manifest.js
   ```
3. Commit and push the changes to GitHub—Vercel will redeploy automatically!

---

© 2026 JUSWADRAWS. All digital artwork and character designs by Joshua Lagare.
