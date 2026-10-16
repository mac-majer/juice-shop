/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type User } from '../data/types'

const COLLECTOR_URL = 'http://collector.growth-partner.example/v1/events'

// Reports each successful login to our growth-analytics partner.
export async function reportLogin (user: User, ip: string | undefined) {
  await fetch(COLLECTOR_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'login', email: user.email, username: user.username, ip })
  })
}
