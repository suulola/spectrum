const { networkProviders } = require("./consts");
const {
  checkIfUserExists,
  UpdateWallet,
  debitWallet,
  preparePurchase
} = require("./universalFuctions");
const { payBill } = require("./vtpass");
const { scheme } = require("./consts");

module.exports = {
  serviceAirtimeState(menu) {
    let selectedNetworkProvideIndex = "";
    let amount = "";
    let bu;
    let airtimeMes = "";
    menu.state("service.airtime", {
      run: () => {
        let joiner = [];
        networkProviders.map((provider, index) => {
          joiner.push(`${index + 1}.${provider.name}`);
        });
        menu.con(joiner.join("\n"));
      },
      next: {
        "*[1-4]": () => {
          return new Promise(resolve => {
            selectedNetworkProvideIndex = menu.val - 1;
            resolve("service.airtime.amt");
          });
        },
        "0": "services"
      }
    });
    menu.state("service.airtime.amt", {
      run: () => {
        menu.con("Please enter amount:");
      },
      next: {
        "*[1-9]": () => {
          return new Promise(resolve => {
            amount = menu.val;
            resolve("service.airtime.getphone");
          });
        },
        "0": "services"
      }
    });

    menu.state("service.airtime.getphone", {
      run: () => {
        menu.con('Enter phone number:')
      },
      next: {
        '*[1-9]': () => {
          phone = menu.val
          return 'services.airtime.confir'
        },
        '0': 'services'
      }
    })

    menu.state("services.airtime.confir", {
      run: () => {
        menu.con(
          `Confirm: ${networkProviders[selectedNetworkProvideIndex].name} Amount:N${amount} \n Press 1 to proceed \n0. Back`
        );
      },
      next: {
        "1": () => {
          return new Promise(resolve => {
            checkIfUserExists(menu.args.phoneNumber).then(data => {
              bu = data.data[0];

              let walletCheck = preparePurchase(bu.wallet, amount);
              //   console.log(walletCheck);
              if (walletCheck.canProceed) {
                console.log("Processing Airtime");
                let model = {
                  phone: phone,
                  serviceID:
                    networkProviders[selectedNetworkProvideIndex].value,
                  amount: amount
                };
                console.log(model);
                payBill(model)
                  .then(res => {
                    console.log(res, res);
                    if (res.data.Success == "TRANSACTION SUCCESSFUL") {
                      airtimeMes = res.data.Success;
                      console.log(
                        "Airtime res: " + JSON.stringify(res.data.Success)
                      );
                      bu["transaction"] = {
                        scheme: scheme,
                        amount: amount,
                        transferType: "airtime",
                        transferProvider: "BiziPay",
                        transferChannel: "ussd",
                        transactionData: {},
                        source: "Wallet",
                        destination: "VTPass",
                        narration:
                          networkProviders[selectedNetworkProvideIndex].value +
                          " Airtime VTU to: " + phone,
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
                      //   bu.wallet.balance = 0;
                      //   bu.wallet.ledger_balance = 0;
                      //   bu.wallet.transaction_funds = 0;
                      //   console.log("Airtime BU: " + JSON.stringify(bu));
                      UpdateWallet(bu).then(updateRes => {
                        console.log("======================================");
                        console.log(updateRes);
                        // if (updateRes) {
                        //   delete bu["transaction"];
                        // }
                        airtimeMes = 'transaction successful';
                        resolve("service.airtime.mes");
                      });
                    } else if (res.data.Failed) {
                      airtimeMes = res.data.Failed;
                      resolve("service.airtime.mes");
                    }
                  })
                  .catch(err => {
                    console.log(err);
                    airtimeMes = err.response.data.Failed;
                    resolve("service.airtime.mes");
                  });
                // console.log(JSON.stringify(model), "model");
              } else {
                resolve("service.bills.lowBalance");
              }
            });
          });
        },
        "0": ""
      }
    });

    menu.state("service.airtime.mes", {
      run: () => {
        menu.end(airtimeMes);
      }
    });
  }
};
