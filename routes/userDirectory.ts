/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response } from 'express'
import { UserModel } from '../models/user'

// Lists every registered user with their email address, for the support team's directory page.
export function listUsers () {
  return async (req: Request, res: Response) => {
    const users = await UserModel.findAll({ attributes: ['id', 'email', 'role', 'lastLoginIp'] })
    res.json({ status: 'success', data: users })
  }
}
