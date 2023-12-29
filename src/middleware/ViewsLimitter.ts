import redisClient from '../config/redis'

type ClientRequest = {
  id: string
  ip: string
  user: string
}

export async function viewsLimitter(req: ClientRequest): Promise<boolean> {
  const { id, ip, user } = req
  const redisId = `${id}/${ip}/${user ? user : 'guest'}`
  const requests = await redisClient.incr(redisId)

  return requests > 1
}
