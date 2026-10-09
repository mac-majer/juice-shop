/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { CardModel } from '../models/card'

export function listUserCards () {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cards = await CardModel.findAll({ where: { UserId: req.params.id } })
      res.json({ status: 'success', data: cards })
    } catch (error) {
      next(error)
    }
  }
}
