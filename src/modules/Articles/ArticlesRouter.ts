import express from 'express'
import * as ArticlesController from './ArticlesController'

export const ArticlesRouter = express.Router()

ArticlesRouter.post('/', ArticlesController.createArticle)

ArticlesRouter.put('/:id', ArticlesController.updateArticle)
ArticlesRouter.delete('/:id', ArticlesController.deleteArticle)
