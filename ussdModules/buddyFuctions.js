const axios = require('axios');

const apiUrl = 'http://172.105.84.55:1234/';
const scheme = 'Spectrum';

module.exports = {
	scheme: scheme,
	apiUrl: apiUrl,
	requestloan(payload) {
		return axios.post(`${apiUrl}loans/requestLoan`, payload);
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
