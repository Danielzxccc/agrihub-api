import express from 'express'
import * as ArticlesController from '../controllers/ArticlesController'

export const ArticlesRouter = express.Router()

ArticlesRouter.post('/create', ArticlesController.createsNewArticle)
ArticlesRouter.post('/update/:id', ArticlesController.updatesArticle)
ArticlesRouter.delete('/delete/:id', ArticlesController.deletesArticle)
