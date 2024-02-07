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
