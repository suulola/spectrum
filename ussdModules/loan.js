const {
	getLoanList,
	getLoanBalance,
	requestloan,
	message,
	calOnlineCharge,
	hotPayBackLoan,
	hotChargeCard
} = require('./buddyFuctions');

module.exports = {
	loanState(menu) {
		let payBackAmt = Number;
		let dt;
		let cardList = [];
		let cardAuth = [];
		let loanObj;
		let loanindex;
		let baseUser = '';
		let authCode = '';
		menu.state('loan', {
			run: () => {
				menu.con(
					'Please select an option:\n1. New Loan \n2. Payback Loan \n3. Get loan status \n4. Check loan Balance \n0. Back'
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
				'3': 'loan.status',
				'4': 'loan.balance',
				'0': 'welcomeState'
			}
		});

		menu.state('loan.status', {
			run: () => {
				menu.session.get('data').then((data) => {
					getLoanBalance(data._id).then((value) => {
						if (value.data.length !== 0) {
							value.data.forEach((val) => {
								// console.log(val);
								let details;
								val.details.forEach((detail) => (details = detail));

								menu.con(
									'Details \n' +
										'status: ' +
										val.status +
										'\nAmount: ' +
										Number(details.principal) / 100 +
										'\nAmount with interest:' +
										Number(details.interest) / 100 +
										'\nDuration:' +
										details.duration +
										'\n0.Back'
								);
							});
						} else {
							menu.con('You have no loans. \n1.Apply for a Loan \n0.Back');
						}
					});
				});
			},
			next: {
				'0': 'loan',
				'1': 'loan.list'
			}
		});

		menu.state('loan.balance', {
			run: () => {
				menu.session.get('data').then((data) => {
					getLoanBalance(data._id).then((value) => {
						console.log(value.data, 'val');
						if (value.data.length === 0) {
							menu.con(`You don't have a registered loan \n0.Back`);
						} else {
							value.data.forEach((val) => {
								let details;

								val.details.forEach((detail) => (details = detail));

								if (val.status === 'Disbursed') {
									menu.con(
										'Details: \n' +
											'Amount:' +
											Number(details.interest) / 100 +
											'\nDuration:' +
											Number(details.duration) / 100 +
											'\n Due-Date:' +
											details.dueDate +
											'\nElapsed by:' +
											details.elapsedSn +
											'\n0.Back'
									);
								} else {
									menu.con(`You don't have a disbursed loan \n1.Check loan status \n0.Back`);
								}
							});
						}
					});
				});
			},
			next: {
				'0': 'loan',
				'1': 'loan.status'
			}
		});

		menu.state('loan.payBack', {
			run: () => {
				menu.session.get('data').then((data) => {
					getLoanBalance(data._id).then((value) => {
						if (value.data.length !== 0) {
							loanObj = value.data[0];
							if (loanObj._id) {
								if (loanObj.status === 'Disbursed') {
									// console.log(loanObj.details[0], 'val details 0');
									payBackAmt = Number(loanObj.details[0].interest) / 100;
									menu.con('Payback: ' + 'N' + payBackAmt + '\n1.Proceed \n0.Back');
								} else {
									menu.con('Please check loan status \n2.Check Loan Status \n0.Back');
								}
							} else {
								menu.con('Please check loan status \n2.Check Loan Status \n0.Back');
							}
						} else {
							menu.con('You have no registered loan \n0.Back');
						}

						// value.data.forEach((val) => {
						// 	let details;
						// 	val.details.forEach((detail) => (details = detail));
						// 	if (val._id) {
						// 		if (val.status) {
						// 			payBackAmt = details.interest;
						// 			menu.con('Payback: ' + 'N' + payBackAmt + '\n1.Proceed \n0.Back');
						// 		} else {
						// 			menu.con('You have a pending loan \n 1.Check loan status \n 0.Back');
						// 		}
						// 	} else {
						// 		menu.con('You have no loan. \n0.Back');
						// 	}
						// });
					});
				});
			},
			next: {
				'1': 'loan.payment.selectCard',
				'2': 'loan.status',
				'0': 'loan'
			}
		});

		// menu.state('loan.payBack', {
		// 	run: () => {
		// 		menu.session.get('data').then((data) => {
		// 			getLoanBalance(data._id).then((value) => {
		// 				value.data.forEach((val) => {
		// 					let details;
		// 					val.details.forEach((detail) => (details = detail));
		// 					if (val._id) {
		// 						if (val.status == 'Pending') {
		// 							payBackAmt = details.interest;
		// 							menu.con('Payback: ' + 'N' + details.interest + '\n1.Proceed \n0.Back');
		// 						} else {
		// 							menu.con('You have a pending loan \n 1.Check loan status \n 0.Back');
		// 						}
		// 					} else {
		// 						menu.con('You have no loan. \n0.Back');
		// 					}
		// 				});
		// 			});
		// 		});
		// 	},
		// 	next: {
		// 		'1': 'loan.payment.selectCard',
		// 		'0': 'loan'
		// 	}
		// });
		menu.state('loan.payment.selectCard', {
			run: () => {
				cardAuth = [];
				menu.session.get('data').then((val) => {
					cardList = [];
					baseUser = '';
					baseUser = val;
					val.account_cards.map((card, index) => {
						// console.log(card.authorization_code, card.bank, 'authbank');
						cardAuth.push({
							cardName: card.bank,
							authCode: card.authorization_code
						});

						cardList.push(index + 1 + '.' + card.bank);
					});
					// console.log(cardList);
					// console.log(cardList.join('\n'));

					menu.con('Please Select Card \n' + cardList.join('\n') + '\n' + '\n0.Back');
				});
			},

			next: {
				'*[1-9]': () => {
					return new Promise((resolve) => {
						menu.session.set('choice', Number(menu.val) - 1);
						// authCode = '';
						// console.log(cardList, 'cardlist');

						// menu.session.get(cardList[menu.val - 1].split('.')[1]).then((val) => {
						// 	authCode = val;

						// console.log(cardList[menu.val - 1].split('.')[1], 'bank', authCode);
						// });
						resolve('loan.payment.confirm');
					});
				},
				'0': 'loan.payBack'
			}
		});
		menu.state('loan.payment.confirm', {
			run: () => {
				let totalAmount = calOnlineCharge(payBackAmt);
				// console.log(totalAmount, 'totalAmount');
				menu.con('Note: N' + totalAmount + ' will be removed from your account\n' + '\n1.Proceed\n0.Back');
			},
			next: {
				'1': 'loan.chargeCardState',
				'0': 'loan.payment.selectCard'
			}
		});

		menu.state('loan.chargeCardState', {
			run: () => {
				// console.log(cardAuth, 'cardAuth');
				menu.session.get('choice').then((choice) => {
					// console.log(choice, 'choice');
					let card = cardAuth[choice];
					// console.log(card, card.cardName, card.authCode);
					// loanObj.details[0].interest = 1000;
					hotPayBackLoan(card.authCode, baseUser, loanObj).then(
						(data) => {
							console.log(data.messages);

							// console.log(data, 'successful message');
							// console.log(data.data._id, 'user id after transaction');
							// if (data.data._id) {
							// 	menu.con('Transaction Successfull \n 0.Back Menu');
							// } else {
							menu.end('Your Loan has successfully been paid. Thank you');
							// }
						},
						(err) => {
							console.log(err);
						}
					);
				});
			},
			next: {
				'0': 'welcomeState'
			}
		});

		menu.state('loan.list', {
			run: () => {
				let loanList = [];
				menu.session.get('loanData').then((loans) => {
					loans.map((loans, index) => {
						if (loans.title === 'POCKET MONEY ADVANCE') {
							console.log('found');
							loanindex = index;
							loanList.push(1 + '. ' + loans.title);
						}
					});
					menu.con('Please select a loan type' + '\n' + loanList.join('\n') + '\n0. Back ');
				});
			},
			next: {
				'1': 'loan.confirm',
				'0': 'loan'
			}
		});

		menu.state('loan.confirm', {
			run: () => {
				menu.session.get('loanData').then((loans) => {
					dt = loans[loanindex];
					menu.con(
						'Loan Description \n' +
							dt.title +
							' LOAN' +
							'\nAmount: ' +
							'N' +
							Number(dt.loanAmtFrom) / 100 +
							' to ' +
							'N' +
							Number(dt.loanAmtTo) / 100 +
							'\n' +
							'Duration: ' +
							dt.tenorFrom +
							' to ' +
							dt.tenorTo +
							' months' +
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
			}
		});

		menu.state('loan.amount', {
			run: () => {
				// console.log(dt, ' loan data '),
				// console.log(baseUser, 'base user '),
				menu.con(
					'Please enter amount between \n' +
						'N' +
						Number(dt.loanAmtFrom) / 100 +
						' to ' +
						'N' +
						Number(dt.loanAmtTo) / 100
				);
			},
			next: {
				'*[0-9]': () => {
					return new Promise((resolve) => {
						// resolve('loan.req.invalid');
						menu.session.get('data').then((bu) => {
							if (bu.bvn !== '') {
								if (menu.val <= dt.loanAmtTo / 100) {
									let payload = {
										offer: dt,
										_id: bu._id,
										amount: menu.val * 100,
										transaction_desc: 'Loan advice for ' + 'Spectrum',
										customer_ref: bu.mobile.substring(1),
										firstname: bu.fName,
										surname: bu.sName,
										email: bu.email,
										mobile_no: bu.mobile.substring(1),
										scheme: 'Spectrum',
										xid: bu._id,
										userFullname: bu.fName + ' ' + bu.sName,
										userMobile: bu.mobile,
										userCode: bu.qrCode,
										isOverdue: false,
										hasPaid: false,
										status: 'Pending',
										principal: menu.val * 100,
										interest: menu.val * 100,
										duration: dt.tenorTo,
										perc: dt.interest,
										dueDate: '',
										elapsedSn: '0',
										account_name: '',
										account_code: '',
										account_no: '',
										loanScore: '',
										selected_loan_title: dt.title,
										selected_loan_id: dt._id,
										selected_loan_description: dt.description
									};
									requestloan(payload).then(
										(res) => {
											console.log(res, 'res data');
											let text =
												'Hi ' +
												bu.fName +
												' ' +
												bu.sName +
												'Your loan request was successfull. Please check you loan status or visit http://spectrum.rubikpay.tech/ for more information. Thank you';
											message(text, menu.args.phoneNumber).then((res) => {
												console.log(res, 'message res');
												resolve('loan.response');
											});
										},
										(err) => {
											console.log(err);
										}
									);
								} else {
									resolve('loan.req.invalid');
								}
							} else {
								resolve('loan.bvn.error');
							}
						});
					});
				}
			}
		});

		menu.state('loan.bvn.error', {
			run: () => {
				text = 'Please update your BVN on our website http://spectrum.rubikpay.tech/';
				menu.end(text);
				message(text, menu.args.phoneNumber);
			}
		});

		menu.state('loan.req.invalid', {
			run: () => {
				menu.con('Invalid Loan request, please enter a valid amount \n1.Retry \n0.Back');
			},
			next: {
				'1': 'loan.amount',
				'0': 'loan'
			}
		});

		menu.state('loan.response', {
			run: () => {
				// requestloan()
				let text =
					'Your loan request was successfull. Please check your loan status or visit http://spectrum.rubikpay.tech/ for more information. Thank you';
				menu.end(text);
			}
		});
	}
};
