import { Insertable, Selectable, Updateable } from 'kysely'
import { Forums, Users, Articles, EmailToken, UserTags } from 'kysely-codegen'

export type User = Selectable<Users>
export type NewUser = Insertable<User>
export type UpdateUser = Updateable<User>
export type Token = Selectable<EmailToken>

export type Question = Selectable<Forums>
export type NewQuestion = Insertable<Forums>
export type UpdateQuestion = Updateable<Forums>

export type Article = Selectable<Articles>
export type NewArticle = Insertable<Articles>
export type UpdateArticle = Updateable<Articles>

export type UserTag = Insertable<UserTags>
