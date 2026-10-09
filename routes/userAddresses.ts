/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { AddressModel } from '../models/address'

export function listUserAddresses () {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addresses = await AddressModel.findAll({ where: { UserId: req.params.id } })
      res.json({ status: 'success', data: addresses })
    } catch (error) {
      next(error)
    }
  }
}
