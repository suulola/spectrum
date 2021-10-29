const { post, get } = require('../utils/networkRequest')
const {
  successResponse,
  failureResponse,
  serverError
} = require('../utils/responseFormatter')
const { PAY_BILL } = require('../utils/apiRoute')

module.exports = {
  async airtimePurchase (paymentModel, phoneNumber, accountNumber) {
    try {
      console.log({ paymentModel, phoneNumber, accountNumber })
      const model = {
        amount: +paymentModel.amount,
        phone: phoneNumber,
        billersCode: paymentModel.phone,
        variation_code: null,
        serviceID: paymentModel.serviceID,
        identifier: 'airtime',
        accountNumber: accountNumber
      }
      console.log({ model })
      const request = await post(PAY_BILL, model)
      console.log({ request })
      if (request?.status_code === 'successful') {
        return successResponse('Recharge successful', request)
      } else if (request?.errors) {
        let errorMessage = Object.values(request.errors)[0]
        return failureResponse(errorMessage)
      } else {
        return failureResponse(`Recharge failed`)
      }
    } catch (error) {
      console.log({ error })
      return serverError('Network Timeout. Try again later. SpectrumMFB', error)
    }
  }
}
