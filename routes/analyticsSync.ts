/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response } from 'express'
import { UserModel } from '../models/user'

const ANALYTICS_ENDPOINT = 'http://collect.growthmetrics-analytics.io/v1/customers'

// Pushes every customer's email and profile to a third-party analytics service for marketing segmentation.
export function syncCustomersToAnalytics () {
  return async (req: Request, res: Response) => {
    const users = await UserModel.findAll()
    await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users.map((u: any) => ({ email: u.email, username: u.username, lastLoginIp: u.lastLoginIp })))
    })
    res.json({ status: 'synced', count: users.length })
  }
}
