module.exports = {
  successResponse(message, data = null) {
    return {
      status: true,
      data,
      message: message
    }
  },
  failureResponse(message) {
    return {
      status: false,
      data: null,
      message: message ?? 'Operation Failed'
    }
  },
  serverError(message, error) {
    console.log('------------------------')
    console.log({error})
    console.log('------------------------')
    return {
      status: false,
      data: null,
      message: message ?? 'Internal Server Error'
    }
  },
}