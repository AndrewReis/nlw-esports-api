import express from 'express'

import { logger } from './utils/logger'

const app = express()

app.get('/ads', (request, response) => {
  return response.json([{ok: true}])
})

app.listen(3333, () => logger.info('Server running at 3333'))