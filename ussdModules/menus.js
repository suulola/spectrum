const { checkIfUserExists } = require('./buddyFuctions');
const { RegisterUser } = require('./registeration');
const { referalState } = require('./referrals');
const { checkBalanceState } = require('./checkbalance');
const { loanState } = require('./loan');
const { welcomeState } = require('./welcome');
const { fundWalletState } = require('./fundWallet');
const { payBackLoanState } = require('./payBackLoan');
const { scheme } = require('./buddyFuctions');

module.exports = {
	buddymenus(menu) {
		menu.startState({
			run: () => {
				// console.log(menu.args.phoneNumber, 'phoneNumber');
				checkIfUserExists(menu.args.phoneNumber).then(
					(val) => {
						menu.session.set('loginStatus', '');
						if (val.data.length < 1) {
							menu.con('Welcome to ' + scheme + ' \n1. Register \n2. Help');
						} else {
							menu.con('Welcome to ' + scheme + ', Please enter pin');
						}
					},
					(err) => {
						// console.log(err);
						menu.con('Welcome to ' + scheme + ' \n' + '\n1. Register' + '\n2. Help');
					}
				);
			},
			next: {
				'1': 'reg',
				'2': 'help',
				'*[0-9]': 'welcomeState'
			}
		});
		welcomeState(menu);
		RegisterUser(menu);
		referalState(menu);
		checkBalanceState(menu);
		loanState(menu);
		fundWalletState(menu);
		payBackLoanState(menu);
	}
};
