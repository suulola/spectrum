module.exports = {
  successResponse(message) {
    return {
      status: true,
      data: null,
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