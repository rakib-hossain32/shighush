# Phase 2: Backend Integration Roadmap - শিঘুষ

## Overview

Frontend complete হয়ে গেছে। এখন backend API integration করতে হবে।

---

## Architecture Decision

### Recommended: Next.js API Routes + Prisma + PostgreSQL

**Why?**
- Same codebase (monorepo সুবিধা)
- TypeScript types shared between frontend/backend
- Easy deployment to Vercel
- Prisma = Type-safe database queries

**Stack:**
```
Frontend: Next.js 16 (already done)
Backend: Next.js API Routes
Database: PostgreSQL (Supabase/Railway/local)
ORM: Prisma
Auth: NextAuth.js or custom JWT (already have JWT)
Storage: Cloudflare R2 / AWS S3 (for file uploads)
Email: Resend / SendGrid
```

---

## Phase 2 Tasks (Priority Order)

### 1. Database Setup ⭐⭐⭐
**Priority: HIGHEST**

Steps:
1. Install Prisma
2. Design database schema
3. Create migrations
4. Seed initial data

**Files to create:**
```
prisma/
  schema.prisma       # Database models
  seed.ts             # Initial data
  migrations/         # Version history
```

**Command:**
```bash
npm install prisma @prisma/client
npx prisma init
```

---

### 2. API Routes Structure ⭐⭐⭐
**Priority: HIGHEST**

**Create these routes:**
```
app/api/
  auth/
    login/route.ts
    logout/route.ts
    me/route.ts
  reports/
    route.ts              # GET (list), POST (create)
    [id]/route.ts         # GET, PATCH, DELETE
    [id]/publish/route.ts # POST
  institutions/
    route.ts
    [slug]/route.ts
  appeals/
    route.ts
  flags/
    route.ts
  admin/
    users/route.ts
    audit-logs/route.ts
```

---

### 3. Replace Mock Data ⭐⭐⭐
**Priority: HIGH**

**Currently:**
```typescript
// lib/mock/queries.ts
export function listReports() {
  return MOCK_REPORTS;
}
```

**Phase 2:**
```typescript
// services/reports/queries.ts
export async function listReports(filters) {
  return await prisma.report.findMany({
    where: filters,
    include: { institution: true }
  });
}
```

**Files to replace:**
- `lib/mock/queries.ts` → `services/*/queries.ts`
- `lib/mock/users.ts` → Database

---

### 4. Authentication (Real) ⭐⭐⭐
**Priority: HIGH**

**Current:** Mock authentication with plain password
**Phase 2:** Real authentication with hashing

**Steps:**
1. Install bcrypt: `npm install bcrypt @types/bcrypt`
2. Hash passwords in database
3. Update login action to verify hashed password
4. Add password reset flow

**Update files:**
- `app/(auth)/admin/login/actions.ts`
- `lib/auth/jwt.ts` (already good)
- `lib/auth/dal.ts` (already good)

---

### 5. File Upload (Evidence) ⭐⭐
**Priority: MEDIUM**

Reports can have evidence (photos, documents).

**Options:**
1. **Cloudflare R2** (S3-compatible, cheap)
2. **AWS S3**
3. **Supabase Storage**

**Implementation:**
```typescript
// app/api/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');
  
  // Upload to R2/S3
  const url = await uploadToR2(file);
  
  return Response.json({ url });
}
```

---

### 6. Email Notifications ⭐⭐
**Priority: MEDIUM**

When report is published, notify submitter (if they opted in).

**Recommended:** Resend (resend.com)
- Modern API
- Free tier: 3,000 emails/month
- Great DX

```bash
npm install resend
```

```typescript
// lib/email/client.ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportPublishedEmail(email, caseId) {
  await resend.emails.send({
    from: 'শিঘুষ <notifications@shighush.org>',
    to: email,
    subject: `আপনার রিপোর্ট প্রকাশিত হয়েছে (${caseId})`,
    html: `...`
  });
}
```

---

### 7. Rate Limiting ⭐⭐
**Priority: MEDIUM**

Prevent abuse.

**Recommended:** upstash/ratelimit

```bash
npm install @upstash/ratelimit @upstash/redis
```

