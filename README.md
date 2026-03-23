# ApplySmart 🚀

An AI-powered swipe-based job discovery web app built for fresh graduates in India.  
Discover relevant jobs, swipe to apply, and track your applications — all in one place.

---

## 🌐 Live Demo

[https://applysmart-app-chi.vercel.app](https://applysmart-app-chi.vercel.app)

---

## 💡 What is ApplySmart?

ApplySmart is a Tinder-style job discovery platform designed to reduce job-hunting stress for fresh graduates.  
Instead of scrolling through endless job boards, users swipe through personalized job cards and apply in one click.

Recruiters can also post job openings directly on the platform, making it a two-sided marketplace.

---

## ✨ Features

### For Job Seekers
- **Google OAuth Login** — Secure login with Google account
- **Role + Location Preferences** — Select up to 5 preferred roles and cities
- **Swipe Interface** — Swipe right to view details, swipe left to skip
- **List View** — Toggle between swipe and list mode
- **Search** — Search jobs by title, company, or location
- **Experience Filter** — Filter by Fresher, Internship, or Full Time
- **Refresh Button** — Fetch fresh jobs without page reload
- **Detailed Job View** — Full job description before applying
- **One-click Apply** — Opens the official job application link
- **Application Tracking** — Track all applied jobs
- **Live Activity Feed** — Real-time swipe history in dashboard
- **Profile Page** — View stats, roles, and manage preferences
- **Duplicate Prevention** — Already swiped jobs never appear again
- **Mobile Responsive** — Full bottom navigation on mobile

### For Recruiters
- **Separate Recruiter Portal** — Dedicated login and dashboard
- **Post Job Openings** — Title, company, location, description, salary, apply link
- **Manage Postings** — View and delete posted jobs
- **Jobs appear in seeker feed** — Recruiter posts show up in job seeker swipe feed

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
├── page.tsx                  → Home / Landing page
├── dashboard/
│   └── page.tsx              → Main swipe dashboard
├── preferences/
│   └── page.tsx              → Role + location selection
├── applied/
│   └── page.tsx              → Applied jobs list
├── profile/
│   └── page.tsx              → User profile page
├── recruiter/
│   ├── page.tsx              → Recruiter login page
│   └── dashboard/
│       └── page.tsx          → Recruiter job posting dashboard
├── api/
│   ├── jobs/
│   │   └── route.ts          → Fetch jobs from SerpAPI + posted jobs
│   ├── preferences/
│   │   └── route.ts          → Check user preferences
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts      → Google OAuth handler

lib/
└── supabase.ts               → Supabase client
```

---

## 🗄️ Database Schema (Supabase)

**user_preferences**
| Column | Type |
|---|---|
| id | uuid |
| user_email | text (unique) |
| roles | text[] |
| locations | text[] |
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

**posted_jobs**
| Column | Type |
|---|---|
| id | uuid |
| recruiter_email | text |
| title | text |
| company | text |
| location | text |
| description | text |
| apply_link | text |
| salary | text |
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
git clone https://github.com/parth7547/applysmart-app.git
cd applysmart-app
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
| <img width="1276" height="928" alt="image" src="https://github.com/user-attachments/assets/23e99c10-aa7b-43ad-989d-58563f3a1894" />
 | <img width="1280" height="926" alt="image" src="https://github.com/user-attachments/assets/c17db58c-4fe5-4a21-bbbf-cf921d622448" />
 | <img width="1919" height="926" alt="Profile" src="https://github.com/user-attachments/assets/342e0d1d-be45-49fb-9faa-c4f7143fdbfa" /> |

---

## 🔮 Future Scope

- Recruiter verification system (verified badge)
- Saved jobs feature
- Rejected jobs review page
- Smart job ranking based on swipe history
- Outreach message generator for recruiters
- Resume upload and job match scoring
- Mobile app version

---

## 👨‍💻 Built By

**Parth Khatu**  
BE in Artificial Intelligence & Data Science  
[LinkedIn](https://www.linkedin.com/in/parthkhatu1045/) • [GitHub](https://github.com/parth7547)

---

## 📄 License

MIT License — feel free to use and modify.
