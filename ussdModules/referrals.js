const { verifyUser, textfunc, message, scheme } = require('./buddyFuctions');

module.exports = {
	referalState(menu) {
		menu.state('referal', {
			run: () => {
				menu.con(`Refer a friend \n Enter your friends number:`);
			},
			next: {
				'*[0-9]': () => {
					return new Promise((resolve) => {
						menu.session.get('data').then((val) => {
							let text =
								'Your friend ' +
								val.fName +
								' ' +
								val.sName +
								' has invited you to use ' +
								scheme +
								'.\nPlease visit http://spectrum.rubikpay.tech/ and start earning!!\nRegards, The ' +
								scheme +
								' Team';
							let phoneNumber = '+234' + menu.val.substring(1);
							message(text, phoneNumber).then((res) => {
								console.log(res.data.messages);
								resolve('referal.status');
							});
						});
					});
				}
			}
		});
		menu.state('referal.status', {
			run: () => {
				menu.con('Sent. Thank you \n Press 0 to go Back');
			}
		});
	}
};
