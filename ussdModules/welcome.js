const { verifyPin, scheme } = require('./buddyFuctions');
module.exports = {
	setBaseUser: [],
	welcomeState(menu) {
		menu.state('welcomeState', {
			run: () => {
				menu.session.get('loginStatus').then((status) => {
					console.log(status, 'login status');
					if (status !== '') {
						menu.con(
							'Welcome to ' +
								scheme +
								'\n1. Loans \n2. Check balance \n3. Fund Wallet \n4. Referrals \n0. Exit '
						);
					} else {
						verifyPin(menu.val, menu.args.phoneNumber).then((val) => {
							menu.session.set('data', val.data);
							this.setBaseUser = val.data;
							// menu.session.get('data').then((val) => {
							// 	console.log(val, 'data from the welcome screen');
							// });
							// 	console.log(val.data._id, 'id')
							
							if (val.data._id !== undefined) {
								console.log('NOT EMPTY')
								menu.session.set('loginStatus', 'isLogedIn');
								menu.con(
									'Welcome to ' +
										scheme +
										'\n1. Loans \n2. Check bal \n3. Fund Wallet \n4. Referrals \n0. Exit '
								);
							} else {
								menu.session.set('loginStatus', '');
								console.log('is empty')
								menu.con('Please login again. Enter a valid PIN');
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
				'0': 'exit',
				'*[1-9]': 'welcomeState'
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
