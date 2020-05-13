module.exports = {
  scheme: "BiziPay",
  apiUrl: "http://172.105.84.55:1224/",
  modelBills: {
    phone: String,
    serviceID: String,
    amount: String,
    variation_code: String,
    billersCode: String
  },
  networkProviders: [
    { name: "Glo", value: "Glo" },
    { name: "Mtn", value: "Mtn" },
    { name: "Airtel", value: "Airtel" },
    { name: "Etisalat", value: "etisalat" }
  ],
  modelTv: {
    phone: String,
    serviceID: String,
    amount: String
  },
  TvVendorSelect: [
    { value: "dstv", name: "DSTV" },
    { value: "gotv", name: "GOTV" },
    { value: "startimes", name: "Startimes" }
  ],

  ltElecPackageSelect: [
    { value: "prepaid", name: "Pre-paid" },
    { value: "postpaid", name: "Post Paid" }
  ],

  bills: ["Cables Tv", "Electricity "],

  ElecVendorSelect: [
    {
      name: "Portharcourt-Electric (PHED)",
      value: "portharcourt-electric"
    },
    { name: "Eko-Electric (EKEDC)", value: "eko-electric" },
    { name: "Ikeja-Electric (IKEDC)", value: "ikeja-electric" },
    { name: "Jos-Electric (JED PLC)", value: "jos-electric" },
    { name: "Kano-Electric (KEDCO)", value: "kano-electric" },
    { name: "Abuja-Electric (AEDC)", value: "abuja-electric" }
  ]
};