```typescript
// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

---

### 8. Error Tracking ⭐
**Priority: LOW (but important)**

**Recommended:** Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Auto-captures errors in production.

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  role      Role
  createdAt DateTime @default(now())
  
  auditLogs AuditLog[]
  
  @@map("users")
}

enum Role {
  Admin
  Moderator
}

model Report {
  id                 String   @id @default(cuid())
  caseId             String   @unique // শি-০০৪২
  
  institutionName    String
  institutionId      String?
  institution        Institution? @relation(fields: [institutionId], references: [id])
  
  category           String
  area               String
  narrative          String
  incidentDate       DateTime
  incidentDatePrecision String
  
  moneyAmount        Int?
  moneyType          String?
  
  status             ReportStatus @default(received)
  verificationLevel  VerificationLevel @default(unverified)
  
  publishedAt        DateTime?
  reviewedBy         String?
  
  piiFindings        String[] // JSON array of PII types found
  
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  flags              Flag[]
  appeals            Appeal[]
  evidence           Evidence[]
  
  @@map("reports")
}

enum ReportStatus {
  received
  under_review
  awaiting_redaction
  published
  archived
  removed
}

enum VerificationLevel {
  unverified
  evidence_attached
  corroborated
  official_record
}

model Institution {
  id          String   @id @default(cuid())
  slug        String   @unique
  nameBn      String
  nameEn      String?
  category    String
  type        String
  area        String
  
  reports     Report[]
  
  @@map("institutions")
}

model Appeal {
  id          String   @id @default(cuid())
  reportId    String
  report      Report   @relation(fields: [reportId], references: [id])
  
  reason      String
  description String
  status      AppealStatus @default(received)
  
  createdAt   DateTime @default(now())
  
  @@map("appeals")
}

enum AppealStatus {
  received
  in_review
  resolved
  rejected
}

model Flag {
  id          String   @id @default(cuid())
  reportId    String
  report      Report   @relation(fields: [reportId], references: [id])
  
  reason      String
  details     String?
  status      FlagStatus @default(open)
  
  createdAt   DateTime @default(now())
  
  @@map("flags")
}

enum FlagStatus {
  open
  reviewed
  actioned
  dismissed
}

model Evidence {
  id          String   @id @default(cuid())
  reportId    String
  report      Report   @relation(fields: [reportId], references: [id])
  
  type        EvidenceType
  url         String
  filename    String
  verified    Boolean @default(false)
  
  createdAt   DateTime @default(now())
  
  @@map("evidence")
}

enum EvidenceType {
  document
  image
  audio
  video
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  action      String   // report:publish, user:create, etc.
  targetType  String   // report, user, institution
  targetId    String
  details     Json?
  
  createdAt   DateTime @default(now())
  
  @@map("audit_logs")
}

model Person {
  id               String   @id @default(cuid())
  slug             String   @unique
  name             String
  designation      String?
  nameVisibility   NameVisibility @default(hidden)
  
  reportCount      Int      @default(0)
  verifiedCount    Int      @default(0)
  
  createdAt        DateTime @default(now())
  
  @@map("people")
}

enum NameVisibility {
  hidden
  published
  redacted
}
```

---

## Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/shighush"

# Auth (already have)
JWT_SECRET="your-secret-key-min-32-chars"

# File Upload (Cloudflare R2)
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="shighush-evidence"

# Email (Resend)
RESEND_API_KEY="re_xxxxx"

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxxxx"

# Error Tracking (Sentry)
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Migration Strategy

### Step 1: Run Both (Dual Mode)
```typescript
// services/reports/queries.ts
export async function listReports(filters) {
  if (process.env.USE_MOCK === 'true') {
    return MOCK_REPORTS; // Phase 1
  }
  return await prisma.report.findMany(filters); // Phase 2
}
```

### Step 2: Gradual Migration
1. Week 1: Reports API
2. Week 2: Institutions API
3. Week 3: Admin features (users, audit logs)
4. Week 4: Appeals, flags
5. Week 5: File uploads
6. Week 6: Email notifications

### Step 3: Remove Mock
Once all APIs working, delete `lib/mock/`

---

## Testing Strategy

### 1. API Testing
```bash
npm install --save-dev vitest @vitejs/plugin-react
```

```typescript
// __tests__/api/reports.test.ts
import { POST } from '@/app/api/reports/route';

describe('POST /api/reports', () => {
  test('creates report with valid data', async () => {
    const request = new Request('http://localhost/api/reports', {
      method: 'POST',
      body: JSON.stringify({ /* valid data */ })
    });
    
    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

### 2. E2E Testing
```bash
npm install --save-dev @playwright/test
```

```typescript
// e2e/report-submission.spec.ts
test('submit report end-to-end', async ({ page }) => {
  await page.goto('/report/new');
  await page.fill('#institutionName', 'ভূমি অফিস');
  // ... fill form
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

---

## Deployment

### Recommended: Vercel + Supabase

**Vercel (Frontend + API Routes):**
```bash
npm install -g vercel
vercel login
vercel
```

**Supabase (PostgreSQL):**
1. Go to supabase.com
2. Create new project
3. Copy DATABASE_URL
4. Run migrations: `npx prisma migrate deploy`

**Alternative:** Railway.app (all-in-one)

---

## Timeline Estimate

| Task | Time |
|------|------|
| Database setup + schema | 2 days |
| Reports API | 3 days |
| Institutions API | 2 days |
| Admin APIs | 3 days |
| File uploads | 2 days |
| Email notifications | 1 day |
| Authentication upgrade | 2 days |
| Testing | 3 days |
| Deployment setup | 1 day |
| **Total** | **~3 weeks** |

---

## Next Immediate Steps

1. **Choose database hosting:**
   - Supabase (recommended, free tier)
   - Railway
   - Local PostgreSQL

2. **Install Prisma:**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

3. **Copy schema above** to `prisma/schema.prisma`

4. **Create initial migration:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Create first API route:**
   Start with `app/api/reports/route.ts`

---

## Questions to Decide

Before starting Phase 2, decide:

1. **Database hosting?** (Supabase / Railway / Local)
2. **File storage?** (Cloudflare R2 / AWS S3 / Supabase)
3. **Email service?** (Resend / SendGrid / AWS SES)
4. **Domain name?** (for production deployment)

---

## Phase 2 Success Criteria

✅ All mock data replaced with real database
✅ File uploads working
✅ Email notifications sending
✅ Password hashing implemented
✅ Rate limiting active
✅ Error tracking configured
✅ API tests passing
✅ Deployed to production
✅ SSL certificate active
✅ Monitoring dashboard setup

---

**Status:** 📋 READY TO START

**First Command:**
```bash
cd shighush
npm install prisma @prisma/client bcrypt @types/bcrypt
npx prisma init
```

Then edit `prisma/schema.prisma` with the schema above.
