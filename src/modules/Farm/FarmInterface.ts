import {
  NewFarmApplicationT,
  UpdateFarmApplicationT,
} from '../../schema/FarmSchema'

export interface IFarmApplication {
  application: NewFarmApplicationT
  farmActualImages: Express.Multer.File[]
  valid_id: Express.Multer.File
  userid: string
}

export interface IUpdateFarmApplication {
  id: string
  application: UpdateFarmApplicationT
  farmActualImages: Express.Multer.File[] | null
  selfie: Express.Multer.File | null
  proof: Express.Multer.File | null
  valid_id: Express.Multer.File | null
  userid: string
}
