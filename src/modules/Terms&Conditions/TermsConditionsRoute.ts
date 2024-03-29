import express from 'express'
import * as TermsConditionsController from './TermsConditionsController'
import { AccessGuard, UserGuard } from '../AuthGuard/UserGuard'

export const TermsConditionsRouter = express.Router()

TermsConditionsRouter.get('/', TermsConditionsController.listTermsConditions)

TermsConditionsRouter.put(
  '/update',
  AccessGuard('terms_and_conditions'),
  UserGuard(['admin', 'asst_admin']),
  TermsConditionsController.updateTermsConditions
)
