const { post } = require('../utils/networkRequest')
const {
  successResponse,
  failureResponse,
  serverError
} = require('../utils/responseFormatter')

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
        password: regObj.pin1,
        accountNumber: ''
      }
      console.log({ accountRequestModel })

      const accountAPIRequest = await post(
        `create_account`,
        accountRequestModel
      )
      console.log({ accountAPIRequest })

      if (
        accountAPIRequest?.status_code === 'successful' &&
        accountAPIRequest?.account_number
      ) {
        userRequestModel.accountNumber = accountAPIRequest.account_number

        console.log({ userRequestModel })

        const userAPIRequest = await post(`user/create`, userRequestModel)

        console.log({ userAPIRequest })

        if (userAPIRequest?.status_code === 'successful') {
          let message = `Welcome to SpectrumMFB ${accountRequestModel.firstName.toUpperCase()} ${accountRequestModel.surname.toUpperCase()}. Your account number is ${
            userRequestModel.accountNumber
          }.\nPlease visit http://spectrumpay.com.ng/ for further instructions`
          return successResponse(message)
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
  }
}
