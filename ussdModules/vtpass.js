const { apiUrl, scheme } = require("./consts");
const axios = require("axios");

module.exports = {
  catchva: "",
  async getVariations(serviceID) {
    console.log(serviceID, "{{1234}}");
    let apiURL = `${apiUrl}vtpass/tv/get-variation-code?serviceID=${serviceID}`;
    return axios.get(apiURL);
  },
  verifyElectricMeter(model) {
    let apiURL = `${apiUrl}vtpass/electricity/verify`;
    return axios.post(apiURL, model);
  },
  verifySmartcard(model) {
    console.log(model);
    let apiURL = `${apiUrl}vtpass/tv/verify-smartcard`;
    return axios.post(apiURL, model);
  },
  payBill(model) {
    let apiURL = `${apiUrl}ussd/vtpass/utility/pay`;
    return axios.post(apiURL, model);
  },



  // TEST
  getVariationsTest(serviceID) {
   
    let apiURL = `${apiUrl}vtpass/tv/get-variation-code_test?serviceID=${serviceID}`;
    return axios.get(apiUrl);
  },
  verifyElectricMeterTest(model) {
    let apiURL = `${apiUrl}vtpass/electricity/verify_test`;
    return axios.post(apiURL, model);
  },
  verifySmartcardTest(model) {
    let apiURL = `${apiUrl}vtpass/tv/verify-smartcard_test`;
    return axios.post(apiURL, model);
  },
  payBillTest(model) {
    let apiURL = `${apiUrl}vtpass/utility/pay_test`;
    return axios.post(apiURL, model);
  }
};
