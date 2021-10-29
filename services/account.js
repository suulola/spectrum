const { post } = require('../utils/networkRequest')
const {
  successResponse,
  failureResponse,
  serverError
} = require('../utils/responseFormatter')
const {
  CREATE_ACCOUNT,
  CREATE_PIN,
  CREATE_USER,
  CHECK_BALANCE
} = require('../utils/apiRoute')

module.exports = {
  async registerUser (regObj, phoneNumber) {
    try {
      const accountRequestModel = {
        firstName: regObj.fName,
        surname: regObj.sName,
        homeAddress: '',
        city: '',
        phoneNumber: phoneNumber,
        source: 'USSD'
      }
      const userRequestModel = {
        name: `${regObj.fName} ${regObj.sName}`,
        username: regObj.username,
        phone_number: phoneNumber,
        email: regObj.email,
        source: 'USSD',
        password: 'SpectrumPassword',
        accountNumber: ''
      }

      const accountAPIRequest = await post(CREATE_ACCOUNT, accountRequestModel)

      if (
        accountAPIRequest?.status_code === 'successful' &&
        accountAPIRequest?.account_number
      ) {
        userRequestModel.accountNumber = accountAPIRequest.account_number

        const userAPIRequest = await post(CREATE_USER, userRequestModel)

        if (userAPIRequest?.status_code === 'successful') {
          // create PIN
          const pinModel = { pin: regObj.pin1 }
          const pinRequest = await post(CREATE_PIN, pinModel)
          if (pinRequest?.status_code === 'successful') {
            let message = `Welcome to SpectrumMFB ${accountRequestModel.firstName.toUpperCase()} ${accountRequestModel.surname.toUpperCase()}. Your account number is ${
              userRequestModel.accountNumber
            }.\nPlease visit http://spectrumpay.com.ng/ for further instructions`
            return successResponse(message)
          } else if (pinRequest?.errors) {
            let errorMessage = Object.values(pinRequest.errors)[0]
            return failureResponse(errorMessage)
          }
        } else if (userAPIRequest?.errors) {
          let errorMessage = Object.values(userAPIRequest.errors)[0]
          return failureResponse(errorMessage)
        } else {
          return failureResponse(`Registration not completed`)
        }
      }
      return failureResponse(
        `${accountAPIRequest?.message ??
          'Account Creation Failed'}. Please try again later or contact customer care to assist. SpectrumMFB`
      )
    } catch (error) {
      return serverError(
        'User registration failed. Try again later. SpectrumMFB',
        error
      )
    }
  },
  async fetchBalance (accountNumber) {
    try {
      const model = { accountNumber }
      const request = await post(CHECK_BALANCE, model)
      console.log({ request })
      if (request?.status_code === 'successful') {
        return successResponse(`Balance fetched`, request)
      } else {
        return failureResponse(`Balance Check failed`)
      }
    } catch (error) {
      return serverError('Fetching balance failed', error)
    }
  },
  async checkSpectrumAccountName (accountNumber) {
    try {
      const model = { accountNumber, source: 'USSD' }
      const request = await post('name_enquiry', model)
      console.log({ request })
      if (request?.status_code === 'successful') {
        return successResponse(`User fetched`, request)
      } else {
        return failureResponse(`Failed to validate user`)
      }
    } catch (error) {
      return serverError('Network Error', error)
    }
  },
  async spectrumTransfer (model) {
    try {
      console.log({ model })
      const request = await post('spectrum_transfer', model)
      console.log({ request })
      if (request?.status_code === 'successful') {
        return successResponse(
          request?.message ?? `Transfer successful`,
          request
        )
      } else {
        return failureResponse(request?.message ?? `Transfer failed`)
      }
    } catch (error) {
      return serverError('Network Error', error)
    }
  }
}
