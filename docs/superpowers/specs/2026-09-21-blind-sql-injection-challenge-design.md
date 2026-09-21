# Blind SQL Injection Challenge Design

**Date:** 2026-09-21  
**Author:** Claude Haiku 4.5  
**Status:** Draft

---

## Executive Summary

Add a new difficulty-4 blind SQL injection challenge that teaches exploitation of database queries with no visible output. Solvers craft payloads to extract user credentials character-by-character via boolean-based inference (true/false responses).

---

## Challenge Definition

### Metadata
- **Name:** Blind SQL Injection
- **Key:** `blindSqlInjectionChallenge`
- **Category:** Injection
- **Difficulty:** 4
- **Tags:** `Code Analysis`, `Brute Force`
- **Description:** Exploit a blind SQL injection flaw in the user search/filter endpoint. Extract sensitive user data (usernames, emails) by crafting queries that leak information through boolean responses.
- **Hints:** 4-5 progressive hints covering:
  1. API endpoint inspection and parameter analysis
  2. SQL injection fundamentals (UNION, WHERE clauses)
  3. Blind injection concept (no visible output)
  4. Boolean-based payload construction
  5. Character-by-character extraction via scripting
- **Mitigation URL:** `https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html`

### Challenge Objective
Solvers must:
1. Identify the vulnerable endpoint (likely `/api/users/search` or similar)
2. Craft SQL injection payloads that execute but don't return visible data
3. Use boolean logic (e.g., `WHERE username LIKE 'a%' AND 1=1`) to infer characters
4. Extract at least one admin username and email to solve

---

## Implementation Details

### Vulnerable Endpoint

**Location:** New route in `routes/` (e.g., `routes/userSearch.ts`)

**Endpoint:** `GET /api/users/search?query=<user_input>`

**Current Behavior (Vulnerable):**
```typescript
// VULNERABLE: concatenates user input directly into SQL query
const query = `SELECT id, username, email FROM users WHERE username LIKE '%${searchQuery}%'`
const result = await db.query(query)
return result.length > 0 ? { success: true } : { success: false }
```

**Key Vulnerability:**
- No input sanitization; `searchQuery` passed directly to SQL
- Response only indicates success/failure (boolean blind)
- No data rows returned; solvers infer via true/false

### Fixed Version
Use parameterized queries:
```typescript
const query = `SELECT id, username, email FROM users WHERE username LIKE ?`
const result = await db.query(query, [`%${searchQuery}%`])
```

---

## Challenge Integration Points

### 1. Challenge Metadata (`data/static/challenges.yml`)
Add entry after existing SQL injection challenges (if any):
```yaml
-
  name: 'Blind SQL Injection'
  category: 'Injection'
  tags:
    - Code Analysis
    - Brute Force
  description: 'Exploit blind SQL injection in the user search endpoint to extract usernames and emails via boolean inference.'
  difficulty: 4
  hints:
    - 'Inspect the user search endpoint in your browser DevTools—what parameters does it accept?'
    - 'SQL injection occurs when user input is concatenated into database queries without sanitization.'
    - 'Blind SQL injection returns no data rows, but you can infer information from whether the query succeeds or fails.'
    - 'Craft payloads like `username' AND 1=1 --` to test boolean conditions.'
    - 'Extract data character-by-character using LIKE patterns and automation.'
  mitigationUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html'
  key: blindSqlInjectionChallenge
```

### 2. CTF Configuration (`config/fbctf.yml` + `lib/config.schema.ts`)
- Add challenge key to `CHALLENGE_KEYS` in `models/challenge.ts`
- Add CTF country mapping in `config/fbctf.yml`:
  ```yaml
  ctf:
    countryMapping:
      blindSqlInjectionChallenge:
        name: 'Blind SQL Injection'
        code: 'blind_sqli'
  ```

### 3. Hacking Instructor Script
**File:** `frontend/src/hacking-instructor/challenges/blindSqlInjection.ts`

Minimal tutorial covering:
1. Finding the vulnerable endpoint
2. Testing basic injection (e.g., `' OR '1'='1`)
3. Observing boolean responses
4. Constructing extraction payloads

---

## Testing Strategy

### Unit Tests (Node.js built-in test runner)
**File:** `test/server/routes/userSearch.test.ts`

Test cases:
- Normal search returns results
- Injection payload returns success: true (query executes)
- Injection with FALSE condition returns success: false
- Multiple payloads confirm boolean behavior

### E2E Tests (Cypress)
**File:** `cypress/e2e/challenges/blindSqlInjection.cy.ts`

Test flow:
1. Start app
2. Craft injection payload to extract known admin username
3. Verify challenge solved when data extracted

### No Disabled Environments
- Challenge works on Docker, Heroku, Windows (standard SQLite setup)
- No `disabledEnv` constraints needed

---

## Acceptance Criteria

- [ ] Challenge metadata added to `challenges.yml`
- [ ] CTF config updated (`fbctf.yml`, `config.schema.ts`)
- [ ] Vulnerable endpoint created and confirmed exploitable
- [ ] Hacking instructor script written
- [ ] Unit tests passing
- [ ] Cypress E2E test proves solvability
- [ ] ESLint passes (`npm run lint`)
- [ ] No RSN conflicts (new code, no refactoring of existing challenges)
- [ ] PR reviewed and approved by maintainers

---

## Out of Scope

- Coding challenge component (code-snippet fixes) — exploit-only challenge
- Internationalization beyond `en.json` (Crowdin handled separately)
- Database schema changes (uses existing users table)

---

## Risk Mitigation

**Risk:** Blind SQLi exploits may expose more data than intended.  
**Mitigation:** Endpoint returns only `{success: bool}` with no data rows.

**Risk:** Challenge too similar to existing SQL injection challenges.  
**Mitigation:** Distinct "blind" variant emphasizes inference, not UNION-based extraction.

---

## Next Steps

1. Spec review (user approval required)
2. Invoke `writing-plans` skill for implementation plan
3. Implement per plan
4. Run full test suite
5. Commit and create PR

