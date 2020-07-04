const axios = require("axios");
const apiUrl = "http://167.172.100.241:1235/";
const scheme = "Spectrum";

module.exports = {
  scheme: scheme,
  apiUrl: apiUrl,

  requestloan(payload) {
    return axios.post(`${apiUrl}loans/registerLoanAllDataSpectrum/`, payload);
  },

  getLoanList() {
    return axios.post(`${apiUrl}loans/getGenericLoans`, {
      scheme: scheme
    });
  },

  fundTransfer() {
    return axios.post(`${apiUrl}payments/fundsTransfer`, {
      payload
    })
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

  calcPayable(amt, tenor, interest) {
    let tenorx = tenor * 1;
    let intx = (interest / 100) * 1;
    intx = intx * amt;
    let totinterest = intx * tenorx;
    let amtx = amt * 1;
    return totinterest + amtx;
  },

  calOnlineCharge(amt) {
    return Math.round((amt / 0.985) * 1);
  },

  hotPayBackLoan(authCode, baseUser, loanObj) {
    return axios.post(`${apiUrl}payments/payBackSpectrum`, {
      authorization_code: authCode,
      bu: baseUser,
      loan: loanObj
    });
  },

  pager(pagerObj, array) {
    pagerObj.page;
    return array.slice(
      pagerObj.page * pagerObj.pageSize,
      (pagerObj.page + 1) * pagerObj.pageSize
    );
  },

  hotChargeCard(amt, authCode, baseUser) {
    let amount = amt * 100;
    return axios.post(`${apiUrl}payments/chargeCardSpectrum`, {
      authorization_code: authCode,
      amount: amount,
      bu: baseUser
    });
  },

  getLoanBalance(userId) {
    return axios.post(`${apiUrl}loans/getLoansByUserId/`, {
      xid: userId,
      scheme: scheme
    });
  },

  updateLoanStatusToRepaid(id) {
    return axios.post(`${apiUrl}loans/updateLoanStatusToRepaid/`, {});
  },

  calcPayable(amt, tenor, interest) {
    let tenorx = tenor * 1;
    let intx = (interest / 100) * 1;
    intx = intx * amt;
    let totinterest = intx * tenorx;
    let amtx = amt * 1;
    return totinterest + amtx;
  },

  UpdateWallet(model) {
    console.log(JSON.stringify(model), "bu");
    let apiURL = `${apiUrl}wallets/updateWallet/`;
    return axios.post(apiURL, model);
  },

  preparePurchase(wallet, amount) {
    let model = {
      canProceed: false,
      reason: "",
      wallet: wallet
    };
    if (amount > wallet.ledger_balance) {
      model.canProceed = false;
      model.reason = "Insufficient Balance";
    } else {
      model.canProceed = true;
      model.reason = "Sufficient Balance";
      wallet.ledger_balance = wallet.ledger_balance - amount;
      wallet.transaction_funds = wallet.transaction_funds * 1 + amount;
      wallet.isLocked = false;
      model.wallet = wallet;
    }
    return model;
  },

  message(text, phoneNum) {
    return axios.post(`${apiUrl}auth/sendSMS/`, {
      to: phoneNum,
      from: scheme,
      text: text
    });
  },

  registerUser(regObj) {
    console.log(regObj, "rEGobj");
    return axios.post(`${apiUrl}users/register_user`, regObj);
  },

  getLoanTyes() {
    return axios.get(`${apiUrl}`);
  },

  debitWallet(wallet, amount) {
    wallet.balance = wallet.ledger_balance;
    wallet.transaction_funds = wallet.transaction_funds * 1 - amount;
    wallet.isLocked = false;
    return wallet;
  },

  calcRecurringLoanAmount(principal, tenor, interest, mgtPerc) {
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
    mgtFees = mgtPercx * principalx;
    disburseAmt = principalx - mgtFees;
    monthlyInterest = principalx * intx;
    monthlyPrincipleRepayment = Number((principalx / tenorx).toFixed(2));
    monthlyRepayments = monthlyPrincipleRepayment + monthlyInterest;
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
    return loanOffer;
  }
};
