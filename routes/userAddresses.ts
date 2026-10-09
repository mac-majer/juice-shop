/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { AddressModel } from '../models/address'
import * as security from '../lib/insecurity'

export function listUserAddresses () {
  return async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = security.authenticatedUsers.get(req.cookies.token)
    if (!loggedInUser || String(loggedInUser.data.id) !== req.params.id) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' })
      return
    }
    try {
      const addresses = await AddressModel.findAll({ where: { UserId: loggedInUser.data.id } })
      res.json({ status: 'success', data: addresses })
    } catch (error) {
      next(error)
    }
  }
}
