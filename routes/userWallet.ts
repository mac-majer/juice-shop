/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { WalletModel } from '../models/wallet'

export function getUserWallet () {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallet = await WalletModel.findOne({ where: { UserId: req.params.id } })
      res.json({ status: 'success', data: wallet })
    } catch (error) {
      next(error)
    }
  }
}
