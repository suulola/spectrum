module.exports = {
	checkBalanceState(menu) {
		menu.state('checkBalance', {
			run: () => {
				menu.session.get('data').then((val) => {
					// console.log(val.wallet.balance);
					menu.con(
						`Your Balance is: N` +
							val.wallet.balance +
							'\n' +
							'Ledger Balance is : N' +
							val.wallet.ledger_balance +
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
