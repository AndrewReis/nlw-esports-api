import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

import { logger } from './utils/logger'
import { convertHourMinutesToString, convertHourStringToMinutes } from './helpers/date.helper';

const app = express()

app.use(cors())
app.use(express.json())

const prisma = new PrismaClient({
  log: ['query', 'error']
});

app.get('/games', async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {select: {ads: true}}
    }
  });

  return response.json(games);
})

app.get('/games/:id/ads', async (request, response) => {
  const { id } = request.params;

  const ads = await prisma.ad.findMany({
    select: {
      id             : true,
      name           : true,
      hourStart      : true,
      hourEnd        : true,
      useVoiceChannel: true,
      weekDays       : true,
      yearsPlaying   : true
    },
    where: {
      gameId: id
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  const adsFormatted = ads.map(ad => {
    return {
      ...ad,
      hourStart: convertHourMinutesToString(ad.hourStart),
      hourEnd: convertHourMinutesToString(ad.hourEnd),
      weekDays: ad.weekDays.split(',')
    }
  });
  
  return response.json(adsFormatted)
})

app.get('/ads/:id/discord', async (request, response) => {
  const { id } = request.params

  const ad = await prisma.ad.findFirstOrThrow({
    select: {
      discord: true
    },
    where: {
      id
    }
  });

  return response.json({
    discord: ad.discord
  });
})

app.post('/games/:id/ads', async (request, response) => {
  const { id } = request.params
  const body = request.body

  const ad = await prisma.ad.create({
    data: {
      gameId         : id,
      name           : body.name,
      yearsPlaying   : body.yearsPlaying,
      discord        : body.discord,
      weekDays       : body.weekDays.join(','),
      hourStart      : convertHourStringToMinutes(body.hourStart),
      hourEnd        : convertHourStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel
    }
  })

  return response.status(201).json(ad)
});

app.listen(3333, () => logger.info('Server running at 3333'))