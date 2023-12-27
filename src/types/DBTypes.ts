import { InsertType, Insertable, Selectable, Updateable } from 'kysely'
import {
  Forums,
  Users,
  Articles,
  AboutCms,
  CommunityEvents,
  EmailToken,
  UserTags,
  ForumsComments,
  ForumsAnswers,
  Farms,
  SubFarms,
  Crops,
  CropReports,
  AnswerVotes,
  AboutGallery,
} from 'kysely-codegen'

export type User = Selectable<Users>
export type NewUser = Insertable<User>
export type UpdateUser = Updateable<User>
export type Token = Selectable<EmailToken>

export type Question = Selectable<Forums>
export type NewQuestion = Insertable<Forums>
export type NewAnswer = Insertable<ForumsAnswers>
export type NewComment = Insertable<ForumsComments>
export type Answer = Selectable<ForumsAnswers>
export type UpdateQuestion = Updateable<Forums>

export type NewVoteQuestion = Insertable<AnswerVotes>

export type Article = Selectable<Articles>
export type NewArticle = Insertable<Articles>
export type UpdateArticle = Updateable<Articles>

export type UserTag = Insertable<UserTags>

//About
export type UpdateAbout = Updateable<AboutCms>
export type AddImage = Insertable<AboutCms>
export type Gallery = Insertable<AboutGallery>

//events
export type Events = Selectable<CommunityEvents>
export type NewEvent = Insertable<CommunityEvents>
export type UpdateEvent = Updateable<CommunityEvents>

// farms
export type Farm = Selectable<Farms>
export type NewFarm = Insertable<Farms>

// subfarm
export type SubFarm = Selectable<SubFarms>
export type NewSubFarm = Insertable<SubFarms>

// crops
export type Crop = Selectable<Crops>
export type NewCrop = Insertable<Crop>
export type UpdateCrop = Updateable<Crop>

// crop reports
export type CropReport = Selectable<CropReports>
export type NewCropReport = Insertable<CropReports>
