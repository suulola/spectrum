const { SET_TOKEN, GET_TOKEN } = require('../utils/constants')

const STATE = {
  accessToken: ''
}

module.exports = {
  dispatch (action) {
    switch (action.type) {
      case SET_TOKEN: {
        console.log('SET_TOKEN')
        STATE.accessToken = action.payload
        return STATE.accessToken
      }
      case GET_TOKEN: {
        return STATE.accessToken
      }
      default: {
        return STATE.accessToken
      }
    }
  }
}
