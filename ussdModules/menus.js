const { checkIfUserExists } = require('../services/user')
const { RegisterUser } = require('./registeration')
const { referalState } = require('./referrals')
const { checkBalanceState } = require('./checkbalance')
const { loanState } = require('./loan')
const { welcomeState } = require('./welcome')
const { transfers } = require('./transfers')
const { payBackLoanState } = require('./payBackLoan')
const { servicesState } = require('./services')

module.exports = {
  buddymenus (menu) {
    menu.startState({
      run: async () => {
        try {
          const request = await checkIfUserExists(menu.args.phoneNumber)
          console.log({ request }, 'MENU')
          menu.session.set('loginStatus', '')
          if (request.status === true) {
            menu.session.set('user_token', request.data.token)
            menu.con('Welcome to SpectrumMFB ' + ', \nPlease enter PIN')
          } else {
            menu.con(
              'Welcome to SpectrumMFB USSD Services' +
                ' \n1. Register \n2. Help'
            )
          }
        } catch (error) {
          console.log({ error })
          menu.con(
            'Welcome to SpectrumMFB USSD Service ' +
              ' \n' +
              '\n1. Register' +
              '\n2. Help'
          )
        }
      },
      next: {
        1: 'reg',
        2: 'help',
        '*[0-9]': 'welcomeState'
      }
    })
    welcomeState(menu)
    RegisterUser(menu)
    referalState(menu)
    checkBalanceState(menu)
    loanState(menu)
    transfers(menu)
    payBackLoanState(menu)
    servicesState(menu)
  }
}
