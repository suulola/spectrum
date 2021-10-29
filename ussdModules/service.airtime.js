const { networkProviders } = require('./consts')
const { airtimePurchase } = require('../services/bill')

module.exports = {
  serviceAirtimeState (menu) {
    let selectedNetworkProvideIndex = ''
    let airtimeModel = {}
    let airtimeMessage = ''

    menu.state('service.airtime', {
      run: () => {
        let joiner = []
        networkProviders.map((provider, index) => {
          joiner.push(`${index + 1}.${provider.name}`)
        })
        menu.con(joiner.join('\n'))
      },
      next: {
        '*[1-4]': () => {
          return new Promise(resolve => {
            selectedNetworkProvideIndex = menu.val - 1
            resolve('service.airtime.amt')
          })
        },
        0: 'services'
      }
    })
    menu.state('service.airtime.amt', {
      run: () => {
        menu.con('Please enter amount:')
      },
      next: {
        '*[1-9]': () => {
          return new Promise(resolve => {
            if (menu.val >= 100) {
              resolve('service.airtime.getphone')
              airtimeModel.amount = menu.val
            } else {
              resolve('service.airtime.invalidamount')
            }
          })
        },
        0: 'services'
      }
    })

    menu.state('service.airtime.invalidamount', {
      run: () => {
        menu.con('Amount cannot be less than N100. Enter amount:')
      },
      next: {
        '*[1-9]': () => {
          return new Promise(resolve => {
            // TODO: Change back to 100
            if (menu.val >= 10) {
              resolve('service.airtime.getphone')
              airtimeModel.amount = menu.val
            } else {
              resolve('service.airtime.invalidamount')
            }
          })
        },
        0: 'services'
      }
    })

    menu.state('service.airtime.getphone', {
      run: () => {
        menu.con('Enter phone number:')
      },
      next: {
        '*[1-9]': () => {
          if (menu.val.length === 11) {
            airtimeModel.phone = menu.val
            return 'services.airtime.confirm'
          }
          return 'services.airtime.getphone'
        },
        0: 'services'
      }
    })

    menu.state('services.airtime.confirm', {
      run: () => {
        menu.con(
          `Confirm: ${networkProviders[selectedNetworkProvideIndex].name} \n Phone Number: ${airtimeModel.phone} Amount:N${airtimeModel.amount} \n Press 1 to proceed \n0. Back`
        )
      },
      next: {
        1: () => {
          return new Promise(async resolve => {
            // make API call
            console.log('Processing Airtime')
            airtimeModel.serviceID =
              networkProviders[selectedNetworkProvideIndex].value
            const accountNumber = await menu.session.get('accountNumber')
            console.log({ accountNumber })

            airtimePurchase(airtimeModel, menu.args.phoneNumber, accountNumber)
              .then(response => {
                console.log({ response })

                if (response.status === true) {
                  menu.end(
                    response?.message ??
                      'Success. Your request is being processed.'
                  )
                } else {
                  menu.end(
                    response?.message ??
                      'Recharge Failed. Please try again later'
                  )
                }
              })
              .catch(error => {
                menu.end('Transaction Failed. Try again later')
                resolve('service.airtime')
              })
          })
        },
        0: ''
      }
    })

    menu.state('service.airtime.mes', {
      run: () => {
        menu.end(airtimeMessage)
      }
    })
  }
}
