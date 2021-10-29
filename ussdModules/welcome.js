const { verifyPin } = require('../services/user')

module.exports = {
  welcomeState (menu) {
    menu.state('welcomeState', {
      run: async () => {
        try {
          const status = await menu.session.get('loginStatus')

          if (status) {
            menu.con(
              `Welcome to SpectrumMFB . Choose an option ` +
                `\n1. Airtime \n2. Check balance \n3. Fund Account \n4. Services \n5. Referrals \n0. Exit `
            )
          } else {
            const verifyRequest = await verifyPin(menu.val)
            console.log({ verifyRequest })
            if (verifyRequest.status && verifyRequest.data?.account_number) {
              menu.session.set('loginStatus', 'isLoggedIn')
              menu.session.set(
                'accountNumber',
                verifyRequest.data.account_number
              )

              menu.con(
                'Welcome to SpectrumMFB. Choose an option ' +
                  '\n1. Airtime \n2. Check Balance  \n3. Transfers \n4. Services \n5. Referrals \n6. Loans \n0. Exit'
              )
            } else {
              menu.session.set('loginStatus', '')
              menu.con('Please login again. Enter a valid PIN')
            }
          }
        } catch (error) {
          menu.con('Please login again. Enter a valid PIN')
        }
      },
      next: {
        1: 'service.airtime',
        2: 'checkBalance',
        3: 'bankTransfer',
        4: 'services',
        5: 'referal',
        6: 'loan',
        0: 'exit',
        '*[1-9]': 'welcomeState'
      }
    })

    menu.state('exit', {
      run: () => {
        menu.session.set('loginStatus', '').then(val => {
          menu.end('Thanks for using SpectrumMFB')
        })
      }
    })
  }
}
