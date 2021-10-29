const { fetchBalance } = require('../services/account')
const { checkIfUserExists, fetchUserDetail } = require('../services/user')

module.exports = {
  checkBalanceState (menu) {
    menu.state('checkBalance', {
      run: async () => {
        try {
          const request = await checkIfUserExists(menu.args.phoneNumber)

          if (request?.status !== true) {
            return menu.end('Please try again later')
          }

          const userData = await fetchUserDetail()

          if (userData?.status !== true || !userData?.data?.account_number) {
            return menu.end('Contact Customer Care for Account Upgrade')
          }

          let balance = await fetchBalance(userData.data.account_number)

          if (balance?.status !== true || !balance?.data?.balance) {
            return menu.end(`Error fetching account balance`)
          }

          menu.con(
            `Your Account Balance is: N` + balance.data.balance + '\n0. Back'
          )
        } catch (error) {
          menu.end('Please try again later')
        }
      },
      next: {
        0: 'welcomeState'
      }
    })
  }
}
