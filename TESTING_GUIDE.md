# Testing Guide - শিঘুষ Frontend

এই guide টি frontend manually test করার জন্য। Phase 2 এ automated tests যোগ করা হবে।

## Prerequisites

```bash
cd shighush
npm install
npm run dev
```

Server চলবে: `http://localhost:3000`

---

## 1. Form Validation Testing (Report Submission)

### URL: `/report/new`

#### Test Case 1.1: Required Fields
**Steps:**
1. Form টি খালি রেখে "Submit" button click করুন
2. Check করুন সব required fields এ error message দেখাচ্ছে কিনা

**Expected:**
- ✅ "প্রতিষ্ঠান বা দফতরের নাম লিখুন"
- ✅ "অভিযোগের ধরন বেছে নিন"
- ✅ "ঘটনার এলাকা বেছে নিন"
- ✅ "ঘটনার তারিখ বা আনুমানিক সময় দিন"
- ✅ "ঘটনাটি অন্তত ৪০ অক্ষরে লিখুন"
- ✅ "তথ্যের সত্যতা নিশ্চিত করুন"
- ✅ "প্রকাশ ও গোপনীয়তা নীতি মেনে নিন"

#### Test Case 1.2: Narrative Length
**Steps:**
1. Narrative field এ "ছোট" লিখুন (10 অক্ষর)
2. Submit করুন

**Expected:**
- ✅ Error: "ঘটনাটি অন্তত ৪০ অক্ষরে লিখুন"

#### Test Case 1.3: Future Date Rejection
**Steps:**
1. Incident Date এ আগামীকালের তারিখ দিন
2. Submit করুন

**Expected:**
- ✅ Error: "ভবিষ্যতের তারিখ দেওয়া যাবে না"

#### Test Case 1.4: Money Without Type
**Steps:**
1. Valid form fill করুন
2. "অতিরিক্ত তথ্য যোগ করুন" click করুন
3. "টাকা-সংক্রান্ত তথ্য যোগ করুন" click করুন
4. Money Amount: "5000" দিন
5. Money Type: "জানি না" রাখুন
6. Submit করুন

**Expected:**
- ✅ Error: "টাকা চাওয়া হয়েছে না দেওয়া হয়েছে, তা বেছে নিন"

#### Test Case 1.5: Name Without Designation
**Steps:**
1. Valid form fill করুন
2. "অভিযুক্ত ব্যক্তি যোগ করুন" click করুন
3. Name: "মোঃ করিম" দিন
4. Designation: খালি রাখুন
5. Submit করুন

**Expected:**
- ✅ Error: "নাম দিলে পদবি বা দফতরও লিখুন"

---

## 2. PII Detection Testing

### URL: `/report/new`

#### Test Case 2.1: Phone Number Detection
**Steps:**
1. Narrative field এ type করুন: "আমার নম্বর 01712345678"
2. Check করুন warning দেখাচ্ছে কিনা

**Expected:**
- ✅ Red warning box appear করবে
- ✅ "মোবাইল নম্বর শনাক্ত হয়েছে"
- ✅ Show করবে: "মোবাইল নম্বর: 01712345678"

#### Test Case 2.2: Email Detection
**Steps:**
1. Narrative field এ type করুন: "যোগাযোগ করুন test@example.com"

**Expected:**
- ✅ Warning: "ইমেইল ঠিকানা: test@example.com"

#### Test Case 2.3: NID Detection
**Steps:**
1. Type করুন: "আমার NID 1234567890" (10 digits)

**Expected:**
- ✅ Warning: "জাতীয় পরিচয়পত্র (NID) নম্বর: 1234567890"

#### Test Case 2.4: Multiple PII
**Steps:**
1. Type করুন: "আমার নম্বর 01712345678 এবং ইমেইল test@example.com"

**Expected:**
- ✅ দুটি separate findings দেখাবে
- ✅ "মোবাইল নম্বর: 01712345678"
- ✅ "ইমেইল ঠিকানা: test@example.com"

