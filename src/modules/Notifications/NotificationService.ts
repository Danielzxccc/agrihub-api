import { sql } from 'kysely'
import { db } from '../../config/database'
import {
  NewSubscription,
  NewUserNotification,
  Subscription,
} from '../../types/DBTypes'

export async function createNotification(notification: NewUserNotification) {
  return db
    .insertInto('user_notifications')
    .values(notification)
    .returningAll()
    .executeTakeFirst()
}

export async function createSubscritpion(subscription: NewSubscription) {
  return db
    .insertInto('subscriptions')
    .values(subscription)
    .onConflict((oc) =>
      oc.column('userid').doUpdateSet({
        payload: subscription.payload,
        updatedat: sql`CURRENT_TIMESTAMP`,
      })
    )
    .returningAll()
    .executeTakeFirst()
}

export async function findSubscription(userid: string): Promise<Subscription> {
  return await db
    .selectFrom('subscriptions')
    .selectAll()
    .where('userid', '=', userid)
    .executeTakeFirst()
}
