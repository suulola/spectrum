const { textfunc, registerUser, message, scheme } = require('./buddyFuctions');

module.exports = {
	RegisterUser(menu) {
		let sessions = {};
		menu.sessionConfig({
			get: function(sessionId, key) {
				return new Promise((resolve, reject) => {
					let value = sessions[sessionId][key];
					resolve(value);
				});
			},

			set: (sessionId, key, value, callback) => {
				// store key-value pair in current session
				sessions[sessionId][key] = value;
				callback();
			},
			start: (sessionId, callback) => {
				// initialize current session if it doesn't exist
				// this is called by menu.run()
				if (!(sessionId in sessions)) sessions[sessionId] = {};
				callback();
			},
			end: (sessionId, callback) => {
				// clear current session
				// this is called by menu.end()
				delete sessions[sessionId];
				callback();
			}
		});

		menu.state('reg', {
			run: () => {
				menu.con('Welcome, Enter First name');
			},
			next: {
				'*[a-zA-Z]+': () => {
					return new Promise((resolve) => {
						if (typeof menu.val === 'string' && menu.val.length > 0) {
							menu.session.set('fName', menu.val);
							resolve('reg.lName');
						}
					});
				}
			}
		});

		menu.state('reg.lName', {
			run: () => {
				menu.con('Enter your Surname');
			},
			next: {
				'*[a-zA-Z]+': () => {
					return new Promise((resolve) => {
						if (typeof menu.val === 'string' && menu.val.length > 0) {
							menu.session.set('sName', menu.val).then(() => {});
							resolve('reg.Gender');
						}
					});
				}
			}
		});

		menu.state('reg.Gender', {
			run: () => {
				menu.con('Please select your Gender \n1. Male \n2. Female \n3. Others');
			},

			next: {
				'*[0-9]': () => {
					return new Promise((resolve) => {
						if (menu.val === '1') {
							menu.session.set('gender', 'male');
							resolve('reg.Pin');
						} else if (menu.val === '2') {
							menu.session.set('gender', 'female');
							resolve('reg.Pin');
						} else if (menu.val === '3') {
							menu.session.set('gender', 'others');
							resolve('reg.Pin');
						} else {
							resolve('reg.Gender');
						}
					});
				}
			}
		});

		menu.state('reg.Pin', {
			run: () => {
				menu.con('Please select/enter a six (6) digit* PIN');
			},

			next: {
				'*[0-9]': () => {
					return new Promise((resolve) => {
						if (menu.val.length === 6) {
							menu.session.set('pin1', menu.val).then(() => {});
							resolve('reg.ConfirmPin');
						} else {
							resolve('inValid.Pin');
						}
					});
				}
			}
		});

		menu.state('inValid.Pin', {
			run: () => {
				menu.con('PIN must be 6 digits!\n Pleae enter a valid PIN');
			},
			next: {
				'*[0-9]': () => {
					return new Promise((resolve) => {
						if (menu.val.length === 6) {
							menu.session.set('pin1', menu.val).then(() => {});
							resolve('reg.ConfirmPin');
						} else {
							resolve('inValid.Pin');
						}
					});
				}
			}
		});

		menu.state('reg.ConfirmPin', {
			run: () => {
				menu.con('Please Confirm PIN ');
			},

			next: {
				'*[0-9]': () => {
					return new Promise((resolve, reject) => {
						menu.session.get('pin1').then((val) => {
							console.log(val, 'gotten value');
							console.log(menu.val, 'gxchvj');
							if (val === menu.val) {
								menu.session.set('confirmPin', menu.val);
								console.log('confirmed');
								resolve('check');
							} else if (val !== menu.val) {
								resolve('inValid.Pin');
							}
						});
					});
				}
			}
		});

		// menu.state('reg.email', {
		// 	run: () => {
		// 		menu.con('Please enter your email address');
		// 	},
		// 	next: {
		// 		'*[a-zA-Z]+': () => {
		// 			return new Promise((resolve) => {
		// 				menu.session.set('email', menu.val);
		// 				resolve('check');
		// 			});
		// 		}
		// 	}
		// });

		menu.state('pin.misMatch', {
			run: () => {
				menu.con('PIN does not match!\n please confirm again');
			},

			next: {
				'*[0-9]': () => {
					return new Promise((resolve, reject) => {
						menu.session.get('pin1').then((val) => {
							console.log(val, 'gotten value');
							console.log(menu.val, 'gxchvj');

							if (val === menu.val) {
								menu.session.set('confirmPin', menu.val);
								console.log('confirmed');
								resolve('check');
							} else if (val !== menu.val) {
								resolve('pin.misMatch');
							}
						});
					});
				}
			}
		});

		menu.state('check', {
			run: () => {
				let sId = menu.args.sessionId;
				console.log(sessions, 'sesssion');
				menu.con(
					`${sessions[sId].fName} ${sessions[sId].sName}, ${sessions[sId].gender}, ${sessions[sId]
						.pin1}, \nPress 1 to confirm OR 0 to to go to the loan menu`
				);
			},
			next: {
				'1': 'register.User',
				'2': 'loan'
			}
		});

		menu.state('register.User', {
			run: () => {
				// textfunc(sessions[menu.args.sessionId], menu.args.phoneNumber);
				return new Promise((resolve) => {
					console.log(sessions, 'sessions');
					registerUser(sessions[menu.args.sessionId], menu.args.phoneNumber).then(
						(res) => {
							let sess = sessions[menu.args.sessionId];
							let text =
								'Welcome to' +
								scheme +
								' ' +
								sess.fName +
								' ' +
								sess.sName +
								' ' +
								'.\nPlease visit http://spectrum.rubikpay.tech/' +
								'for further instructions';

							message(text, menu.args.phoneNumber).then((res) => {
								console.log(res.data.messages);
								// resolve('referal.status');
								resolve(menu.end('Registration was successful'));
							});
						},
						(err) => {
							resolve(menu.end(' error !!!'));
						}
					);
				});
			},
			next: {
				'1': ''
			}
		});
	}
};
