import { NewQuestion } from 'DBTypes'
import dbErrorHandler from '../utils/dbErrorHandler'
import * as Service from '../service/ForumsService'

export async function createNewQuestion(question: NewQuestion) {
  try {
    const newQuestion = await Service.createQuestion(question)

    return newQuestion
  } catch (error) {
    dbErrorHandler(error)
  }
}
