const axios = require("axios");

const apiUrl = "http://172.105.84.55:1235/";
const scheme = "Spectrum";

module.exports = {
  scheme: scheme,
  apiUrl: apiUrl,
  requestloan(payload) {
    // console.log(payload, 'payload');
    return axios.post(`${apiUrl}loans/registerLoanAllDataSpectrum/`, payload);
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
    // console.log(amt, 'amount');
    return Math.round((amt / 0.985) * 1);
  },

  hotPayBackLoan(authCode, baseUser, loanObj) {
    // console.log(authCode, 'auth code'), console.log(loanObj, 'LoanObj'), console.log(baseUser, 'bASEUSER');
    // console.log(loanObj.details[0].interest);
    // return true;
    return axios.post(`${apiUrl}payments/payBackSpectrum`, {
      authorization_code: authCode,
      bu: baseUser,
      loan: loanObj
    });
  },

  hotChargeCard(amt, authCode, baseUser) {
    let amount = amt * 100;
    // console.log(amount, 'amount in kobo');
    // console.log(baseUser, 'baseUSER');
    // console.log(authCode, 'authCode');
    return axios.post(`${apiUrl}payments/chargeCardSpectrum`, {
      authorization_code: authCode,
      amount: amount,
      bu: baseUser
    });
  },

  getLoanBalance(userId) {
    // console.log(userId, 'loan');
    // console.log(userId, 'userid used');
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

  async verifyBVN(bvn, fName, sName) {
    const response = await axios.post(`${apiUrl}payments/resolvebvn`, {
      x: bvn
    });
    if (
      response.data.data.first_name === fName.toUpperCase() &&
      response.data.data.last_name === sName.toUpperCase()
    ) {
      return true;
    } else {
      return false;
    }
  },

  updateBVN(baseUser) {
    // console.log(baseUser, "baseUser");
    return axios.post(`${apiUrl}users/updateUserBvn`, baseUser);
  },

  calcPayable(amt, tenor, interest) {
    // console.log('Amt: ' + amt);
    // console.log('tenor: ' + tenor);
    // console.log('interest: ' + interest);
    let tenorx = tenor * 1;
    let intx = (interest / 100) * 1;
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
      channel: "ussd",
      email: "",
      bvn: "",
      sex: regObj.gender,
      imgUrl: "",
      xroles: ["User"],
      xPin: regObj.pin1,
      createdBy: "self",
      referralCode: "",
      scheme: "Spectrum"
    });
  },

  getLoanTyes() {
    return axios.get(`${apiUrl}`);
  },

  calcRecurringLoanAmount(principal, tenor, interest, mgtPerc) {
    // console.log('principal: '+principal); console.log('tenor: '+tenor); console.log('interest: '+interest);
    let mgtPercx = (mgtPerc / 100) * 1;
    let mgtFees = 0;
    let disburseAmt = 0;
    let monthlyInterest = 0;
    let monthlyPrincipleRepayment = 0;
    let monthlyRepayments = 0;
    let repaymentSchedule = new Array();
    let loanOffer = {};
    let principalx = principal * 1;
    let tenorx = tenor * 1;
    let intx = (interest / 100) * 1;
    // console.log('intx: '+intx);

    mgtFees = mgtPercx * principalx; //console.log('mgtFees: '+mgtFees);
    disburseAmt = principalx - mgtFees; //console.log('disburseAmt: '+disburseAmt);
    monthlyInterest = principalx * intx;
    monthlyPrincipleRepayment = Number((principalx / tenorx).toFixed(2));
    monthlyRepayments = monthlyPrincipleRepayment + monthlyInterest; //console.log('monthlyRepayments: '+monthlyRepayments);

    loanOffer.principal = principal * 100;
    loanOffer.duration = tenor;
    loanOffer.perc = interest;
    loanOffer.mgtFees = mgtFees * 100;
    loanOffer.disburseAmt = disburseAmt * 100;
    loanOffer.monthlyPrincipleRepayment = monthlyPrincipleRepayment * 100;
    loanOffer.monthlyInterest = monthlyInterest * 100;
    loanOffer.monthlyRepayments = monthlyRepayments * 100;
    loanOffer.totalInterest = loanOffer.monthlyInterest * tenorx;
    loanOffer.interest = Math.round(loanOffer.monthlyRepayments * tenorx);
    loanOffer.repaymentSchedule = repaymentSchedule;
    for (var i = 0; i < tenorx; i++) {
      let obj = {};
      obj.monthlyInterest = monthlyInterest * 100;
      obj.monthlyRepayments = monthlyRepayments * 100;
      obj.hasPaid = false;
      obj.dueDate = "";
      repaymentSchedule.push(obj);
    }
    // console.log('loanOffer: '+JSON.stringify(loanOffer));
    return loanOffer;
  }
};
