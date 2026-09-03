# 🔄 API Migration Guide - Mock Data থেকে Real API তে

এই guide follow করে frontend এর সব pages এ real backend API integrate করুন।

---

## 📋 Current Status

### ✅ Already Setup:
- Backend API (40+ endpoints) fully functional
- API Client (`lib/api/client.ts`) with all endpoints
- API Services (`lib/api/services.ts`) for server-side calls
- API Adapters (`lib/api/adapters.ts`) for type conversion

### ⚠️ Need to Update:
সব pages এখনো mock data use করছে। এগুলো real API তে migrate করতে হবে।

---

## 🎯 Migration Strategy

### Option 1: Gradual Migration (Recommended)
একটা করে page update করুন এবং test করুন।

### Option 2: All at Once
সব pages একসাথে update করুন (risky but faster)।

---

## 📝 Step-by-Step Migration Process

### Step 1: Public Reports Page

**File**: `app/(public)/reports/page.tsx`

**Current**:
```tsx
import { listReports } from "@/lib/mock/queries";

const { data: reports, meta } = listReports({ ... });
```

**Update to**:
```tsx
import { reportsService } from "@/lib/api/services";
import { adaptPublicReport, adaptPagination } from "@/lib/api/adapters";

// Fetch from real API
const response = await reportsService.list({
  page: filters.page,
  limit: filters.limit,
  search: filters.search,
  category: filters.category?.join(','),
  area: filters.area,
  // Note: Backend uses 'status' filter, frontend might need mapping
});

// Adapt to frontend types
const reports = response.reports.map(adaptPublicReport);
const meta = adaptPagination(response.pagination);
```

---

### Step 2: Report Detail Page

**File**: `app/(public)/reports/[slug]/page.tsx`

**Current**:
```tsx
import { getReportBySlug } from "@/lib/mock/queries";

const report = getReportBySlug(params.slug);
```

**Update to**:
```tsx
import { reportsService } from "@/lib/api/services";
import { adaptPublicReport } from "@/lib/api/adapters";

// slug is actually caseId (e.g., "শি-০০০১")
const apiReport = await reportsService.getById(params.slug);
const report = adaptPublicReport(apiReport);
```

---

### Step 3: Admin Dashboard

**File**: `app/(dashboard)/admin/page.tsx`

**Current**:
```tsx
import { getAdminOverview } from "@/lib/mock/queries";

const overview = getAdminOverview();
```

**Update to**:
```tsx
import { adminService } from "@/lib/api/services";
import { getSession } from "@/lib/auth/dal"; // Get JWT token

const session = await getSession();
if (!session?.token) {
  // Handle unauthorized
}

const stats = await adminService.getDashboardStats(session.token);

// stats.metrics will have: total, queue, published, today
// stats.piiAlerts will have count
```

---

### Step 4: Admin Reports List

**File**: `app/(dashboard)/admin/reports/page.tsx`

**Current**:
```tsx
import { listModerationQueue } from "@/lib/mock/queries";

const { data: reports, meta } = listModerationQueue({ ... });
```

**Update to**:
```tsx
import { reportsService } from "@/lib/api/services";
import { adaptModerationReport, adaptPagination } from "@/lib/api/adapters";
import { getSession } from "@/lib/auth/dal";

const session = await getSession();

// Backend doesn't have separate "moderation queue" endpoint
// Use regular reports endpoint with status filter
const response = await reportsService.list({
  page: filters.page,
  limit: filters.limit,
  status: filters.status?.join(',') || 'received,under_review',
  category: filters.category?.join(','),
  area: filters.area,
  search: filters.search,
});

const reports = response.reports.map(adaptModerationReport);
const meta = adaptPagination(response.pagination);
```

---

### Step 5: Institutions Page

**File**: `app/(public)/institutions/page.tsx`

**Current**:
```tsx
import { listInstitutions } from "@/lib/mock/queries";

const { data: institutions } = listInstitutions({ ... });
```

**Update to**:
```tsx
import { institutionsService } from "@/lib/api/services";
import { adaptInstitution } from "@/lib/api/adapters";

const response = await institutionsService.list({
  page: filters.page,
  limit: filters.limit,
  category: filters.category,
  area: filters.area,
  type: filters.type,
  search: filters.search,
});

const institutions = response.institutions.map(adaptInstitution);
```

---

### Step 6: Appeals Page (Admin)

**File**: `app/(dashboard)/admin/appeals/page.tsx`

**Current**:
```tsx
import { listAppeals } from "@/lib/mock/queries";

const appeals = listAppeals();
```

**Update to**:
```tsx
import { appealsService } from "@/lib/api/services";
import { adaptAppeal } from "@/lib/api/adapters";
import { getSession } from "@/lib/auth/dal";

const session = await getSession();

const response = await appealsService.list(session.token, {
  page: 1,
  limit: 50,
  status: 'received', // or from filters
});

const appeals = response.appeals.map(adaptAppeal);
```

---

### Step 7: Flags Page (Admin)

**File**: `app/(dashboard)/admin/flags/page.tsx`

**Current**:
```tsx
import { listFlags } from "@/lib/mock/queries";

const flags = listFlags();
```

**Update to**:
```tsx
import { flagsService } from "@/lib/api/services";
import { adaptFlag } from "@/lib/api/adapters";
import { getSession } from "@/lib/auth/dal";

const session = await getSession();

const response = await flagsService.list(session.token, {
  page: 1,
  limit: 50,
  status: 'open', // or from filters
});

const flags = response.flags.map(adaptFlag);
```

---

### Step 8: Users Page (Admin)

**File**: `app/(dashboard)/admin/users/page.tsx`

**Current**:
```tsx
import { listStaffUsers } from "@/lib/mock/queries";

const users = listStaffUsers();
```

