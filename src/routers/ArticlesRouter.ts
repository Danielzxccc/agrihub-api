import express from 'express'
import * as ArticlesController from '../controllers/ArticlesController'

export const ArticlesRouter = express.Router()

ArticlesRouter.post('/create', ArticlesController.createArticle)
ArticlesRouter.post('/update/:id', ArticlesController.updateArticle)
ArticlesRouter.delete('/delete/:id', ArticlesController.deleteArticle)
