const axios = require('axios');

const apiUrl = 'http://172.105.84.55:1235/';
const scheme = 'Spectrum';

module.exports = {
	scheme: scheme,
	apiUrl: apiUrl,
	requestloan(payload) {
		console.log(payload, payload);
		return axios.post(`${apiUrl}loans/registerLoanAllData`, payload);
	},
	getLoanList() {
		return axios.post(`${apiUrl}loans/getGenericLoans`, {
			scheme: scheme
		});
	},
	fetchBalance(phonenumber) {
		return new Promise((resolve, reject) => {
			resolve(phonenumber * 1);
		});
	},
	checkIfUserExists(phoneNumber) {
		return axios.post(`${apiUrl}users/getUsersByMobile/`, {
			x: phoneNumber,
			scheme: scheme
		});
	},
	verifyPin(pin, phonenumber) {
		return axios.post(`${apiUrl}auth/login`, {
			xMobile: phonenumber,
			xPin: pin,
			scheme: scheme
		});
	},

	calOnlineCharge(amt) {
		console.log(amt, 'amount');
		return Math.round(amt / 0.985 * 1);
	},

	hotPayBackLoan(authCode, baseUser, loanObj) {
		// console.log(authCode, 'auth code'), console.log(loanObj, 'LoanObj'), console.log(baseUser, 'bASEUSER');
		console.log(loanObj.details[0].interest);
		// return true;
		return axios.post(`${apiUrl}payments/payBackSpectrum`, {
			authorization_code: authCode,
			bu: baseUser,
			loan: loanObj
		});
	},

	hotChargeCard(amt, authCode, baseUser) {
		let amount = amt * 100;
		console.log(amount, 'amount in kobo');
		console.log(baseUser, 'baseUSER');
		console.log(authCode, 'authCode');
		return axios.post(`${apiUrl}payments/chargeCardSpectrum`, {
			authorization_code: authCode,
			amount: amount,
			bu: baseUser
		});
	},

	getLoanBalance(userId) {
		// console.log(userId, 'loan');
		console.log(userId, 'userid used');
		return axios.post(`${apiUrl}loans/getLoansByUserId/`, {
			xid: userId,
			scheme: scheme
		});
	},

	updateLoanStatusToRepaid(id) {
		return axios.post(`${apiUrl}loans/updateLoanStatusToRepaid/`, {});
	},

	updateWalletBalance(baseUser) {
		return axios.post(`${apiUrl}fundWallet/fund`, baseUser);
	},

	calcPayable(amt, tenor, interest) {
		console.log('Amt: ' + amt);
		console.log('tenor: ' + tenor);
		console.log('interest: ' + interest);
		let tenorx = tenor * 1;
		let intx = interest / 100 * 1;
		intx = intx * amt;
		let totinterest = intx * tenorx;
		let amtx = amt * 1;

		return totinterest + amtx;
	},

	message(text, phoneNum) {
		return axios.post(`${apiUrl}auth/sendSMS/`, {
			to: phoneNum,
			from: scheme,
			text: text
		});
	},

	registerUser(regObj, phoneNumber) {
		// return console.log(regObj.fName, regObj.sName, regObj.pin1, regObj.gender, phoneNumber, 'regObj');
		return axios.post(`${apiUrl}users/register_user`, {
			fName: regObj.fName,
			sName: regObj.sName,
			xMobile: phoneNumber,
			channel: 'ussd',
			email: '',
			bvn: '',
			sex: regObj.gender,
			imgUrl: '',
			xroles: [ 'User' ],
			xPin: regObj.pin1,
			createdBy: 'self',
			referralCode: '',
			scheme: 'Spectrum'
		});
	},

	getLoanTyes() {
		return axios.get(`${apiUrl}`);
	}
};
