import { Insertable, Selectable, Updateable } from 'kysely'
import { Users } from 'kysely-codegen'

export type User = Selectable<Users>
export type NewUser = Insertable<User>
export type UpdateUser = Updateable<User>
