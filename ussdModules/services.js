const { bills } = require("./consts");
const { electServiceState } = require("./service.elect");
const { serviceCableState } = require("./service.cable");
const { serviceAirtimeState } = require("./service.airtime");
const { serviceDataState } = require("./service.buydata");
module.exports = {
  servicesState(menu) {
    let selectBill = [];
    menu.state("services", {
      run: () => {
        menu.con("Please select an option \n1.Pay Bills  \n0.Back");
      },
      next: {
        1: "services.bills",
        // "2": "transfer",
        0: "welcomeState",
      },
    });

    menu.state("services.bills", {
      run: () => {
        selectBill = [];
        bills.map((bill, index) => {
          selectBill.push(index + 1 + "." + bill);
        });
        menu.con(
          "Please select an option: \n" +
            selectBill.join("\n") +
            "\n3.Buy Airtime" +
            "\n4.Buy Data"
        );
      },
      next: {
        "*[1-2]": () => {
          return new Promise((resolve) => {
            if (Number(menu.val) === 1) {
              selectedBillType = menu.val;
              resolve("services.bills.cable");
            } else {
              selectedBillType = Number(menu.val);
              resolve("services.bills.elect");
            }
          });
        },
        3: "service.airtime",
        4: "service.data",
        0: "services",
      },
    });

    // menu.state("transfer", {
    //   run: () => {}
    // })
    serviceCableState(menu);
    electServiceState(menu);
    serviceAirtimeState(menu);
    serviceDataState(menu);
  },
};
