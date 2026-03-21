# ApplySmart 🚀

An AI-powered swipe-based job discovery web app built for fresh graduates in India.  
Discover relevant jobs, swipe to apply, and track your applications — all in one place.

---

## 🌐 Live Demo

[https://applysmart-app.vercel.app](https://applysmart-app.vercel.app)

---

## 💡 What is ApplySmart?

ApplySmart is a Tinder-style job discovery platform designed to reduce job-hunting stress for fresh graduates.  
Instead of scrolling through endless job boards, users swipe through personalized job cards and apply in one click.

---

## ✨ Features

- **Google OAuth Login** — Secure login with Google account
- **Role-based Preferences** — Select up to 5 preferred job roles
- **Swipe Interface** — Swipe right to view details, swipe left to skip
- **Detailed Job View** — Full job description before applying
- **One-click Apply** — Opens the official job application link
- **Application Tracking** — Track all applied and rejected jobs
- **Live Activity Feed** — Real-time swipe history in the dashboard
- **Profile Page** — View stats, roles, and manage preferences
- **Duplicate Prevention** — Already swiped jobs never appear again

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Authentication | NextAuth.js (Google OAuth) |
| Database | Supabase (PostgreSQL) |
| Job Data | SerpAPI (Google Jobs) |
| Deployment | Vercel |

---

## 📁 Project Structure
```
app/
├── page.tsx              → Home / Landing page
├── dashboard/
│   └── page.tsx          → Main swipe dashboard
├── preferences/
│   └── page.tsx          → Role selection page
├── applied/
│   └── page.tsx          → Applied jobs list
├── profile/
│   └── page.tsx          → User profile page
├── api/
│   ├── jobs/
│   │   └── route.ts      → Fetch jobs from SerpAPI
│   ├── preferences/
│   │   └── route.ts      → Check user preferences
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts  → Google OAuth handler

lib/
└── supabase.ts           → Supabase client
```

---

## 🗄️ Database Schema (Supabase)

**user_preferences**
| Column | Type |
|---|---|
| id | uuid |
| user_email | text (unique) |
| roles | text[] |
| created_at | timestamp |

**swipes**
| Column | Type |
|---|---|
| id | uuid |
| user_email | text |
| job_title | text |
| company | text |
| status | text (applied / rejected) |
| created_at | timestamp |

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SERPAPI_KEY=your_serpapi_key
```

---

## 🚀 Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/applysmart-v2.git
cd applysmart-v2
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env.local
# Fill in your keys
```

**4. Run the development server**
```bash
npm run dev
```

**5. Open in browser**
```
http://localhost:3000
```

---

## 📸 Screenshots

| Home | Dashboard | Profile |
|---|---|---|
| ![Home](#) | ![Dashboard](#) | ![Profile](#) |

---

## 🔮 Future Scope

- Smart job ranking based on swipe history
- Outreach message generator for recruiters
- Resume upload and job match scoring
- Rejected jobs review page
- Mobile app version

---

## 👨‍💻 Built By

**Parth Khatu**  
BE in Artificial Intelligence & Data Science  
[LinkedIn](#) • [GitHub](#)

---

## 📄 License

MIT License — feel free to use and modify.

# ApplySmart 🚀

An AI-powered swipe-based job discovery web app built for fresh graduates in India.  
Discover relevant jobs, swipe to apply, and track your applications — all in one place.

---

## 🌐 Live Demo

[https://applysmart-app.vercel.app](https://applysmart-app.vercel.app)

---

## 💡 What is ApplySmart?

ApplySmart is a Tinder-style job discovery platform designed to reduce job-hunting stress for fresh graduates.  
Instead of scrolling through endless job boards, users swipe through personalized job cards and apply in one click.

---

## ✨ Features

- **Google OAuth Login** — Secure login with Google account
- **Role-based Preferences** — Select up to 5 preferred job roles
- **Swipe Interface** — Swipe right to view details, swipe left to skip
- **Detailed Job View** — Full job description before applying
- **One-click Apply** — Opens the official job application link
- **Application Tracking** — Track all applied and rejected jobs
- **Live Activity Feed** — Real-time swipe history in the dashboard
- **Profile Page** — View stats, roles, and manage preferences
- **Duplicate Prevention** — Already swiped jobs never appear again

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Authentication | NextAuth.js (Google OAuth) |
| Database | Supabase (PostgreSQL) |
| Job Data | SerpAPI (Google Jobs) |
| Deployment | Vercel |

---

## 📁 Project Structure
```
app/
├── page.tsx              → Home / Landing page
├── dashboard/
│   └── page.tsx          → Main swipe dashboard
├── preferences/
│   └── page.tsx          → Role selection page
├── applied/
│   └── page.tsx          → Applied jobs list
├── profile/
│   └── page.tsx          → User profile page
├── api/
│   ├── jobs/
│   │   └── route.ts      → Fetch jobs from SerpAPI
│   ├── preferences/
│   │   └── route.ts      → Check user preferences
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts  → Google OAuth handler

lib/
└── supabase.ts           → Supabase client
```

---

## 🗄️ Database Schema (Supabase)

**user_preferences**
| Column | Type |
|---|---|
| id | uuid |
| user_email | text (unique) |
| roles | text[] |
| created_at | timestamp |

**swipes**
| Column | Type |
|---|---|
| id | uuid |
| user_email | text |
| job_title | text |
| company | text |
| status | text (applied / rejected) |
| created_at | timestamp |

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SERPAPI_KEY=your_serpapi_key
```

---

## 🚀 Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/applysmart-v2.git
cd applysmart-v2
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env.local
# Fill in your keys
```

**4. Run the development server**
```bash
npm run dev
```

**5. Open in browser**
```
http://localhost:3000
```

---

## 📸 Screenshots

| Home | Dashboard | Profile |
| <img width="1918" height="928" alt="image" src="https://github.com/user-attachments/assets/4bf85b62-76fe-42b0-a518-5abc2382ae60" /> | 
| <img width="1918" height="926" alt="image" src="https://github.com/user-attachments/assets/290dce1e-ace4-45df-8bb6-dd50abb8ae06" /> | 
| <img width="1919" height="926" alt="image" src="https://github.com/user-attachments/assets/342e0d1d-be45-49fb-9faa-c4f7143fdbfa" /> |

---

## 🔮 Future Scope

- Smart job ranking based on swipe history
- Outreach message generator for recruiters
- Resume upload and job match scoring
- Rejected jobs review page
- Mobile app version

---

## 👨‍💻 Built By

**Parth Khatu**  
BE in Artificial Intelligence & Data Science  
[[LinkedIn](#)](https://www.linkedin.com/in/parthkhatu1045/) • [[GitHub](#)](https://github.com/parth7547)

---

## 📄 License

MIT License — feel free to use and modify.

