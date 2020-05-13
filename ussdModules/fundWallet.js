const { calOnlineCharge, hotChargeCard, checkIfUserExists } = require('./buddyFuctions');

module.exports = {
	fundWalletState(menu) {
		let cardList = [];
		let baseUser = '';
		let authCode = '';
		menu.state('fundWalletState', {
			run: async () => {
				userData = await checkIfUserExists(menu.args.phoneNumber)
				userData = userData.data[0]
				console.log(userData.account_cards)
				if (userData.account_cards !== undefined) {
					baseUser = '';
					baseUser = userData;
					userData.account_cards.map((card, index) => {
						menu.session.set(card.bank, card.authorization_code);
						console.log(card.authorization_code, 'authorization code');
						cardList = [];
						cardList.push(index + 1 + '.' + card.bank);
					});
					menu.con('Please Select Card' + '\n' + cardList.join('\n') + '\n0.Back');
				} else {
					menu.con('No card found on this account' + '\n0.Back');
				}

			},

			next: {
				'*[1-2]': () => {
					return new Promise((resolve) => {
						console.log(cardList[menu.val - 1].split('.')[1], 'bank');
						menu.session.get(cardList[menu.val - 1].split('.')[1]).then((val) => {
							authCode = '';
							authCode = val;
						});
						resolve('fundWallet.amount');
					});
				},
				'0': 'welcomeState'
			}
		});

		menu.state('fundWallet.amount', {
			run: () => {
				calOnlineCharge(menu.val);
				menu.con('Please enter amount' + '\n0.Back');
			},
			next: {
				'*[1-9]': 'fundWallet.confirm',
				'0': 'fundWalletState'
			}
		});

		menu.state('fundWallet.confirm', {
			run: () => {
				let tot = calOnlineCharge(menu.val);
				console.log(tot, 'online charge added');
				menu.session.set('fundCardAmt', tot);
				menu.con('Note: N' + tot + ' will be deducted from your account\n' + '\n1.Proceed\n0.Back');
			},
			next: {
				'1': 'chargeCardState',
				'0': 'fundWallet.amount'
			}
		});

		menu.state('chargeCardState', {
			run: () => {
				menu.session.get('fundCardAmt').then((val) => {
					hotChargeCard(val, authCode, baseUser).then(
						(data) => {
							console.log(data, 'successful message');
							console.log(data.data._id, 'user id after transaction');
							if (data.data._id) {
								menu.con('Transaction Successfull \n 0.Back Menu');
							} else {
								menu.end('Transaction was unsuccessfull, Please try again later');
							}
						},
						(err) => {
							console.log(err, "error");
						}
					);
				});
			},
			next: {
				'0': 'welcomeState'
			}
		});

		menu.state('fundWallet.res', {
			run: () => {
				menu.end('Your request is being processed');
			}
		});
	}
};
