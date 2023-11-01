import * as TagsController from './TagsController'
import express from 'express'

export const TagsRouter = express.Router()

TagsRouter.get('/search', TagsController.findTags)
