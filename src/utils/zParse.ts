import { AnyZodObject, ZodError, z } from 'zod'
import HttpError from './HttpError'
import { Request } from 'express'
async function zParse<T extends AnyZodObject, K>(
  schema: T,
  req: Request
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError('validation error', 400, error.errors)
    }
    throw new HttpError('validation error', 400)
  }
}

export default zParse
