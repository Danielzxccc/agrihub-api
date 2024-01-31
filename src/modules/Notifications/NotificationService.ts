import { sql } from 'kysely'
import { db } from '../../config/database'
import {
  NewSubscription,
  NewUserNotification,
  Subscription,
  UserNotification,
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

export async function findUserNotifications(
  userid: string,
  offset: number,
  filterKey: string,
  searchKey: string,
  perpage: number
): Promise<UserNotification[]> {
  let query = db
    .selectFrom('user_notifications')
    .selectAll()
    .where('emitted_to', '=', userid)

  return await query.limit(perpage).offset(offset).execute()
}

export async function getUserNotificationCount(userid: string) {
  return await db
    .selectFrom('user_notifications')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('emitted_to', '=', userid)
    .executeTakeFirst()
}
