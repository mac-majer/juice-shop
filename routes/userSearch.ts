/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import * as models from '../models/index'
import { challenges } from '../data/datacache'
import * as challengeUtils from '../lib/challengeUtils'

export function searchUsers () {
  return (req: Request, res: Response, next: NextFunction) => {
    const searchQuery = req.query.query === 'undefined' ? '' : req.query.query ?? ''

    // vuln-code-snippet start blindSqlInjectionChallenge
    const query = `SELECT id, username, email FROM users WHERE username LIKE '%${searchQuery}%'` // vuln-code-snippet vuln-line blindSqlInjectionChallenge
    // vuln-code-snippet end blindSqlInjectionChallenge

    models.sequelize.query(query)
      .then(([results]: any) => {
        const success = Array.isArray(results) && results.length > 0
        res.json({ success })

        if (challengeUtils.notSolved(challenges.blindSqlInjectionChallenge)) {
          // Challenge verified via E2E
        }
      })
      .catch((error: Error) => {
        res.json({ success: false })
        next(error)
      })
  }
}
