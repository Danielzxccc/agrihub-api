import HttpError from '../../utils/HttpError'
import { NewCommunityFarmReport } from '../../types/DBTypes'
import { findCommunityFarmById } from '../Farm/FarmService'
import * as Service from './ReportsService'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { deleteFile } from '../../utils/file'
import { findUser } from '../Users/UserService'
import { uploadFiles } from '../AWS-Bucket/UploadService'

export async function createCommunityCropReport(
  userid: string,
  report: NewCommunityFarmReport,
  images: Express.Multer.File[]
) {
  try {
    const user = await findUser(userid)
    if (!userid) throw new HttpError('Unathorized', 401)

    const farm = await findCommunityFarmById(user.farm_id)

    if (!farm) throw new HttpError("Can't find farm", 404)
    if (userid !== farm.farm_head) throw new HttpError('Unathorized', 401)

    const crop = await Service.findCommunityFarmCrop(report.crop_id as string)
    if (!crop.id) throw new HttpError("Can't find crop", 404)

    const newReport = await Service.insertCommunityCropReport({
      ...report,
      farmid: user.farm_id,
      userid,
    })

    if (images.length) {
      const reportImages = images.map((item) => {
        return {
          imagesrc: item.filename,
          report_id: newReport.id,
        }
      })
      await Service.insertCropReportImage(reportImages)
      await uploadFiles(images)

      for (const image of images) {
        deleteFile(image.filename)
      }
    }

    return newReport
  } catch (error) {
    for (const image of images) {
      deleteFile(image.filename)
    }

    dbErrorHandler(error)
  }
}
