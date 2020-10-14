const {
  pager,
  checkIfUserExists,
  preparePurchase,
  debitWallet,
  UpdateWallet,
} = require("./universalFuctions");
const { TvVendorSelect, scheme } = require("./consts");
const { getVariations, verifySmartcard, payBill } = require("./vtpass");

module.exports = {
  serviceCableState(menu) {
    let errMessage = "";
    let cablePackage = [];
    let selectedBillType;
    let tvVendors = [];
    let pack = [];
    let billerCode = "";
    let lastPage = 0;
    let resp = [];
    let bu;
    let obj;

    let modelCableBills = {
      phone: "",
      serviceID: "",
      amount: "",
      variation_code: "",
      billersCode: "",
    };
    let pagerObj = {
      page: 0,
      pageSize: 7,
    };

    menu.state("services.bills.cable", {
      run: () => {
        tvVendors = [];
        // console.log(TvVendorSelect, "sasdadaad");
        TvVendorSelect.map((vendor, index) => {
          tvVendors.push(index + 1 + "." + vendor.name);
        });
        menu.con("Please select an option: \n" + tvVendors.join("\n"));
      },
      next: {
        "*[1-9]": () => {
          return new Promise((resolve) => {
            cablePackage = [];
            pack = [];
            selectedBillType = menu.val;
            getVariations(
              TvVendorSelect[Number(selectedBillType) - 1].value
            ).then((res) => {
              res.data.content.varations.forEach((res, index) => {
                // console.log(res);
                cablePackage.push(res);
                pack.push(res.name);
              });
              resolve("services.bills.getCardNumber");
            });
          });
        },
        0: "services",
      },
    });

    menu.state("services.bills.getCardNumber", {
      run: () => {
        menu.con("Enter card number \n1.Proceed  \n0.Back");
      },
      next: {
        "*[1-9]": () => {
          return new Promise((resolve) => {
            billerCode = menu.val;
            resolve("services.bills.getCablePackage");
          });
        },
        0: "services",
      },
    });

    menu.state("services.bills.getCablePackage", {
      run: () => {
        let joiner = [];

        lastPage = Math.round(pack.length / pagerObj.pageSize) - 1;

        // pagerObj.page = pagerObj.page;
        resp = pager(pagerObj, pack);

        resp.forEach((res, index) => {
          joiner.push(index + 1 + "." + res);
        });
        console.log(pack, "pack");
        if (pagerObj.page === lastPage) {
          menu.con(joiner.join("\n") + `\n0. Back \n00.MainMenu`);
        } else {
          menu.con(
            joiner.join("\n") +
              `\n${resp.length + 1}. More \n0. Back \n00.MainMenu`
          );
        }
      },
      next: {
        "*[1-9]": () => {
          return new Promise((resolve) => {
            let userInput = Number(menu.val);
            if (pagerObj.page !== lastPage) {
              if (userInput === resp.length + 1) {
                pagerObj.page = pagerObj.page + 1;
                resolve("services.bills.billers.package");
              } else {
                let index = cablePackage.findIndex(
                  (i) => i.name === resp[menu.val]
                );
                obj = cablePackage[index - 1];
                console.log(JSON.stringify(obj), "OBJ");
                modelCableBills = {
                  phone: menu.args.phoneNumber,
                  serviceID: TvVendorSelect[Number(selectedBillType) - 1].value,
                  amount: obj.variation_amount,
                  variation_code: obj.variation_code,
                  billersCode: billerCode,
                };
                console.log(JSON.stringify(modelCableBills), "modelCable");
                verifySmartcard(modelCableBills)
                  .then((res) => {
                    console.log(res.data.Success.content, "response");
                    if (res.data.Success.code === "000") {
                      console.log("successful ===========");
                      resolve("service.bills.confirmPay");
                    } else {
                      errMessage = "Error, Please try again later";
                      resolve("service.bills.cableError");
                    }
                  })
                  .catch((err) => {
                    console.log(err, "error");
                    errMessage = err.response.data.error;
                    resolve("service.bills.cableError");
                    // resolve("service.bills.confirmPay");
                  });
                // console.log(modelCableBills, "not on the last page");
              }
            } else {
              let index = cablePackage.findIndex(
                (i) => i.name === resp[menu.val]
              );
              obj = cablePackage[index - 1];
              console.log(JSON.stringify(obj), "OBJ");
              modelCableBills = {
                phone: menu.args.phoneNumber,
                serviceID: TvVendorSelect[Number(selectedBillType) - 1].value,
                amount: obj.variation_amount,
                variation_code: obj.variation_code,
                billersCode: billerCode,
              };
              console.log(JSON.stringify(modelCableBills), "modelCable");
              verifySmartcard(modelCableBills)
                .then((res) => {
                  if (res.code == "000") {
                    if (!res.content.error) {
                      resolve("service.bills.confirmPay");
                    } else {
                      // errMessage = "Error, Please try again later";
                      resolve("service.bills.cableError");
                    }
                  }
                })
                .catch((err) => {
                  // console.log(err);
                  errMessage = err.response.data.error;
                  resolve("service.bills.cableError");

                  // resolve("service.bills.confirmPay");
                });
              // console.log(modelCableBills, "not on the last page");
            }
          });
        },
        0: "",
        "00": "",
      },
    });

    menu.state("service.bills.cableError", {
      run: () => {
        console.log(errMessage);
        menu.con(errMessage);
      },
    });
    menu.state("service.bills.confirmPay", {
      run: () => {
        console.log(modelCableBills);
        menu.con(
          `Type: ${modelCableBills.serviceID.toUpperCase()} \n Package: ${
            modelCableBills.variation_code
          } \n Amount: ${modelCableBills.amount} \n1.Proceed \n0.Back`
        );
      },
      next: {
        1: () => {
          return new Promise((resolve) => {
            checkIfUserExists(menu.args.phoneNumber).then(async (val) => {
              bu = val.data[0];
              console.log(JSON.stringify(bu), "user data");
              if (!data.data[0].account) {
                menu.end("Contact Customer Care for Account Upgrade");
                return;
              }
              let account_number = data.data[0].account.accountNumber;

              // let walletCheck = await preparePurchase(
              //   account_number,
              //   obj.variation_amount * 100
              // );
              modelCableBills.account_number = account_number;
              modelCableBills.mobile = bu.mobile;

              // if (walletCheck.canProceed) {
                payBill(modelCableBills)
                  .then((val) => {
                    if(val.data.status === false) {
                     menu.end(val.data.message || 'Transaction Failed');
                     return;
                    }
                    console.log(val, "response from test payment");
                    bu["transaction"] = {
                      scheme: scheme,
                      amount: obj.variation_amount * 100,
                      transferType: "cableTv",
                      transferProvider: "Spectrum",
                      transferChannel: "ussd",
                      transactionData: {},
                      source: "Account",
                      destination: "VTPass",
                      narration:
                        obj.variation_code +
                        " payment (" +
                        TvVendorSelect[Number(selectedBillType) - 1].value +
                        ") to account: " +
                        billerCode,
                      state: "complete",
                      isCredit: false,
                      beneficiaryInfo: {
                        _id: bu._id,
                        fullname: bu.fName + " " + bu.sName,
                        mobile: bu.mobile,
                        qrCode: bu.qrCode,
                        imageUrl: bu.imageUrl,
                      },
                    };

                    UpdateWallet(bu).then((updateRes) => {
                      resolve("service.bill.cableSuccess");
                    });
                  })
                  .catch((err) => {
                    errMessage = err.response.data.Failed;
                    console.log(err, "error from response");
                    menu.end("Transaction Successful");
                    // resolve("service.bills.chargeRes");
                  });
              // } else {
              //   resolve("service.bills.lowBalance");
              // }

              // console.log(val.data[0].wallet.balance / 100);
              // if (
              //   val.data[0].wallet.balance / 100 <
              //   Number(modelCableBills.amount)
              // ) {
              //   resolve("service.bills.lowBalance");
              // } else if (
              //   val.data[0].wallet.balance / 100 >=
              //   Number(modelCableBills.amount)
              // ) {
              //   payBill(modelCableBills)
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
        },
        0: "services",
      },
    });

    menu.state("service.bills.lowBalance", {
      run: () => {
        menu.end("insufficient balance !!! Please fund your wallet.");
      },
    });

    menu.state("service.bills.failedTransaction", {
      run: () => {
        console.log('got to fail', errMessage)
        menu.end(errMessage);
      },
    });

    menu.state("service.bills.chargeRes", {
      run: () => {
        menu.end(errMessage);
      },
    });

    menu.state("service.bill.cableSuccess", {
      run: () => {
        menu.end("Transaction successful");
      },
    });
  },
};