#### Test Case 2.5: Bengali Digits Detection
**Steps:**
1. Type করুন: "০১৭১২৩৪৫৬৭৮"

**Expected:**
- ✅ Phone number হিসেবে detect করবে
- ✅ Warning দেখাবে

#### Test Case 2.6: URL Detection (Medium Severity)
**Steps:**
1. Type করুন: "দেখুন http://example.com/page"

**Expected:**
- ✅ Warning: "লিংক — এতে পরিচয় শনাক্তকারী তথ্য থাকতে পারে"
- ✅ Form submit block করবে না (medium severity)

#### Test Case 2.7: No False Positives
**Steps:**
1. Type করুন: "এটি একটি সাধারণ অভিযোগ যাতে কোনো ব্যক্তিগত তথ্য নেই।"

**Expected:**
- ✅ কোনো warning দেখাবে না

---

## 3. Checkbox Validation

### URL: `/report/new`

#### Test Case 3.1: Truth Acknowledgement Required
**Steps:**
1. সব field fill করুন
2. "তথ্যের সত্যতা" checkbox unchecked রাখুন
3. "প্রকাশ ও গোপনীয়তা নীতি" check করুন
4. Submit করুন

**Expected:**
- ✅ Error: "তথ্যের সত্যতা নিশ্চিত করুন"

#### Test Case 3.2: Policy Acknowledgement Required
**Steps:**
1. সব field fill করুন
2. "তথ্যের সত্যতা" check করুন
3. "প্রকাশ ও গোপনীয়তা নীতি" unchecked রাখুন
4. Submit করুন

**Expected:**
- ✅ Error: "প্রকাশ ও গোপনীয়তা নীতি মেনে নিন"

---

## 4. Progressive Disclosure

### URL: `/report/new`

#### Test Case 4.1: Optional Fields Hidden by Default
**Steps:**
1. Form load করুন

**Expected:**
- ✅ Money fields দেখাবে না
- ✅ Accused person fields দেখাবে না
- ✅ "অতিরিক্ত তথ্য যোগ করুন" button দেখাবে

#### Test Case 4.2: Show Optional Fields
**Steps:**
1. "অতিরিক্ত তথ্য যোগ করুন" click করুন

**Expected:**
- ✅ Button hide হবে
- ✅ "টাকা-সংক্রান্ত তথ্য যোগ করুন" button দেখাবে
- ✅ "অভিযুক্ত ব্যক্তি যোগ করুন" button দেখাবে

#### Test Case 4.3: Money Section Toggle
**Steps:**
1. "টাকা-সংক্রান্ত তথ্য যোগ করুন" click করুন

**Expected:**
- ✅ Money Amount, Money Type, Official Fee fields দেখাবে
- ✅ Border সহ highlighted section হবে

---

## 5. Select Component Integration

### URL: `/report/new`

#### Test Case 5.1: Category Select
**Steps:**
1. "অভিযোগের ধরন" dropdown click করুন

**Expected:**
- ✅ সব categories দেখাবে (ঘুষ, চাঁদাবাজি, etc.)
- ✅ একটি select করলে form state update হবে

#### Test Case 5.2: Area Select
**Steps:**
1. "ঘটনার এলাকা" dropdown click করুন

**Expected:**
- ✅ All unions দেখাবে (Bengali names)
- ✅ Select করা যাবে

#### Test Case 5.3: Date Precision Select
**Steps:**
1. Date precision dropdown check করুন

**Expected:**
- ✅ Default: "নির্দিষ্ট তারিখ"
- ✅ Options: নির্দিষ্ট, আনুমানিক, মাস, বছর

#### Test Case 5.4: Money Type Select
**Steps:**
1. Money section open করুন
2. Money Type dropdown check করুন

**Expected:**
- ✅ Default: "জানি না"
- ✅ Options: চাওয়া হয়েছে, দেওয়া হয়েছে, জানি না

---

