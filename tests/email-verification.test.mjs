import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createVerificationToken,
  escapeHtml,
  getVerificationUrl,
  hashVerificationToken,
  isValidStudentEmail,
  isValidVerificationToken,
  isVerificationExpired,
  normalizeStudentEmail,
  VERIFICATION_TOKEN_TTL_MS,
} from "../lib/email-verification.ts";
import { isValidUsn } from "../lib/student.ts";

describe("student email validation", () => {
  it("normalizes whitespace and case", () => {
    assert.equal(normalizeStudentEmail("  Student.Name@NMIT.AC.IN  "), "student.name@nmit.ac.in");
  });

  it("accepts only the required nmit.ac.in domain", () => {
    assert.equal(isValidStudentEmail("student@nmit.ac.in"), true);
    assert.equal(isValidStudentEmail("student+campus@nmit.ac.in"), true);
    assert.equal(isValidStudentEmail("student@gmail.com"), false);
    assert.equal(isValidStudentEmail("student@nmit.ac.in.attacker.test"), false);
    assert.equal(isValidStudentEmail("student@nmitx ac.in"), false);
    assert.equal(isValidStudentEmail("student@@nmit.ac.in"), false);
    assert.equal(isValidStudentEmail(`${"a".repeat(245)}@nmit.ac.in`), false);
  });
});

describe("student USN validation", () => {
  it("accepts the expected format case-insensitively after normalization", () => {
    assert.equal(isValidUsn("NB25ISE111"), true);
    assert.equal(isValidUsn("nb25ise111".toUpperCase()), true);
  });

  it("rejects malformed and short identifiers", () => {
    assert.equal(isValidUsn("NB25ISE11"), false);
    assert.equal(isValidUsn("NB25ISE111!"), false);
    assert.equal(isValidUsn("NB2AISE111"), false);
  });
});

describe("verification token handling", () => {
  it("creates a high-entropy URL-safe token and stores a SHA-256 digest", () => {
    const first = createVerificationToken();
    const second = createVerificationToken();

    assert.match(first.token, /^[a-f0-9]{64}$/);
    assert.match(first.tokenHash, /^[a-f0-9]{64}$/);
    assert.notEqual(first.token, second.token);
    assert.notEqual(first.tokenHash, first.token);
    assert.equal(hashVerificationToken(first.token), first.tokenHash);
  });

  it("accepts only 64-character hexadecimal tokens", () => {
    assert.equal(isValidVerificationToken("a".repeat(64)), true);
    assert.equal(isValidVerificationToken("z".repeat(64)), false);
    assert.equal(isValidVerificationToken("a".repeat(63)), false);
    assert.equal(isValidVerificationToken(null), false);
  });

  it("uses a one-hour expiration window", () => {
    assert.equal(VERIFICATION_TOKEN_TTL_MS, 60 * 60 * 1000);
  });

  it("treats a token as expired at the exact deadline", () => {
    const now = new Date("2026-10-08T12:00:00.000Z");
    assert.equal(isVerificationExpired(new Date(now.getTime() - 1), now), true);
    assert.equal(isVerificationExpired(now, now), true);
    assert.equal(isVerificationExpired(new Date(now.getTime() + 1), now), false);
  });

  it("escapes account names before including them in email HTML", () => {
    assert.equal(escapeHtml(`<script>&"'`), "&lt;script&gt;&amp;&quot;&#39;");
  });

  it("only permits HTTPS verification URLs outside local development", () => {
    const url = getVerificationUrl("https://market.example", "a".repeat(64));
    assert.equal(url.origin, "https://market.example");
    assert.equal(url.pathname, "/api/verify-email");
    assert.equal(url.searchParams.get("token"), "a".repeat(64));
    assert.throws(() => getVerificationUrl("http://market.example", "a".repeat(64)));
    assert.throws(() => getVerificationUrl("https://user:pass@market.example", "a".repeat(64)));
    assert.equal(getVerificationUrl("http://localhost:3000", "a".repeat(64)).origin, "http://localhost:3000");
  });
});
