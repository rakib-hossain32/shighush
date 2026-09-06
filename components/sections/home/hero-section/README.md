# Hero Section - Modular Architecture

## 📁 File Structure

```
hero-section/
├── index.tsx                  # Main component (orchestrator)
├── types.ts                   # TypeScript types & interfaces
├── use-hero-data.ts          # Custom hook for data fetching
├── hero-header.tsx           # Top section (headline, CTA, badges)
├── dashboard-tabs.tsx        # Tab navigation component
├── latest-reports-tab.tsx    # Latest reports view
├── categories-tab.tsx        # Categories statistics view
├── hotspots-tab.tsx          # Area hotspots view
└── README.md                 # This file
```

## 🎯 Component Breakdown

### 1. **index.tsx** (Main Orchestrator)
- Manages tab state
- Coordinates all sub-components
- Handles layout and structure

### 2. **types.ts** (Type Definitions)
- `CategoryStat`: Category statistics interface
- `AreaHotspot`: Area hotspot interface
- `TabType`: Tab union type
- `HeroData`: Complete hero data interface

### 3. **use-hero-data.ts** (Data Hook)
- Fetches latest reports from API
- Fetches statistics from API
- Processes and transforms data
- Manages loading state
- Error handling

### 4. **hero-header.tsx** (Header Section)
- Location badge with live indicator
- Main headline with highlighted text
- Subtitle description
- Primary and secondary CTAs
- Trust badges (security, verification, monitoring)

### 5. **dashboard-tabs.tsx** (Tab Navigation)
- Reusable tab component
- Active state management
- Icon + label for each tab

### 6. **latest-reports-tab.tsx** (Reports View)
- Featured report display
- Report list with selection
- Empty states
- Date formatting

### 7. **categories-tab.tsx** (Categories View)
- Category cards with statistics
- Progress bars
- Status indicators
- Empty state

### 8. **hotspots-tab.tsx** (Hotspots View)
- Dark themed section
- Area-based statistics
- Percentage-based progress bars
- Empty state

## 🎨 Design System

### Colors (from globals.css)
- `--background`: #f7f3e9 (cream)
- `--foreground`: #10221e (dark green)
- `--primary`: #e95132 (coral red)
- `--secondary`: #a9d86e (lime green)
- `--muted`: #ece3ce (light beige)
- `--destructive`: #b3231b (dark red)

### Typography
- Headlines: `display` class (Bangla font)
- Body: Default sans-serif
- Mono: Font mono for IDs

### Shadows
Neo-brutalist style: `shadow-[Xpx_Xpx_0_0_hsl(var(--foreground))]`

## 🔌 API Integration

### Endpoints Used:
1. **GET /api/v1/reports**
   - Params: `{ limit: 3, status: 'published' }`
   - Returns: Latest published reports

2. **GET /api/v1/statistics**
   - Returns: Category and area statistics
   - Processed for display

### Data Flow:
```
useHeroData() 
  → API calls (getReports, getStatistics)
  → Data transformation
  → State updates
  → Component re-render
```

## 🚀 Usage

```tsx
import { HeroSection } from "@/components/sections/home/hero-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      {/* Other sections */}
    </main>
  );
}
```

## 🧪 Testing Checklist

- [ ] API calls work correctly
- [ ] Loading states display properly
- [ ] Empty states show when no data
- [ ] Tab switching works smoothly
- [ ] Report selection updates featured view
- [ ] Mobile responsive (all breakpoints)
- [ ] Colors match design system
- [ ] Bangla text renders correctly
- [ ] Links navigate properly
- [ ] Animations are smooth

## 🔧 Maintenance

### Adding a New Tab:
1. Update `TabType` in `types.ts`
2. Create new tab component (e.g., `new-tab.tsx`)
3. Add tab config in `dashboard-tabs.tsx`
4. Import and render in `index.tsx`

### Modifying Data Structure:
1. Update interfaces in `types.ts`
2. Modify data transformation in `use-hero-data.ts`
3. Update component props if needed

### Styling Changes:
- Use Tailwind utilities
- Reference CSS variables from `globals.css`
- Maintain neo-brutalist shadow patterns

## 📊 Performance

- **Client-side rendering**: Uses `"use client"` directive
- **Data fetching**: Single useEffect on mount
- **Re-renders**: Optimized with proper state management
- **Bundle size**: Modular imports reduce overhead

## ♿ Accessibility

- Semantic HTML elements
- Proper heading hierarchy
- Interactive elements are keyboard accessible
- ARIA labels where needed
- Color contrast meets WCAG standards

## 🐛 Common Issues

### API Not Found
- Ensure backend is running
- Check `API_BASE_URL` in `.env.local`
- Verify statistics endpoint exists

### Empty Data
- Check backend has seeded data
- Verify API response format
- Check console for errors

### Styling Issues
- Verify `globals.css` is imported
- Check Tailwind config
- Ensure CSS variables are defined
