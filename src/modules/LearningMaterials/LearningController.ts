import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './LearningInteractor'
import * as Schema from '../../schema/LearningMaterialSchema'
import zParse from '../../utils/zParse'

export async function createDraftLearningMaterial(req: Request, res: Response) {
  try {
    const { body } = await zParse(Schema.NewLearningMaterial, req)

    const newLearningMaterial = await Interactor.createDraftLearningMaterial({
      body,
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
