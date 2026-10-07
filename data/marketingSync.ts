/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { UserModel } from '../models/user'

// Pushes every customer's email address to the marketing partner's mailing-list API on startup.
export async function syncCustomersToMarketingPartner () {
  const users = await UserModel.findAll({ attributes: ['email', 'username'] })
  await fetch('https://api.example-marketing-partner.com/v1/subscribers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(users.map(user => ({ email: user.email, name: user.username })))
  })
}
