// import { Express, Request, Response } from 'express'
// import swaggerUi from 'swagger-ui-express'
// import YAML from 'yamljs'
// import log from './utils'

// const swaggerDocument = YAML.load('./spec/main.yml')

// function swaggerDocs(app: Express) {
//   app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

//   app.get('/docs.json', (req: Request, res: Response) => {
//     res.setHeader('Content-Type', 'application/json')
//     res.send(swaggerDocument)
//   })

//   log.info(`Docs available at http://localhost:3000/docs`)
// }

// export default swaggerDocs

import { Express, Request, Response } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import log from './utils'

const options: swaggerJsdoc.Options = {
  apisSorter: 'alpha',
  tagsSorter: 'alpha',
  operationsSorter: 'alpha',
  definition: {
    openapi: '3.0.0',
    basePath: 'https://qc-agrihub.xyz',
    info: {
      title: 'AGRIHUB API',
      version: '1.0',
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes.ts', './src/modules/*/*.ts', './src/schema/*.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app: Express) {
  // Swagger page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Docs in JSON format
  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  log.info(`Docs available at http://localhost:${3000}/docs`)
}

export default swaggerDocs
