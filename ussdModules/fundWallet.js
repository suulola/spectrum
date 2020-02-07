module.exports = {
	fundWalletState(menu) {
		menu.state('fundWallet', {
			run: () => {
				menu.con('Please select card \n 1. Card 1 \n 2. Card 2');
			},

			next: {
				'*[1-2]': 'fundWallet.amount'
				// '2': 'card2'
			}
		});

		menu.state('fundWallet.amount', {
			run: () => {
				menu.con('Please enter amount');
			},
			next: {
				'*[1-9]': 'fundWallet.confirm'
			}
		});

		menu.state('fundWallet.confirm', {
			run: () => {
				menu.con('Press 1 to confirm your request');
			},
			next: {
				'1': 'fundWallet.res'
			}
		});

		menu.state('fundWallet.res', {
			run: () => {
				menu.end('Your request is being processed');
			}
		});
	}
};
