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
  FarmApplications,
  CommunityFarms,
  CommunityFarmsCrops,
  CommunityFarmsGallery,
  CommunityCropReports,
  CommunityCropReportsImages,
  UserNotifications,
  Subscriptions,
  FarmerInvitations,
  LearningMaterials,
  LearningResource,
  LearningCredits,
  LearningTags,
  AuditLogs,
  EventPartnership,
  EventSpeaker,
  Events,
  EventTags,
  Blogs,
  BlogImages,
  BlogTags,
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
export type UpdateGallery = Updateable<AboutGallery>

//events
// export type Events = Selectable<CommunityEvents>
// export type NewEvent = Insertable<CommunityEvents>
// export type UpdateEvent = Updateable<CommunityEvents>

//farm application
export type FarmApplication = Selectable<FarmApplications>
export type NewFarmApplication = Insertable<FarmApplications>
export type UpdateFarmApplication = Updateable<FarmApplications>

// community farm
export type CommunityFarm = Selectable<CommunityFarms>
export type NewCommunityFarm = Insertable<CommunityFarms>
export type UpdateCommunityFarm = Updateable<CommunityFarms>

//community farm crops
export type CommunityFarmCrop = Selectable<CommunityFarmsCrops>
export type NewCommunityFarmCrop = Insertable<CommunityFarmsCrops>

//community farm images
export type CommunityFarmImages = Selectable<CommunityFarmsGallery>
export type NewCommunityFarmImage = Insertable<CommunityFarmsGallery>

export type CommunityCropReport = Selectable<CommunityCropReports>
export type NewCommunityFarmReport = Insertable<CommunityCropReports>
export type NewCropReportImage = Insertable<CommunityCropReportsImages>
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

// user notification
export type UserNotification = Selectable<UserNotifications>
export type NewUserNotification = Insertable<UserNotifications>
export type UpdateUserNotification = Updateable<UserNotifications>

//subscription
export type Subscription = Selectable<Subscriptions>
export type NewSubscription = Insertable<Subscriptions>

export type FarmerInvitation = Selectable<FarmerInvitations>
export type NewFarmerInvitation = Insertable<FarmerInvitations>
export type UpdateFarmerInvitation = Updateable<FarmApplications>

// learning materials
export type LearningMaterial = Selectable<LearningMaterials>
export type NewLearningMaterial = Insertable<LearningMaterials>
export type UpdateLearningMaterial = Updateable<LearningMaterials>

// learning resource
export type NewLearningResource = Insertable<LearningResource>
export type UpdateLearningResource = Updateable<LearningResource>

// learning credits
export type NewLearningCredits = Insertable<LearningCredits>
export type UpdateLearningCredits = Updateable<LearningCredits>

// learning tags
export type NewLearningTags = Insertable<LearningTags>

// audit logs
export type NewAuditLogs = Insertable<AuditLogs>

export type NewEvent = Insertable<Events>
export type UpdateEvent = Updateable<Events>

export type NewEventPartnership = Insertable<EventPartnership>
export type UpdateEventPartnership = Updateable<EventPartnership>

export type NewEventSpeaker = Insertable<EventSpeaker>
export type UpdateEventSpeaker = Updateable<EventSpeaker>

export type NewEventTag = Insertable<EventTags>

// blogs
export type NewBlog = Insertable<Blogs>
export type UpdateBlog = Updateable<Blogs>

export type NewBlogImage = Insertable<BlogImages>
export type UpdateBlogImage = Insertable<BlogImages>

export type NewBlogTags = Insertable<BlogTags>
