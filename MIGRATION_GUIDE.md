# Copy Instructions

To complete the frontend setup, copy the remaining component and page files from the original monolith:

## From: `src/client/pages/`

Copy all files to: `Frontend/src/client/pages/`

- ActivityLogPage.tsx
- HistoryPage.tsx
- AnalyticsPage.tsx
- SkillsPage.tsx
- ProjectsPage.tsx
- JobsPage.tsx
- SettingsPage.tsx
- LoginPage.tsx

## From: `src/client/components/`

Copy all files to: `Frontend/src/client/components/`

- Layout/
  - Shell.tsx
  - Sidebar.tsx
  - Topbar.tsx
  - BottomNav.tsx
- ui/
  - Button.tsx
  - Modal.tsx
  - MultiSelect.tsx

## Directory Structure Created

```
Lifeos/
├── Backend/                 ← Express API (deploy to Vercel)
│   ├── src/
│   │   ├── server/
│   │   │   ├── index.ts
│   │   │   ├── prisma.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts
│   │   │   │   └── errorHandler.ts
│   │   │   └── routes/
│   │   │       ├── auth.ts
│   │   │       ├── activities.ts
│   │   │       ├── skills.ts
│   │   │       ├── projects.ts
│   │   │       ├── jobs.ts
│   │   │       └── config.ts
│   │   └── shared/
│   │       └── types.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json
│   ├── .env.example
│   ├── docker-compose.yml
│   └── README.md
│
├── Frontend/                ← React + Vite (deploy to Vercel)
│   ├── src/
│   │   ├── client/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── index.css
│   │   │   ├── api/
│   │   │   │   ├── client.ts
│   │   │   │   ├── endpoints.ts
│   │   │   │   └── index.ts
│   │   │   ├── store/
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── ActivityLogPage.tsx
│   │   │   │   ├── HistoryPage.tsx
│   │   │   │   ├── AnalyticsPage.tsx
│   │   │   │   ├── SkillsPage.tsx
│   │   │   │   ├── ProjectsPage.tsx
│   │   │   │   ├── JobsPage.tsx
│   │   │   │   ├── SettingsPage.tsx
│   │   │   │   └── LoginPage.tsx
│   │   │   └── components/
│   │   │       ├── Layout/
│   │   │       │   ├── Shell.tsx
│   │   │       │   ├── Sidebar.tsx
│   │   │       │   ├── Topbar.tsx
│   │   │       │   └── BottomNav.tsx
│   │   │       └── ui/
│   │   │           ├── Button.tsx
│   │   │           ├── Modal.tsx
│   │   │           └── MultiSelect.tsx
│   │   └── shared/
│   │       └── types.ts
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── vercel.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
```

All files you see above have been created with the proper configurations.
