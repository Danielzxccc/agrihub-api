import { NewFarmApplicationT } from '../../schema/FarmSchema'

export interface IFarmApplication {
  application: NewFarmApplicationT
  farmActualImages: Express.Multer.File[]
  selfie: Express.Multer.File
  proof: Express.Multer.File
  valid_id: Express.Multer.File
  userid: string
}
