const {
  checkSpectrumAccountName,
  spectrumTransfer
} = require('../services/account')
const {
  calOnlineCharge,
  hotChargeCard,
  fundAccount
} = require('./buddyFuctions')

module.exports = {
  transfers (menu) {
    let cardList = []
    let baseUser = ''
    let authCode = ''
    let bankDetail = {}

    menu.state('bankTransfer', {
      run: () => {
        menu.con(
          'Select Type of Transfer' +
            ' \n1. To SpectrumMFB Account \n2. To other banks'
        )
      },
      next: {
        1: 'transfer.spectrum',
        2: 'transfer.banks',
        0: 'services'
      }
    })

    menu.state('transfer.spectrum', {
      run: () => {
        menu.con('Please enter Spectrum Account Number' + '\n0.Back')
      },
      next: {
        '*[1-9]': () => {
          return new Promise(resolve => {
            if (menu.val.length >= 9) {
              resolve('transfer.spectrum.amount')
              bankDetail.recipientAccount = menu.val
            } else {
              resolve('transfer.spectrum')
            }
          })
        },
        0: 'bankTransfer'
      }
    })

    menu.state('transfer.spectrum.amount', {
      run: async () => {
        menu.con('Please enter amount' + '\n0.Back')
      },
      next: {
        // '*[1-9]': 'transfer.spectrum.name',
        '*[1-9]': () => {
          return new Promise(resolve => {
            if (menu.val >= 1000) {
              resolve('transfer.spectrum.name')
              bankDetail.amount = menu.val
            } else {
              resolve('transfer.spectrum.invalid')
            }
          })
        },
        0: 'bankTransfer'
      }
    })
    menu.state('transfer.spectrum.invalid', {
      run: async () => {
        menu.con('Please enter amount. Must be at least N1000' + '\n0.Back')
      },
      next: {
        // '*[1-9]': 'transfer.spectrum.name',
        '*[1-9]': () => {
          return new Promise(resolve => {
            if (menu.val >= 1000) {
              resolve('transfer.spectrum.name')
              bankDetail.amount = menu.val
            } else {
              resolve('transfer.spectrum.invalid')
            }
          })
        },
        0: 'bankTransfer'
      }
    })

    menu.state('transfer.spectrum.name', {
      run: async () => {
        const fetchName = await checkSpectrumAccountName(
          bankDetail.recipientAccount
        )
        console.log({ fetchName })
        console.log(fetchName?.data.content.accountName, 'HII')
        menu.con(
          `Please confirm Transfer Details \n Name: ${fetchName?.data.content?.accountName} \n Amount: ${bankDetail.amount}\n Charges: N20` +
            '\n1.Confirm' +
            '\n0.Back'
        )
      },
      next: {
        1: 'transfer.spectrum.confirm',
        '*[2-9]': 'transfer.spectrum',
        0: 'bankTransfer'
      }
    })

    menu.state('transfer.spectrum.confirm', {
      run: async () => {
        const accountNumber = await menu.session.get('accountNumber')

        if (accountNumber === bankDetail.recipientAccount) {
          menu.con('Transfer Failed. You cannot transfer to yourself')
          return
        }

        const model = {
          accountNumber,
          recipientAccount: bankDetail.recipientAccount,
          amount: bankDetail.amount,
          serviceCharge: 20
        }
        const transferRequest = await spectrumTransfer(model)
        console.log({ transferRequest })
        return menu.con(transferRequest?.message)
      },
      next: {
        0: ''
      }
    })

    menu.state('transfer.banks', {
      run: () => {},
      next: {
        1: 'chargeCardState',
        0: 'fundWallet.amount'
      }
    })
  }
}
