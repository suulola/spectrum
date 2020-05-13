module.exports = {
    billState(menu) {
        menu.state('bills', {
            run: () => {
                menu.con('1. Airtime & Data \n2. Cable TV Bills \n3. Utility Bills \n0. Main Menu')
            },
            next: {
                '1': 'bills.air',
                '2': 'bills.utility',
                '0': 'welcome'
            }
        })

        menu.state('bills.air', {
            run: () => {
                menu.con('1.Airtime \n 2.Data \n 0.Back')
            },
            next: {
                '1': 'bills.airtime',
                '2': 'bills.data',
                '0': 'bills'
            }
        })
        menu.state('bills.airtime', {
            run: () => {
                menu.con('1.Glo \n 2.Mtn \n 3.Airtel \n 4.9Mobile \n0.Back')
            },
            next: {
                '1': 'bills.a',
                '2': 'bills.a',
                '3': 'bills.a',
                '4': 'bills.a',
                '0': 'bills.air'
            }
        })

        menu.state('bills.a', {
            run: () => {
                menu.con('Please enter amount: \n 0.Back')
            },
            next: {
                '*[1-9]': 'bills.credit'
            }
        })

        menu.state('bills.credit', {
            run: () => {
                menu.con('transaction successful \n 0.Back')
            },
            next: {
                '0': 'bills'
            }
        })
    }


}