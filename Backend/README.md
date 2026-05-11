# LifeOS Backend

Express.js + TypeScript backend API for LifeOS.

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
```

## Environment Variables

Create `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/lifeos
JWT_SECRET=your-secret-key
ADMIN_PASSWORD=admin123
PORT=3001
```

## Development

```bash
npm run dev
```

Server will run at [http://localhost:3001](http://localhost:3001)

## Build

```bash
npm run build
```

## Deployment to Vercel

1. Push code to GitHub
2. Create new Vercel project
3. Set environment variables in Vercel:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `ADMIN_PASSWORD` - Admin password
4. Deploy

The API will be available at `https://your-api.vercel.app/api`

## API Endpoints

- `POST /api/auth/login` - Login with password
- `GET /api/activities` - List activities
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/skills` - List skills
- `POST /api/skills` - Create skill
- Similar endpoints for projects and jobs
