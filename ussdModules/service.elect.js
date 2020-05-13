const {
  checkIfUserExists,
  preparePurchase,
  debitWallet,
  UpdateWallet
} = require("./universalFuctions");
const { ElecVendorSelect, ltElecPackageSelect, scheme } = require("./consts");
const { verifyElectricMeter, payBill } = require("./vtpass");
module.exports = {
  electServiceState(menu) {
    let selectedVendorIndex = "";
    let elecVendor = [];
    let elecPackage = [];
    let selectedPackageIndex = "";
    let meterNumber = "";
    let amount = "";
    let errMessage;
    let customersDetails;

    let lastPage = 0;
    let resp = [];
    let modelElecBills = {
      phone: "",
      serviceID: "",
      amount: "",
      variation_code: "",
      billersCode: ""
    };

    menu.state("services.bills.elect", {
      run: () => {
        ElecVendorSelect.map((vendor, index) => {
          elecVendor.push(index + 1 + "." + vendor.name);
        });
        menu.con("Please select an option: \n" + elecVendor.join("\n"));
      },
      next: {
        "*[1-9]": () => {
          return new Promise(resolve => {
            console.log(Number(menu.val) - 1);
            selectedVendorIndex = Number(menu.val) - 1;
            resolve("services.bills.getMeterNumber");
          });
        },
        "0": "services.bills"
      }
    });

    menu.state("services.bills.getMeterNumber", {
      run: () => {
        menu.con("Enter meter number \n1.Proceed  \n0.Back");
      },
      next: {
        "*[1-9]": () => {
          return new Promise(resolve => {
            // GET AND STORE THE ENTERED METER NUMBER
            meterNumber = menu.val;
            resolve("services.bills.getAmount");
          });
        },
        "0": "services"
      }
    });

    menu.state("services.bills.getAmount", {
      run: () => {
        menu.con("Enter amount");
      },
      next: {
        "*[1-9]": () => {
          return new Promise(resolve => {
            amount = menu.val;
            resolve("services.bills.getElecPackage");
          });
        },
        "0": "services"
      }
    });

    menu.state("services.bills.getElecPackage", {
      run: () => {
        elecPackage = [];
        ltElecPackageSelect.map((vendor, index) => {
          elecPackage.push(index + 1 + "." + vendor.name);
        });
        menu.con("Please select an option: \n" + elecPackage.join("\n"));
      },
      next: {
        "*[1-2]": () => {
          return new Promise(resolve => {
            selectedPackageIndex = menu.val - 1;
            console.log(ltElecPackageSelect[selectedPackageIndex]);
            console.log(ElecVendorSelect[selectedVendorIndex]);
            modelElecBills = {
              phone: menu.args.phoneNumber,
              serviceID: ElecVendorSelect[selectedVendorIndex].value,
              amount: amount,
              variation_code: ltElecPackageSelect[selectedPackageIndex].value,
              billersCode: meterNumber
            };
            console.log(modelElecBills, "BILL MODELS");
            verifyElectricMeter(modelElecBills)
              .then(res => {
                customersDetails = res.data.Success.content;
                if (res.data.Success.code === "000") {
                  resolve("services.bills.elecConfirm");
                } else {
                  errMessage = "Error please try again";
                  resolve("service.bills.elec.error");
                }
              })
              .catch(err => {
                console.log(err, " Error logged");
                errMessage = err.response.data.error;
                // resolve("services.bills.elecConfirm");
                resolve("service.bills.elec.error");
              });
          });
        }
      }
    });

    menu.state("services.bills.elecConfirm", {
      run: () => {
        menu.con(
          `Provider: ${ElecVendorSelect[
            selectedVendorIndex
          ].name.toUpperCase()} \nType: ${
          ltElecPackageSelect[selectedPackageIndex].name
          } \nAmount: ${amount} \n1.Proceed 0.Back`
        );
      },
      next: {
        "1": () => {
          return new Promise(resolve => {
            checkIfUserExists(menu.args.phoneNumber).then(val => {
              bu = val.data[0];
              console.log(JSON.stringify(bu), "user data");
              let walletCheck = preparePurchase(bu.wallet, amount);
              if (walletCheck.canProceed) {
                payBill(modelElecBills)
                  .then(val => {
                    console.log(val, "response from test payment");
                    bu["transaction"] = {
                      scheme: scheme,
                      amount: amount,
                      transferType: "phcn",
                      transferProvider: "BiziPay",
                      transferChannel: "ussd",
                      transactionData: {},
                      source: "Wallet",
                      destination: "VTPass",
                      narration:
                        "'" +
                        ltElecPackageSelect[selectedPackageIndex].value +
                        " payment (" +
                        ltElecPackageSelect[selectedPackageIndex].name +
                        ") to account: " +
                        meterNumber,
                      state: "complete",
                      isCredit: false,
                      beneficiaryInfo: {
                        _id: bu._id,
                        fullname: bu.fName + " " + bu.sName,
                        mobile: bu.mobile,
                        qrCode: bu.qrCode,
                        imageUrl: bu.imageUrl
                      }
                    };
                    bu["wallet"] = debitWallet(
                      walletCheck.wallet,
                      amount * 100
                    );

                    UpdateWallet(bu).then(updateRes => {
                      console.log("======================================");
                      console.log(updateRes);

                      resolve("service.bill.cableSuccess");
                    });
                  })
                  .catch(err => {
                    errMessage = err.response.data.Failed;
                    console.log(err, "error from response");
                    resolve("service.bills.elec.error");
                  });
              } else {
                resolve("service.bills.lowBalance");
              }
              // console.log(val.data[0].wallet.balance / 100);
              // if (
              //   val.data[0].wallet.balance / 100 <=
              //   Number(modelElecBills.amount)
              // ) {
              //   resolve("service.bills.lowBalance");
              // } else if (
              //   val.data[0].wallet.balance / 100 >=
              //   Number(modelElecBills.amount)
              // ) {
              //   payBill(modelElecBills)
              //     .then(val => {
              //       console.log(
              //         JSON.stringify(val),
              //         "response from test payment"
              //       );
              //       resolve("service.bill.cableSuccess");
              //     })
              //     .catch(err => {
              //       errMessage = err.response.data.Failed;
              //       console.log(err, "error from response");
              //       resolve("service.bills.chargeRes");
              //     });
              // }
            });
          });
        }
      }
    });

    menu.state("service.bills.elec.error", {
      run: () => {
        console.log(errMessage);
        menu.end(errMessage);
      }
    });
  }
};
