/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response } from 'express'

import * as models from '../models/index'

export function searchOrderNotes () {
  return async (req: Request, res: Response) => {
    const term = req.query.term
    if (typeof term !== 'string' || term.length > 100 || !/^[\w\s-]*$/.test(term)) {
      return res.status(400).json({ status: 'error', message: 'Invalid search term' })
    }
    const [notes] = await models.sequelize.query('SELECT * FROM OrderNotes WHERE text LIKE :pattern', {
      replacements: { pattern: `%${term}%` }
    })
    res.json({ status: 'success', data: notes })
  }
}

export function setOrderNoteColor () {
  return async (req: Request, res: Response) => {
    const color = req.body.color
    await models.sequelize.query(`UPDATE OrderNotes SET color = '${color}' WHERE id = ${req.params.id}`)
    res.json({ status: 'success' })
  }
}
