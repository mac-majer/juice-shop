/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { UserModel } from '../models/user'

export function exportUserData () {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.findByPk(req.params.id)
      if (!user) {
        res.status(404).json({ status: 'error', message: 'User not found' })
        return
      }
      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        lastLoginIp: user.lastLoginIp,
        totpSecret: user.totpSecret
      })
    } catch (error) {
      next(error)
    }
  }
}
