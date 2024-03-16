import express from 'express'
import * as PrivacyPolicyController from './PrivacyPolicyController'
import { UserGuard } from '../AuthGuard/UserGuard'

export const PrivacyPolicyRouter = express.Router()

//Privacy Policy
PrivacyPolicyRouter.get('/details', PrivacyPolicyController.listPrivacyPolicy)

PrivacyPolicyRouter.put(
  '/update',
  UserGuard(['admin', 'asst_admin']),
  PrivacyPolicyController.updatePrivacyPolicy
)

//Policy Content