**Update to**:
```tsx
import { adminService } from "@/lib/api/services";
import { adaptStaffUser } from "@/lib/api/adapters";
import { getSession } from "@/lib/auth/dal";

const session = await getSession();

const response = await adminService.listUsers(session.token, {
  page: 1,
  limit: 50,
  role: 'Admin', // or from filters
});

const users = response.users.map(adaptStaffUser);
```

---

### Step 9: Audit Logs Page (Admin)

**File**: `app/(dashboard)/admin/audit-logs/page.tsx`

**Current**:
```tsx
import { listAuditLog } from "@/lib/mock/queries";

const logs = listAuditLog();
```

**Update to**:
```tsx
import { adminService } from "@/lib/api/services";
import { adaptAuditLog } from "@/lib/api/adapters";
import { getSession } from "@/lib/auth/dal";

const session = await getSession();

const response = await adminService.listAuditLogs(session.token, {
  page: 1,
  limit: 100,
});

const logs = response.logs.map(adaptAuditLog);
```

---

## 🔐 Authentication in Server Components

সব protected routes এ JWT token দরকার:

```tsx
import { getSession } from "@/lib/auth/dal";

export default async function ProtectedPage() {
  const session = await getSession();
  
  if (!session?.token) {
    redirect('/admin/login');
  }

  // Use session.token in API calls
  const data = await adminService.getDashboardStats(session.token);
  
  return <div>...</div>;
}
```

---

## 🛠️ Error Handling

API calls may fail, handle gracefully:

```tsx
try {
  const data = await reportsService.list({ ... });
  // Use data
} catch (error) {
  console.error('Failed to fetch reports:', error);
  // Show error state or fallback to empty data
  const reports = [];
  const meta = { total: 0, page: 1, pages: 0, limit: 20 };
}
```

---

## 🧪 Testing Strategy

### 1. Test Backend First
```bash
# Make sure backend is running
cd shighush_backend
npm run dev

# Test health check
curl http://localhost:4000/api/v1/health

# Test reports endpoint
curl http://localhost:4000/api/v1/reports
```

### 2. Test One Page at a Time
1. Update imports
2. Replace mock call with API call
3. Add adapters
4. Reload page
5. Check browser console for errors
6. Verify data displays correctly

### 3. Test with Real Data
- Login as admin
- Check if dashboard shows correct stats
- Create a new report
- Verify it appears in admin panel

---

## 📊 Pages to Update (Checklist)

### Public Pages:
- [ ] `/reports` - Reports listing
- [ ] `/reports/[slug]` - Report detail
- [ ] `/institutions` - Institutions listing
- [ ] `/institutions/[slug]` - Institution detail
- [ ] `/people/[slug]` - Person detail (if exists)

### Admin Pages:
- [ ] `/admin` - Dashboard overview
- [ ] `/admin/reports` - Reports queue
- [ ] `/admin/reports/[id]` - Report detail/review
- [ ] `/admin/institutions` - Institutions management
- [ ] `/admin/appeals` - Appeals queue
- [ ] `/admin/flags` - Flags queue
- [ ] `/admin/users` - Users management
- [ ] `/admin/audit-logs` - Audit logs
- [ ] `/admin/people` - People management (if exists)

### Layout Files:
- [ ] `/admin/layout.tsx` - Badge counts (appeals, flags)

---

## 🚨 Common Issues

### Issue 1: CORS Error
**Error**: `CORS policy blocked`

**Fix**: Backend `.env` এ check করুন:
```env
CLIENT_URL=http://localhost:3000
```

### Issue 2: 401 Unauthorized
**Error**: API returns 401

**Fix**: Check JWT token:
```tsx
const session = await getSession();
console.log('Token:', session?.token); // Debug
```

### Issue 3: Type Errors
**Error**: TypeScript type mismatch

**Fix**: Use adapters:
```tsx
import { adaptPublicReport } from "@/lib/api/adapters";
const report = adaptPublicReport(apiReport);
```

### Issue 4: Empty Data
**Error**: No data showing

**Fix**: Check pagination:
```tsx
// Backend returns { reports: [], pagination: {} }
// Make sure you're accessing correctly
const reports = response.reports || [];
```

---

## 🎯 Quick Migration Script

আপনি একটা script তৈরি করতে পারেন যেটা automatically সব mock imports replace করবে:

```bash
# Find all mock imports
grep -r "from '@/lib/mock/queries'" app/

# Or using PowerShell
Get-ChildItem -Recurse -Include *.tsx | Select-String "from '@/lib/mock/queries'"
```

তারপর manually একটা করে replace করুন।

---

## ✅ Verification Checklist

Migration complete হলে check করুন:

- [ ] Backend running (`npm run dev` in shighush_backend)
- [ ] MongoDB running (`mongod`)
- [ ] Database seeded (`npm run seed`)
- [ ] Frontend running (`npm run dev` in shighush)
- [ ] No console errors
- [ ] Public pages load
- [ ] Can login as admin
- [ ] Admin dashboard shows real data
- [ ] Can create new report
- [ ] New report appears in admin panel
- [ ] Can change report status
- [ ] Can view institutions
- [ ] Can view audit logs

---

## 📚 Reference Files

- `lib/api/client.ts` - Client-side API calls
- `lib/api/services.ts` - Server-side API calls
- `lib/api/adapters.ts` - Type converters
- `lib/auth/dal.ts` - Session management
- `shighush_backend/API_DOCUMENTATION.md` - API reference

---

## 🆘 Need Help?

যদি কোনো problem হয়:
1. Backend logs check করুন
2. Frontend browser console check করুন
3. Network tab এ API calls দেখুন
4. API Documentation পড়ুন

---

**Happy Migrating! 🚀**
