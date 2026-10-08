import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAllowedGoogleStudent, normalizeStudentEmail } from "../lib/google-auth.ts";
import { isValidUsn } from "../lib/student.ts";

describe("Google student account validation", () => {
  it("normalizes email addresses", () => {
    assert.equal(normalizeStudentEmail("  Student.Name@NMIT.AC.IN  "), "student.name@nmit.ac.in");
    assert.equal(normalizeStudentEmail(null), "");
  });

  it("accepts only verified NMIT Google accounts", () => {
    assert.equal(isAllowedGoogleStudent("student@nmit.ac.in", true), true);
    assert.equal(isAllowedGoogleStudent("student@nmit.ac.in", false), false);
    assert.equal(isAllowedGoogleStudent("student@gmail.com", true), false);
    assert.equal(isAllowedGoogleStudent("student@nmit.ac.in.attacker.test", true), false);
    assert.equal(isAllowedGoogleStudent("student@@nmit.ac.in", true), false);
    assert.equal(isAllowedGoogleStudent(`${"a".repeat(245)}@nmit.ac.in`, true), false);
  });
});

describe("student USN validation", () => {
  it("accepts the expected format", () => {
    assert.equal(isValidUsn("NB25ISE111"), true);
  });

  it("rejects malformed and short identifiers", () => {
    assert.equal(isValidUsn("NB25ISE11"), false);
    assert.equal(isValidUsn("NB25ISE111!"), false);
    assert.equal(isValidUsn("NB2AISE111"), false);
  });
});
