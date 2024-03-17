import express from 'express'
import * as PrivacyPolicyController from './PrivacyPolicyController'
import { AccessGuard, UserGuard } from '../AuthGuard/UserGuard'

export const PrivacyPolicyRouter = express.Router()

//Privacy Policy
PrivacyPolicyRouter.get('/', PrivacyPolicyController.listPrivacyPolicy) //Landing page of privacy policy

PrivacyPolicyRouter.put(
  '/update',
  AccessGuard('privacy_policy'),
  UserGuard(['admin', 'asst_admin']),
  PrivacyPolicyController.updatePrivacyPolicy
)

//Policy Content
