import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import zParse from '../../utils/zParse'
import * as Interactor from './FarmInteractor'
import * as Schema from '../../schema/FarmSchema'
import { SessionRequest } from '../../types/AuthType'
import { deleteFile } from '../../utils/file'
import { ZodError } from 'zod'
import { createAuditLog } from '../AuditLogs/AuditLogsInteractor'

export async function applyFarm(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.NewFarmApplication, req)

    const farmActualImages = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )['farm_actual_images']

    const valid_id = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )['valid_id'][0]

    var allImages = [...farmActualImages, valid_id]

    const userid = req.session.userid

    const newApplication = await Interactor.createFarmApplication({
      farmActualImages,
      application: { body },
      userid,
      valid_id,
    })

    res.status(201).json({
      message: 'Application Submitted Successfully',
      data: newApplication,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      for (const image of allImages) {
        deleteFile(image.filename)
      }
    }

    errorHandler(res, error)
  }
}

export async function listCommunityFarms(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.CommunityFarms, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    console.log(filterKey, 'test fitler')

    const farms = await Interactor.listCommunityFarms(
      perPage,
      offset,
      searchKey,
      filterKey
    )

    const totalPages = Math.ceil(Number(farms.total.count) / perPage)
    res.status(200).json({
      farms: farms.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(farms.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listArchivedCommunityFarms(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.CommunityFarms, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const farms = await Interactor.listArchivedCommunityFarms(
      perPage,
      offset,
      searchKey,
      filterKey
    )

    const totalPages = Math.ceil(Number(farms.total.count) / perPage)
    res.status(200).json({
      farms: farms.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(farms.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function archiveCommunityFarm(req: SessionRequest, res: Response) {
  try {
    const id = req.params.id

    await Interactor.archiveCommunityFarm(id)

    await createAuditLog({
      action: 'Archived a farm',
      section: 'Community Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Archived successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function restoreCommunityFarm(req: Request, res: Response) {
  try {
    const id = req.params.id

    await Interactor.restoreCommunityFarm(id)

    res.status(200).json({ message: 'Restored successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function acceptFarmApplication(
  req: SessionRequest,
  res: Response
) {
  try {
    const id = req.params.id

    const application = await Interactor.acceptFarmApplication(id)

    await createAuditLog({
      action: 'Accepted a farm application',
      section: 'Community Management',
      userid: req.session.userid,
    })

    res
      .status(200)
      .json({ message: 'Application successfully accepted', data: application })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function rejectFarmApplication(
  req: SessionRequest,
  res: Response
) {
  try {
    const id = req.params.id

    const application = await Interactor.rejectFarmApplication(id)

    await createAuditLog({
      action: 'Rejected a farm application',
      section: 'Community Management',
      userid: req.session.userid,
    })

    res
      .status(200)
      .json({ message: 'Application successfully rejected', data: application })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function cancelExistingApplication(
  req: SessionRequest,
  res: Response
) {
  try {
    const id = req.params.id
    const userid = req.session.userid

    await Interactor.cancelExistingApplication(id, userid)

    res.status(200).json({ message: 'Application successfully cancelled' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function checkExistingApplication(
  req: SessionRequest,
  res: Response
) {
  try {
    const id = req.session.userid
    const application = await Interactor.checkExistingApplication(id)

    res.status(200).json({
      message: "There's a current application in progress",
      data: application,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listFarmApplications(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListFarmSchema, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const applications = await Interactor.listFarmApplication(
      offset,
      filterKey,
      searchKey,
      perPage
    )

    const totalPages = Math.ceil(Number(applications.total.count) / perPage)
    res.status(200).json({
      applications: applications.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(applications.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewFarmApplication(req: Request, res: Response) {
  try {
    const id = req.params.id

    const application = await Interactor.viewFarmApplication(id as string)
    res.status(200).json(application)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewCommunityFarm(req: Request, res: Response) {
  try {
    const id = req.params.id
    const communityFarm = await Interactor.viewCommunityFarm(id)

    res.status(200).json(communityFarm)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function registerCropInFarmCommunity(
  req: SessionRequest,
  res: Response
) {
  try {
    const { farm_id, crop_id } = req.params
    const { userid } = req.session

    const registeredCrop = await Interactor.registerCropInFarmCommunity(
      farm_id,
      crop_id,
      userid
    )
    res.status(201).json(registeredCrop)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listCommunityFarmCrops(req: Request, res: Response) {
  try {
    const { id } = req.params

    const availableCrops = await Interactor.listCommunityFarmCrops(id)
    res.status(200).json(availableCrops)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createCommunityGallery(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const { body } = await zParse(Schema.NewCommunityFarmGallery, req)
    const files = req.files as Express.Multer.File[]

    const newImage = await Interactor.createCommunityGallery(
      userid,
      files,
      body.description
    )

    res.status(201).json(newImage)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeCommunityFarmImage(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const { userid } = req.session

    await Interactor.removeCommunityFarmImage(id, userid)
    res.status(200).json({ message: 'Succesfully removed' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listCommunityFarmGallery(req: Request, res: Response) {
  try {
    const { id } = req.params

    const gallery = await Interactor.listCommunityFarmGallery(id)
    res.status(200).json(gallery)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listCrops(req: Request, res: Response) {
  try {
    const data = await Interactor.listCrops()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listOtherCrops(req: Request, res: Response) {
  try {
    const data = await Interactor.listOtherCrops()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listArchivedCrops(req: Request, res: Response) {
  try {
    const data = await Interactor.listArchivedCrops()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createCrop(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.NewCropSchema, req)

    const data = { ...body, image: req.file.filename }
    const newCrop = await Interactor.createCrop(data, req.file)

    await createAuditLog({
      action: 'Updated Planting Calendar',
      section: 'Community Management',
      userid: req.session.userid,
    })
    res
      .status(201)
      .json({ message: 'crop created successfully', data: newCrop })
  } catch (error) {
    errorHandler(res, error)
  }
}

/**
 *
 *
 * @DEPRICATED ROUTES
 */

export async function listFarms(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListFarmSchema, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const farms = await Interactor.listFarms(offset, searchKey, perPage)

    const totalPages = Math.ceil(Number(farms.total.count) / perPage)
    res.status(200).json({
      farms: farms.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(farms.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewFarm(req: Request, res: Response) {
  try {
    const { id } = req.params
    const farm = await Interactor.viewFarm(id)
    res.status(200).json(farm)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewSubFarm(req: SessionRequest, res: Response) {
  try {
    const userid = req.session.userid

    const subfarm = await Interactor.viewSubFarm(userid)
    res.status(200).json(subfarm)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function registerFarm(req: Request, res: Response) {
  try {
    const { body } = await zParse(Schema.NewFarmSchema, req)
    // get uploaded file
    const avatar = req.file.filename
    const data = { ...body, avatar }
    // insert data to database
    const newFarm = await Interactor.registerFarm(data, req.file)
    res.status(201).json({ message: 'registered successfully', data: newFarm })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function registerSubFarm(req: Request, res: Response) {
  try {
    const { body, params } = await zParse(Schema.NewSubFarmSchema, req)
    const { farmid, head } = params

    const newSubFarm = await Interactor.registerSubFarm(body, farmid, head)
    res
      .status(201)
      .json({ message: 'registered successfully', data: newSubFarm })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createCropReport(req: Request, res: Response) {
  try {
    const { body, params } = await zParse(Schema.NewCropReportSchema, req)
    const { farmid, userid } = params

    const data = { ...body, farmid, userid }

    const newCropReport = await Interactor.createNewCropReport(data)
    res.status(201).json({
      message: 'Crop report successfully created',
      data: newCropReport,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listActiveCropReports(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session

    const reports = await Interactor.listActiveCropReports(userid)
    res.status(200).json(reports)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createFarmerInvitation(
  req: SessionRequest,
  res: Response
) {
  try {
    const { body } = await zParse(Schema.NewFarmerInvitaion, req)
    const { userid, expiresat } = body
    const { userid: farm_head_id } = req.session

    const invitation = await Interactor.createFarmerInvitation(
      userid,
      expiresat,
      farm_head_id
    )

    res
      .status(201)
      .json({ message: 'Invitation sent successfully', invitation })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function acceptFarmerApplication(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const { userid } = req.session

    await Interactor.acceptFarmerApplication(id, userid)
    res
      .status(200)
      .json({ message: 'Invitation has been successfully accepted' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function rejectFarmerApplication(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const { userid } = req.session

    await Interactor.rejectFarmerApplication(id, userid)
    res
      .status(200)
      .json({ message: 'Invitation has been successfully rejected' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function cancelFarmerInvitation(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const { userid } = req.session

    await Interactor.cancelFarmerInvitation(id, userid)
    res
      .status(200)
      .json({ message: 'Invitation has been successfully cancelled' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewFarmerInvitation(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { userid } = req.session

    const invitation = await Interactor.viewFarmerInvitation(id, userid)
    res.status(200).json(invitation)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listFarmerInvitations(
  req: SessionRequest,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.CommunityFarms, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    // const searchKey = String(query.search)
    // const filterKey = query.filter

    const { userid } = req.session

    const invitations = await Interactor.listFarmerInvitations(
      userid,
      perPage,
      offset
    )

    const totalPages = Math.ceil(Number(invitations.total.count) / perPage)
    res.status(200).json({
      invitations: invitations.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(invitations.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listCommunityFarmMembers(
  req: SessionRequest,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.CommunityFarms, req)
    const { id } = req.params
    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    // const filterKey = query.filter

    const { userid } = req.session

    const members = await Interactor.listCommunityFarmMembers(
      id,
      userid,
      perPage,
      offset,
      searchKey
    )

    const totalPages = Math.ceil(Number(members.total.count) / perPage)
    res.status(200).json({
      members: members.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(members.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateCommunityFarm(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.UpdateCommunityFarm, req)

    const cover_photo = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.['cover_photo']?.[0]

    const avatar = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.['avatar']?.[0]

    console.log(cover_photo, 'TEST COVER')

    const userid = req.session.userid
    var allFiles = [cover_photo || null, avatar || null]

    const updatedCommunityFarm = await Interactor.updateCommunityFarm(
      userid,
      {
        body,
      },
      avatar,
      cover_photo
    )

    res.status(200).json({
      message: 'Community Farm Updated Successfully',
      data: updatedCommunityFarm,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      for (const image of allFiles) {
        deleteFile(image?.filename)
      }
    }

    errorHandler(res, error)
  }
}

export async function archiveCommunityCrop(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session
    const { id } = req.params

    await Interactor.archiveCommunityCrop(userid, id)

    res.status(200).json({ message: 'Archived Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function unArchiveCommunityCrop(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const { id } = req.params

    await Interactor.unArchiveCommunityCrop(userid, id)

    res.status(200).json({ message: 'Unarchived Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listArchivedCommunityCrops(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session

    const crops = await Interactor.listArchivedCommunityCrops(userid)

    res.status(200).json(crops)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateCrop(req: SessionRequest, res: Response) {
  try {
    const id = req.params.id
    const { body } = await zParse(Schema.UpdateCropSchema, req)

    const file = req.file
    const cropData = await Interactor.updateCrop(id, body, file)

    await createAuditLog({
      action: 'Updated planting calender',
      section: 'Community Management',
      userid: req.session.userid,
    })

    res.status(200).json({
      message: 'Updated successfully',
      data: cropData,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewCropDetails(req: Request, res: Response) {
  try {
    const id = req.params.id

    const cropData = await Interactor.viewCropDetails(id)

    res.status(200).json(cropData)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function leaveCommunityFarm(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session

    await Interactor.leaveCommunityFarm(userid)

    res.status(200).json({ message: 'Left Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function kickCommunityFarmMember(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const { id } = req.params

    await Interactor.kickCommunityFarmMember(userid, id)

    res.status(200).json({ message: 'Kicked Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function setFarmerAsFarmHead(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session
    const { id } = req.params

    await Interactor.setFarmerAsFarmHead(id, userid)

    res.status(200).json({ message: 'Assigned Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function setFarmerHeadAsFarmer(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const { id } = req.params

    await Interactor.setFarmerHeadAsFarmer(id, userid)

    res.status(200).json({ message: 'Unassigned Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function archiveCrop(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.archiveCrop(id)

    res.status(200).json({ message: 'Archived Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function unarchiveCrop(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.unarchiveCrop(id)

    res.status(200).json({ message: 'Unarchived Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}
