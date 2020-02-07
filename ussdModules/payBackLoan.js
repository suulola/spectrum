module.exports = {
	payBackLoanState(menu) {
		menu.state('payBackLoan', {
			run: () => {
				menu.con('Please select card \n 1. Card 1 \n 2. Card 2');
			},

			next: {
				'*[1-2]': 'payBackLoan.confirm'
				// '2': 'card2'
			}
		});
		menu.state('payBackLoan.confirm', {
			run: () => {
				menu.con('Press 1 to confirm your request');
			},
			next: {
				'1': 'payBackLoan.res'
			}
		});

		menu.state('payBackLoan.res', {
			run: () => {
				menu.end('Your request is being processed');
			}
		});
	}
};