## 6. Responsive Design

### Test Case 6.1: Mobile View (< 640px)
**Steps:**
1. Browser window 375px width করুন
2. Form navigate করুন

**Expected:**
- ✅ Single column layout
- ✅ Buttons full width
- ✅ Text readable
- ✅ No horizontal scroll

### Test Case 6.2: Tablet View (640px - 1024px)
**Steps:**
1. Browser window 768px width করুন

**Expected:**
- ✅ Category/Area fields side by side
- ✅ Proper spacing maintained

### Test Case 6.3: Desktop View (> 1024px)
**Steps:**
1. Browser window 1280px+ width করুন

**Expected:**
- ✅ Max width constraint (centered)
- ✅ Optimal reading width

---

## 7. Loading and Error States

### Test Case 7.1: Form Submission Loading
**Steps:**
1. Valid form fill করুন
2. Submit button click করুন

**Expected:**
- ✅ Button disable হবে
- ✅ Loading spinner দেখাবে
- ✅ "জমা হচ্ছে..." text দেখাবে

### Test Case 7.2: Page Loading State
**Steps:**
1. `/report/new` navigate করুন
2. Network tab এ "Slow 3G" enable করুন
3. Page reload করুন

**Expected:**
- ✅ Loading skeleton দেখাবে (if loading.tsx exists)

---

## 8. Accessibility Testing

### Test Case 8.1: Keyboard Navigation
**Steps:**
1. Tab key দিয়ে navigate করুন

**Expected:**
- ✅ সব fields focus হয়
- ✅ Focus indicator visible
- ✅ Tab order logical

### Test Case 8.2: Labels
**Steps:**
1. Inspect each input field

**Expected:**
- ✅ প্রতিটি input এর label আছে
- ✅ aria-invalid error state এ set হয়

### Test Case 8.3: Error Messages
**Steps:**
1. Form submit করুন with errors
2. Check accessibility tree

**Expected:**
- ✅ Error messages associated with inputs
- ✅ Screen reader announce করতে পারবে

---

## 9. Mock Submission

### URL: `/report/new`

#### Test Case 9.1: Valid Form Submission
**Steps:**
1. সব required fields properly fill করুন
2. Both checkboxes check করুন
3. Submit করুন

**Expected:**
- ✅ Console এ log দেখাবে: "Submitting report: {...}"
- ✅ Alert দেখাবে: "Mock submission - connect to API in Phase 2"
- ✅ Form clear হবে না (mock behavior)

---

## 10. Edge Cases

### Test Case 10.1: Very Long Text
**Steps:**
1. Narrative এ 5001 characters paste করুন

**Expected:**
- ✅ Error: "বিবরণটি ৫০০০ অক্ষরের মধ্যে রাখুন"

### Test Case 10.2: Special Characters
**Steps:**
1. Narrative এ special characters দিন: `<script>alert('xss')</script>`

**Expected:**
- ✅ Text হিসেবে treat হবে (no script execution)
- ✅ PII detection safe থাকবে

### Test Case 10.3: Empty Spaces
**Steps:**
1. Institution Name: "   " (শুধু spaces)
2. Submit করুন

**Expected:**
- ✅ Trim হবে, error দেখাবে

---

## Browser Compatibility Testing

Test করুন:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

---

## Performance Checks

1. **PII Detection Performance:**
   - Type করার সময় lag হচ্ছে কিনা
   - 2000+ character narrative এ smooth কিনা

2. **Form State:**
   - Re-renders excessive কিনা
   - Select component responsive কিনা

---

## Next Steps (Phase 2)

এই tests গুলো automated করতে হবে:
- [ ] Jest/Vitest setup
- [ ] React Testing Library integration
- [ ] E2E tests with Playwright/Cypress
- [ ] Visual regression tests

---

## Bug Reporting

যদি কোনো test fail করে, report করুন:
1. Test case number
2. Browser/device
3. Screenshot
4. Console errors
5. Expected vs Actual behavior
