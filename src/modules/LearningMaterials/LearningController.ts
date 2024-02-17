import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './LearningInteractor'
import * as Schema from '../../schema/LearningMaterialSchema'
import zParse from '../../utils/zParse'
import { createAuditLog } from '../AuditLogs/AuditLogsService'
import { SessionRequest } from '../../types/AuthType'

export async function viewLearningMaterial(req: Request, res: Response) {
  try {
    const { id } = req.params

    const learningMaterial = await Interactor.viewLearningMaterial(id)
    res.status(200).json(learningMaterial)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listRelatedLearningMaterials(
  req: Request,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.ListRelatedMaterials, req)

    const learningMaterial = await Interactor.listRelatedLearningMaterials(
      query.tags
    )
    res.status(200).json(learningMaterial)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewPublishedLearningMaterial(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params

    const learningMaterial = await Interactor.viewLearningMaterial(id)
    res.status(200).json(learningMaterial)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createDraftLearningMaterial(
  req: SessionRequest,
  res: Response
) {
  try {
    const { body } = await zParse(Schema.NewLearningMaterial, req)

    const newLearningMaterial = await Interactor.createDraftLearningMaterial({
      body,
    })

    await createAuditLog({
      action: '',
      section: 'Leaning Material Management',
      userid: req.session.userid,
    })

    res
      .status(201)
      .json({ message: 'Created Successfully', data: newLearningMaterial })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateDraftLearningMaterial(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.UpdateLearningMaterial, req)

    const updatedLearningMaterial =
      await Interactor.updateDraftLearningMaterial(id, body)

    res
      .status(200)
      .json({ message: 'Updated Successfully', data: updatedLearningMaterial })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createLearningResource(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.NewLearningResource, req)
    const image = req.file

    const newLearningResource = await Interactor.createLearningResource(
      id,
      image,
      {
        body,
      }
    )

    res
      .status(201)
      .json({ message: 'created successfully', data: newLearningResource })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateLearningResource(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { body: resource } = await zParse(Schema.NewLearningResource, req)
    const image = req.file

    const updatedLearningResource = await Interactor.updateLearningResource(
      id,
      image,
      resource
    )

    res
      .status(200)
      .json({ message: 'Updated Successfully', data: updatedLearningResource })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeLearningResource(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeLearningResource(id)

    res.status(200).json({ message: 'Removed Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createLearningCredits(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.NewLearningCredits, req)

    const newLearningCredits = await Interactor.createLearningCredits(id, body)

    res
      .status(201)
      .json({ message: 'Created Successfully', data: newLearningCredits })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateLearningCredits(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.NewLearningCredits, req)

    const newLearningCredits = await Interactor.updateLearningCredits(id, body)

    res
      .status(200)
      .json({ message: 'Updated Successfully', data: newLearningCredits })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeLearningCredits(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeLearningCredits(id)
    res.status(200).json({ message: 'Removed Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createLearningTags(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.NewLearningTags, req)

    const newLearningTags = await Interactor.createLearningTags(id, body.tags)
    res
      .status(201)
      .json({ message: 'Created Successfully', data: newLearningTags })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeLearningTags(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeLearningTags(id)
    res.status(200).json({ message: 'Removed Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listDraftLearningMaterials(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListDraftLearningMaterials, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const learningMaterials = await Interactor.listDraftLearningMaterials(
      offset,
      searchKey,
      perPage
    )

    const totalPages = Math.ceil(
      Number(learningMaterials.total.count) / perPage
    )
    res.status(200).json({
      data: learningMaterials.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(learningMaterials.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}
export async function listPublishedLearningMaterials(
  req: Request,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.ListDraftLearningMaterials, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const learningMaterials = await Interactor.listPublishedLearningMaterials(
      offset,
      searchKey,
      perPage
    )

    const totalPages = Math.ceil(
      Number(learningMaterials.total.count) / perPage
    )
    res.status(200).json({
      data: learningMaterials.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(learningMaterials.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listArchivedLearningMaterials(
  req: Request,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.ListDraftLearningMaterials, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const learningMaterials = await Interactor.listArchivedLearningMaterials(
      offset,
      searchKey,
      perPage
    )

    const totalPages = Math.ceil(
      Number(learningMaterials.total.count) / perPage
    )
    res.status(200).json({
      data: learningMaterials.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(learningMaterials.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function publishLearningMaterial(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.publishLearningMaterial(id)

    res.status(200).json({ message: 'Published Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function setFeaturedLearningResource(req: Request, res: Response) {
  try {
    const { materialId, id } = req.params

    await Interactor.setFeaturedLearningResource(materialId, id)

    res.status(200).json({ message: 'Set Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function unpublishLearningMaterial(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.unpublishLearningMaterial(id)

    res.status(200).json({ message: 'Unpublished Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeLearningMaterial(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeLearningMaterial(id)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function archiveLearningMaterial(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.archiveLearningMaterial(id)

    res.status(200).json({ message: 'Archived Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function unArchiveLearningMaterial(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.unArchiveLearningMaterial(id)

    res.status(200).json({ message: 'Unarchived Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}
