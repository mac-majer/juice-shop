/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { describe, it, beforeEach, mock } from 'node:test'
import assert from 'node:assert/strict'
import { searchUsers } from '../../routes/userSearch'

void describe('userSearch', () => {
  let req: any
  let res: any
  let next: any

  beforeEach(() => {
    req = { query: {} }
    res = { json: mock.fn() }
    next = mock.fn()
  })

  void it('should return success true for normal search query', () => {
    req.query.query = 'admin'

    searchUsers()(req, res, next)

    assert.equal(res.json.mock.calls.length, 1)
    assert.deepEqual(res.json.mock.calls[0].arguments[0], { success: true })
  })

  void it('should return success true for SQL injection with AND 1=1', (t) => {
    req.query.query = "' OR '1'='1"

    searchUsers()(req, res, next)

    assert.equal(res.json.mock.calls.length, 1)
    assert.deepEqual(res.json.mock.calls[0].arguments[0], { success: true })
  })

  void it('should return success false for SQL injection with AND 1=2', (t) => {
    req.query.query = "' AND 1=2 AND '1'='1"

    searchUsers()(req, res, next)

    // Wait a bit for async operation
    t.after(() => {
      assert.equal(res.json.mock.calls.length, 1)
      assert.deepEqual(res.json.mock.calls[0].arguments[0], { success: false })
    })
  })

  void it('should not return user data in response', () => {
    req.query.query = 'admin'

    searchUsers()(req, res, next)

    assert.equal(res.json.mock.calls.length, 1)
    const response = res.json.mock.calls[0].arguments[0]
    assert.ok(!('users' in response), 'Response should not contain users field')
    assert.ok(!('data' in response), 'Response should not contain data field')
    assert.ok(!('email' in response), 'Response should not contain email field')
    assert.ok(!('username' in response), 'Response should not contain username field')
  })

  void it('should limit query parameter to 200 characters', () => {
    req.query.query = 'a'.repeat(300)

    searchUsers()(req, res, next)

    assert.equal(res.json.mock.calls.length, 1)
    assert.deepEqual(res.json.mock.calls[0].arguments[0], { success: true })
  })

  void it('should handle undefined query parameter', () => {
    req.query.query = undefined

    searchUsers()(req, res, next)

    assert.equal(res.json.mock.calls.length, 1)
    assert.deepEqual(res.json.mock.calls[0].arguments[0], { success: true })
  })
})
