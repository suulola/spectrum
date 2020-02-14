const { verifyPin, scheme } = require('./buddyFuctions');
module.exports = {
	setBaseUser: [],
	welcomeState(menu) {
		menu.state('welcomeState', {
			run: () => {
				menu.session.get('loginStatus').then((val) => {
					// console.log(val, 'login status');
					if (val === 'isLogedIn') {
						menu.con(
							'Welcome to ' +
								scheme +
								'\n 1. Loans \n 2. Check balance \n3. Fund Wallet \n4. Referrals \n0. Exit '
						);
					} else {
						verifyPin(menu.val, menu.args.phoneNumber).then((val) => {
							menu.session.set('data', val.data);
							this.setBaseUser = val.data;
							menu.session.get('data').then((val) => {
								console.log(val, 'data from the welocome screen');
							});

							menu.session.set('loginStatus', 'isLogedIn');
							if (val.data._id) {
								menu.con(
									'Welcome to ' +
										scheme +
										'\n 1. Loans \n 2. Check balance \n3. Fund Wallet \n4. Referals \n0. Exit '
								);
							} else {
								menu.con('Please login again. Enter a valid pin');
							}
						});
					}
				});
			},
			next: {
				'1': 'loan',
				'2': 'checkBalance',
				'3': 'fundWalletState',
				'4': 'referal',
				'0': 'exit'
			}
		});

		menu.state('exit', {
			run: () => {
				menu.session.set('loginStatus', '').then((val) => {
					menu.end('Thanks for using ' + scheme);
				});
			}
		});
	}
};
