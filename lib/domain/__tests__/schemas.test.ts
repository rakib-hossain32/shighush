/**
 * Tests for Zod validation schemas.
 *
 * These document the validation rules and edge cases. They serve as executable
 * specification — when you read §6 of WEBSITE_DOCUMENTATION_BN.md, these tests
 * confirm "this is actually what we enforce".
 *
 * To run: add jest or vitest in Phase 2 backend setup.
 */

import { reportSubmitSchema } from "../schemas";

describe("Report Submit Schema", () => {
  const validBase = {
    institutionName: "উপজেলা ভূমি অফিস",
    category: "bribery" as const,
    area: "shibchar",
    incidentDate: "2024-01-15",
    incidentDatePrecision: "exact" as const,
    narrative: "একটি বিস্তারিত বিবরণ যা ন্যূনতম চল্লিশ অক্ষরের বেশি দীর্ঘ।",
    truthAcknowledged: true as const,
    policyAcknowledged: true as const,
  };

  describe("Required Fields", () => {
    test("accepts valid minimal report", () => {
      const result = reportSubmitSchema.safeParse(validBase);
      expect(result.success).toBe(true);
    });

    test("rejects missing institutionName", () => {
      const data = { ...validBase, institutionName: "" };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("institutionName");
      }
    });

    test("rejects missing category", () => {
      const data = { ...validBase };
      delete (data as any).category;
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    test("rejects missing area", () => {
      const data = { ...validBase };
      delete (data as any).area;
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    test("rejects missing incidentDate", () => {
      const data = { ...validBase, incidentDate: "" };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    test("rejects short narrative", () => {
      const data = { ...validBase, narrative: "খুব ছোট" };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("৪০ অক্ষর");
      }
    });

    test("rejects very long narrative", () => {
      const data = { ...validBase, narrative: "অ".repeat(5001) };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("৫০০০");
      }
    });
  });

  describe("Consent Checkboxes", () => {
    test("requires truthAcknowledged to be true", () => {
      const data = { ...validBase, truthAcknowledged: false };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("সত্যতা");
      }
    });

    test("requires policyAcknowledged to be true", () => {
      const data = { ...validBase, policyAcknowledged: false };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("নীতি");
      }
    });

    test("cannot pass with undefined checkboxes", () => {
      const data = { ...validBase };
      delete (data as any).truthAcknowledged;
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Date Validation", () => {
    test("accepts valid past date", () => {
      const data = { ...validBase, incidentDate: "2023-12-01" };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test("rejects future date", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const data = {
        ...validBase,
        incidentDate: futureDate.toISOString().split("T")[0],
      };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("ভবিষ্যত");
      }
    });

    test("rejects invalid date format", () => {
      const data = { ...validBase, incidentDate: "not-a-date" };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    test("accepts all date precision values", () => {
      const precisions = ["exact", "approximate", "month_only", "year_only"] as const;
      precisions.forEach((precision) => {
        const data = { ...validBase, incidentDatePrecision: precision };
        const result = reportSubmitSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Optional Money Fields", () => {
    test("accepts report with money amount and type", () => {
      const data = {
        ...validBase,
        moneyAmount: 5000,
        moneyType: "requested" as const,
      };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test("rejects amount without type", () => {
      const data = {
        ...validBase,
        moneyAmount: 5000,
        moneyType: "unknown" as const,
      };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path.includes("moneyType"));
        expect(issue?.message).toContain("চাওয়া হয়েছে না দেওয়া হয়েছে");
      }
    });

    test("accepts official fee alone", () => {
      const data = { ...validBase, officialFee: 1150 };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test("rejects negative amount", () => {
      const data = {
        ...validBase,
        moneyAmount: -500,
        moneyType: "paid" as const,
      };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("ঋণাত্মক");
      }
    });

    test("rejects unrealistically large amount", () => {
      const data = {
        ...validBase,
        moneyAmount: 200_000_000,
        moneyType: "requested" as const,
      };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("অস্বাভাবিক");
      }
    });
  });

  describe("Optional Accused Person Fields", () => {
    test("accepts accused name with designation", () => {
      const data = {
        ...validBase,
        accusedName: "মোঃ করিম",
        accusedDesignation: "সহকারী কমিশনার (ভূমি)",
      };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test("accepts designation without name", () => {
      const data = {
        ...validBase,
        accusedDesignation: "সহকারী কমিশনার (ভূমি)",
      };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test("rejects name without designation (§7)", () => {
      const data = {
        ...validBase,
        accusedName: "মোঃ করিম",
      };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) =>
          i.path.includes("accusedDesignation")
        );
        expect(issue?.message).toContain("পদবি");
      }
    });
  });

  describe("Honeypot Field", () => {
    test("accepts empty contactReason (normal submission)", () => {
      const data = { ...validBase, contactReason: "" };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test("rejects non-empty contactReason (bot detection)", () => {
      const data = { ...validBase, contactReason: "I want to contact" };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("প্রক্রিয়া করা যায়নি");
      }
    });
  });

  describe("Optional Fields Trimming", () => {
    test("trims whitespace from institutionName", () => {
      const data = { ...validBase, institutionName: "  ভূমি অফিস  " };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.institutionName).toBe("ভূমি অফিস");
      }
    });

    test("trims whitespace from narrative", () => {
      const data = {
        ...validBase,
        narrative: "  একটি বিস্তারিত বিবরণ যা ন্যূনতম চল্লিশ অক্ষরের বেশি দীর্ঘ।  ",
      };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.narrative).not.toMatch(/^\s|\s$/);
      }
    });
  });

  describe("Category Enum", () => {
    test("accepts all valid categories", () => {
      const categories = [
        "bribery",
        "extortion",
        "service_denial",
        "harassment",
        "abuse_of_power",
        "procurement_irregularity",
        "fraud",
        "other",
      ];

      categories.forEach((category) => {
        const data = { ...validBase, category };
        const result = reportSubmitSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    test("rejects invalid category", () => {
      const data = { ...validBase, category: "invalid_category" };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Full Valid Report", () => {
    test("accepts complete report with all optional fields", () => {
      const data = {
        ...validBase,
        officeName: "নামজারি শাখা",
        moneyAmount: 2500,
        moneyType: "requested" as const,
        officialFee: 1150,
        accusedName: "মোঃ করিম",
        accusedDesignation: "সহকারী কমিশনার (ভূমি)",
        serviceName: "নামজারি",
        referenceNumber: "NJ-2024-001",
        enableAnonymousInbox: true,
        contactReason: "",
      };
      const result = reportSubmitSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
