module.exports = {
	checkBalanceState(menu) {
		menu.state('checkBalance', {
			run: () => {
				menu.session.get('data').then((val) => {
					// console.log(val.wallet.balance);
					menu.con(
						`Your Balance is: N` +
							val.wallet.balance / 100 +
							'\n' +
							'Ledger Balance is : N' +
							val.wallet.ledger_balance / 100 +
							'\n0. Back'
					);
				});
			},
			next: {
				'0': 'welcomeState'
			}
		});
	}
};
