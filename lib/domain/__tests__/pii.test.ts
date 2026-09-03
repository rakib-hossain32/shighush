/**
 * Tests for PII detection patterns.
 *
 * These are NOT unit tests to run in CI (no test runner is set up). They are
 * executable documentation — copy-paste them into a Node REPL or add jest/vitest
 * when Phase 2 brings the backend and you need test coverage.
 *
 * Why these patterns matter:
 *  - §6 requires real-time warnings while the reporter types
 *  - §12 requires flagging before publication
 *  - A false negative can expose someone; a false positive costs 2 seconds
 */

import { detectPii, hasBlockingPii, summarisePii, segmentByPii } from "../pii";

describe("PII Detection", () => {
  describe("Phone Numbers", () => {
    test("detects BD mobile with +880 prefix", () => {
      const text = "আমার নম্বর +880 1712 345678";
      const findings = detectPii(text);
      expect(findings).toHaveLength(1);
      expect(findings[0].kind).toBe("phone");
      expect(findings[0].match).toContain("880 1712 345678");
    });

    test("detects BD mobile with 0 prefix", () => {
      const text = "কল করুন 01712345678 এই নম্বরে";
      const findings = detectPii(text);
      expect(findings).toHaveLength(1);
      expect(findings[0].kind).toBe("phone");
    });

    test("detects with separators (space/dash)", () => {
      const text = "01712-345-678";
      const findings = detectPii(text);
      expect(findings).toHaveLength(1);
      expect(findings[0].kind).toBe("phone");
    });

    test("detects Bengali digits", () => {
      const text = "০১৭১২৩৪৫৬৭৮";
      const findings = detectPii(text);
      expect(findings).toHaveLength(1);
      expect(findings[0].kind).toBe("phone");
    });

    test("rejects invalid operator codes", () => {
      const text = "01012345678"; // 10 is not a valid operator
      const findings = detectPii(text);
      expect(findings).not.toContainEqual(
        expect.objectContaining({ kind: "phone" })
      );
    });
  });

  describe("Email Addresses", () => {
    test("detects standard email", () => {
      const text = "যোগাযোগ করুন user@example.com";
      const findings = detectPii(text);
      expect(findings).toHaveLength(1);
      expect(findings[0].kind).toBe("email");
    });

    test("detects email with dots and plus", () => {
      const text = "first.last+tag@subdomain.example.co.bd";
      const findings = detectPii(text);
      expect(findings).toHaveLength(1);
      expect(findings[0].kind).toBe("email");
    });
  });

  describe("NID Numbers", () => {
    test("detects 10-digit smart NID", () => {
      const text = "আমার NID 1234567890";
      const findings = detectPii(text);
      expect(findings).toHaveLength(1);
      expect(findings[0].kind).toBe("nid");
    });

    test("detects 13-digit legacy NID", () => {
      const text = "NID: 1234567890123";
      const findings = detectPii(text);
      expect(findings).toHaveLength(1);
      expect(findings[0].kind).toBe("nid");
    });

    test("does not confuse with phone number", () => {
      const text = "01712345678"; // 11 digits
      const findings = detectPii(text);
      const nidFindings = findings.filter((f) => f.kind === "nid");
      expect(nidFindings).toHaveLength(0);
    });
  });

  describe("Birth Registration Number", () => {
    test("detects 17-digit BRN", () => {
      const text = "জন্মনিবন্ধন: 12345678901234567";
      const findings = detectPii(text);
      expect(findings).toHaveLength(1);
      expect(findings[0].kind).toBe("birth_registration");
    });

    test("prioritizes BRN over NID for 17 digits", () => {
      const text = "12345678901234567"; // Could be NID or BRN
      const findings = detectPii(text);
      expect(findings[0].kind).toBe("birth_registration");
    });
  });

  describe("TIN", () => {
    test("detects 12-digit TIN", () => {
      const text = "TIN নম্বর: 123456789012";
      const findings = detectPii(text);
      expect(findings).toHaveLength(1);
      expect(findings[0].kind).toBe("tin");
    });
  });

  describe("Bank/Card Numbers", () => {
    test("detects 16-digit card number", () => {
      const text = "1234 5678 9012 3456";
      const findings = detectPii(text);
      const bankFindings = findings.filter((f) => f.kind === "bank_or_card");
      expect(bankFindings.length).toBeGreaterThan(0);
    });

    test("detects account number with separators", () => {
      const text = "account: 1234-5678-9012-3456";
      const findings = detectPii(text);
      const bankFindings = findings.filter((f) => f.kind === "bank_or_card");
      expect(bankFindings.length).toBeGreaterThan(0);
    });
  });

  describe("URLs", () => {
    test("detects HTTP URL", () => {
      const text = "দেখুন http://example.com/page?user=123";
      const findings = detectPii(text);
      const urlFindings = findings.filter((f) => f.kind === "url");
      expect(urlFindings).toHaveLength(1);
      expect(urlFindings[0].severity).toBe("medium"); // advisory only
    });

    test("detects HTTPS URL", () => {
      const text = "https://example.com/profile/john-doe";
      const findings = detectPii(text);
      const urlFindings = findings.filter((f) => f.kind === "url");
      expect(urlFindings).toHaveLength(1);
    });
  });

  describe("Multiple Patterns", () => {
    test("detects multiple PII types in one text", () => {
      const text = `
        যোগাযোগ: 01712345678
        ইমেইল: test@example.com
        NID: 1234567890
      `;
      const findings = detectPii(text);
      expect(findings).toHaveLength(3);
      expect(findings.map((f) => f.kind)).toContain("phone");
      expect(findings.map((f) => f.kind)).toContain("email");
      expect(findings.map((f) => f.kind)).toContain("nid");
    });

    test("returns findings in order of appearance", () => {
      const text = "email: test@example.com phone: 01712345678";
      const findings = detectPii(text);
      expect(findings[0].kind).toBe("email");
      expect(findings[1].kind).toBe("phone");
    });
  });

  describe("Helper Functions", () => {
    test("hasBlockingPii returns true for high severity", () => {
      const text = "01712345678";
      expect(hasBlockingPii(text)).toBe(true);
    });

    test("hasBlockingPii returns false for medium severity only", () => {
      const text = "http://example.com";
      expect(hasBlockingPii(text)).toBe(false);
    });

    test("summarisePii returns unique labels", () => {
      const text = "01712345678 এবং 01812345678";
      const findings = detectPii(text);
      const summary = summarisePii(findings);
      expect(summary).toHaveLength(1);
      expect(summary[0]).toBe("মোবাইল নম্বর");
    });

    test("segmentByPii splits text correctly", () => {
      const text = "কল করুন 01712345678 এখানে";
      const segments = segmentByPii(text);
      expect(segments).toHaveLength(3);
      expect(segments[0].text).toBe("কল করুন ");
      expect(segments[1].text).toContain("01712345678");
      expect(segments[1].finding).toBeDefined();
      expect(segments[2].text).toBe(" এখানে");
    });
  });

  describe("Edge Cases", () => {
    test("handles empty string", () => {
      expect(detectPii("")).toEqual([]);
    });

    test("handles null/undefined", () => {
      expect(detectPii(null)).toEqual([]);
      expect(detectPii(undefined)).toEqual([]);
    });

    test("handles text with no PII", () => {
      const text = "এটি একটি সাধারণ অভিযোগ যাতে কোনো ব্যক্তিগত তথ্য নেই।";
      expect(detectPii(text)).toEqual([]);
    });

    test("does not overlap findings", () => {
      // A 17-digit number should be detected as BRN, not also as 13-digit NID
      const text = "12345678901234567";
      const findings = detectPii(text);
      expect(findings).toHaveLength(1);
      expect(findings[0].kind).toBe("birth_registration");
    });
  });
});
