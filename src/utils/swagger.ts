import { Express, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import log from './utils'

const swaggerDocument = YAML.load('./spec.yml')

function swaggerDocs(app: Express) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerDocument)
  })

  log.info(`Docs available at http://localhost:3000/docs`)
}

export default swaggerDocs
