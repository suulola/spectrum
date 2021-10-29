const { post, get } = require('../utils/networkRequest')
const {
  successResponse,
  failureResponse,
  serverError
} = require('../utils/responseFormatter')
const {
  VALIDATE_USER,
  VERIFY_PIN,
  GET_USER_ACCOUNT
} = require('../utils/apiRoute')
const { dispatch } = require('../store/store')
const { SET_TOKEN } = require('../utils/constants')

const appName = 'Spectrum USSD'
const token = '4FbDFDqiVK6KXm8ZmkPI'

module.exports = {
  async checkIfUserExists (phoneNumber) {
    try {
      const model = { phoneNumber, appName, token }
      console.log({ model, VALIDATE_USER })
      const request = await post(VALIDATE_USER, model)
      if (request?.status_code === 'successful' && request?.token) {
        dispatch({
          type: SET_TOKEN,
          payload: request.token
        })
        return successResponse('Login successful', request)
      } else {
        return failureResponse(`Create an account`)
      }
    } catch (error) {
      return serverError('Network Timeout. Try again later. SpectrumMFB', error)
    }
  },
  async verifyPin (pin) {
    try {
      console.log({ pin })
      const model = { pin }
      const request = await post(VERIFY_PIN, model)
      console.log({ request })
      if (request?.status_code === 'successful') {
        const accountRequest = await get(GET_USER_ACCOUNT)
        if (
          accountRequest?.status_code === 'successful' &&
          accountRequest?.details
        ) {
          return successResponse(
            'Pin verified successfully',
            accountRequest.details
          )
        }
      }
      return failureResponse(`Wrong PIN`)
    } catch (error) {
      return serverError('Network Timeout. Try again later. SpectrumMFB', error)
    }
  },
  async fetchUserDetail () {
    try {
      const accountRequest = await get(GET_USER_ACCOUNT)
      if (
        accountRequest?.status_code === 'successful' &&
        accountRequest?.details
      ) {
        return successResponse('Account details', accountRequest.details)
      }
      return failureResponse(`Wrong PIN`)
    } catch (error) {
      return serverError('Network Timeout. Try again later. SpectrumMFB', error)
    }
  }
}
