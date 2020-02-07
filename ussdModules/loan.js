const { getLoanList, requestloan, scheme, message } = require('./buddyFuctions');

module.exports = {
	loanState(menu) {
		let dt;
		menu.state('loan', {
			run: () => {
				menu.con(
					'Please select an option:\n 1. New Loan \n 2. Pay Back Loan \n 3. Get loan balance \n 0. Back'
				);
			},
			next: {
				'1': () => {
					return new Promise((resolve) => {
						getLoanList().then(
							(data) => {
								menu.session.set('loanData', data.data);
								resolve('loan.list');
							},
							(err) => {
								console.log(err);
							}
						);
					});
				},
				'2': 'loan.payBack',
				'3': 'loan.loanBalance',
				'0': 'welcomeState'
			}
		});

		menu.state('loan.list', {
			run: () => {
				let loanList = [];
				menu.session.get('loanData').then((loans) => {
					loans.map((loans, index) => {
						loanList.push(index + 1 + '. ' + loans.title);
					});
					menu.con('Please select a loan type' + '\n' + loanList.join('\n') + '\n0. Back ');
				});
			},
			next: {
				'*[1-9]': 'loan.confirm',
				'0': 'loan'
			}
		});

		menu.state('loan.confirm', {
			run: () => {
				menu.session.get('loanData').then((loans) => {
					dt = loans[menu.val - 1];
					menu.con(
						'Loan Description \n' +
							dt.title +
							' LOAN' +
							'\nAmount: ' +
							'N' +
							dt.loanAmtFrom +
							' to ' +
							'N' +
							dt.loanAmtTo +
							'\n' +
							'Duration: ' +
							dt.tenorFrom +
							' to ' +
							dt.tenorTo +
							' days' +
							'\n' +
							'Interest: ' +
							dt.interest +
							'%' +
							'\nPress 1 to continue' +
							' OR 0 to go Back'
					);
				});
			},
			next: {
				'0': 'loan.list',
				'1': 'loan.amount'
				// () => {
				// 	console.log(dt);
				// }
				// 'loan.amount'
				// '1': () => {

				// }
				// 'loan.response'
			}
		});

		menu.state('loan.amount', {
			run: () => {
				menu.con('Please enter amount between \n' + 'N' + dt.loanAmtFrom + ' to ' + 'N' + dt.loanAmtTo);
			},
			next: {
				'*[0-9]': () => {
					return 'loan.response';

					// return new Promise((resolve) => {
					// 	menu.session.get('data').then((data) => {
					// 		console.log(data, 'dt');
					// 		console.log(dt, 'dt');
					// 		if (menu.val <= dt.loanAmtTo) {
					// 			let payload = {
					// 				amount: menu.val,
					// 				transaction_desc: 'REQUEST FOR ' + dt.title,
					// 				customer_ref: data.mobile,
					// 				firstname: data.fName,
					// 				surname: data.sName,
					// 				email: data.email,
					// 				mobile: menu.args.phoneNumber,
					// 				scheme: scheme
					// 			};
					// 			console.log(payload, 'payload');
					// 			requestloan(payload).then(
					// 				(res) => {
					// 					let text =
					// 						'Hi ' +
					// 						data.fName +
					// 						' ' +
					// 						data.sName +
					// 						' your loan request was successful. Please visit our website to check loan status. Thank you';
					// 					message(text, '+2349052085121').then((res) => {
					// 						resolve('loan.response');
					// 					});
					// 				},
					// 				(err) => {
					// 					console.log(err);
					// 				}
					// 			);
					// 		}
					// 	});
					// });
				}
			}
		});

		menu.state('loan.response', {
			run: () => {
				// requestloan()
				let text =
					'Loan request failed due to incomplete requirements, Please visit http://spectrum.rubikpay.tech/ to upload documents. Thank you.';
				message(text, menu.args.phoneNumber);
				menu.end(text);
			}
		});
	}
};
