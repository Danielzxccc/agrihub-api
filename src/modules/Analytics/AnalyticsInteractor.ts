import HttpError from '../../utils/HttpError'
import { getUserOrThrow } from '../../utils/findUser'
import * as Service from './AnalyticsService'

export async function getLatestHarvestRate(farmid: string, userid: string) {
  const user = await getUserOrThrow(userid)
  const isDataOwner = user.farm_id === farmid
  const isAdmin = user.role === 'admin' || user.role === 'asst_admin'

  if (!isAdmin && !isDataOwner) {
    throw new HttpError('Unauthorized', 401)
  }

  const latestReport = await Service.getLatestReport(farmid)

  const lastTwoReports = await Service.getLastTwoReports(
    latestReport.crop_id,
    farmid
  )

  if (lastTwoReports.length !== 2) {
    throw new HttpError('Insufficient data for comparison.', 400)
  }

  const { kilogram, planted_qty } = latestReport
  const { kilogram: pastKilogram, planted_qty: pastPlantedQty } =
    lastTwoReports[1]

  const latestHarvestRate =
    (parseFloat(kilogram) / parseFloat(planted_qty)) * 100
  const pastHarvestRate =
    (parseFloat(pastKilogram) / parseFloat(pastPlantedQty)) * 100

  let descriptiveMessage: string
  const difference = (latestHarvestRate - pastHarvestRate).toFixed(2)

  if (latestHarvestRate > pastHarvestRate) {
    descriptiveMessage = `your harvest growth rate has improved by ${difference}% from the previous`
  } else {
    descriptiveMessage = `You are ${difference}% in harvest rate compared to your previous harvest`
  }

  return {
    plant: latestReport.name,
    message: descriptiveMessage,
    latestHarvestRate: latestHarvestRate.toFixed(2),
    pastHarvestRate: pastHarvestRate.toFixed(2),
  }
}
