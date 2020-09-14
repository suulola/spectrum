const { networkProviders } = require("./consts");
const {
  checkIfUserExists,
  UpdateWallet,
  debitWallet,
  preparePurchase,
  pager,
} = require("./universalFuctions");
const { payBill, getVariations } = require("./vtpass");
const { scheme } = require("./consts");

module.exports = {
  serviceDataState(menu) {
    let selectedNetworkProvideIndex;
    let selectedVarationIndex = "";
    let amount = "";
    let bu;
    let airtimeMes = "";
    let dataVariation;
    let lastPage = "";
    let phone = "";
    let resp = [];
    let obj;

    let varations = [];
    let pagerObj = {
      page: 0,
      pageSize: 5,
    };

    menu.state("service.data", {
      run: () => {
        let joiner = [];
        networkProviders.map((provider, index) => {
          joiner.push(`${index + 1}.${provider.name}`);
        });
        menu.con(`${joiner.join("\n")} \n0.Back`);
      },
      next: {
        "*[1-4]": () => {
          return new Promise((resolve) => {
            selectedNetworkProvideIndex = menu.val - 1;
            getVariations(
              networkProviders[selectedNetworkProvideIndex].value + "-data"
            ).then((data) => {
              dataVariation = data.data.content.varations;
              //   console.log(dataVariation.content.varations);
              resolve("service.data.phone");
            });
          });
        },
        0: "services",
      },
    });

    menu.state("service.data.phone", {
      run: () => {
        menu.con("Enter Phone number" + "\n0.Back");
      },
      next: {
        "*[0-9]": () => {
          phone = menu.val;
          return "service.data.package";
        },
        0: "services",
      },
    });
    menu.state("service.data.package", {
      run: () => {
        console.log(dataVariation, "data varaition");
        let joiner = [];
        let dtVariation = [];
        lastPage = Math.round(dataVariation.length / pagerObj.pageSize) - 1;

        // pagerObj.page = pagerObj.page;
        dataVariation.forEach((data, index) => {
          dtVariation.push(data.name);
        });
        resp = pager(pagerObj, dtVariation);

        resp.forEach((res, index) => {
          joiner.push(index + 1 + "." + res);
        });

        if (pagerObj.page === lastPage) {
          menu.con(joiner.join("\n") + `\n0. Back \n00.MainMenu`);
        } else {
          menu.con(
            joiner.join("\n") +
              `\n${resp.length + 1}. More \n0. Back \n00.MainMenu`
          );
        }

        // menu.con(joiner.join("\n") + "\n0.Back");
      },
      next: {
        "*[1-6]": () => {
          return new Promise((resolve) => {
            console.log(resp, "resp");
            let userInput = Number(menu.val);
            if (pagerObj.page !== lastPage) {
              if (userInput === resp.length + 1) {
                pagerObj.page = pagerObj.page + 1;
                resolve("service.data.package");
              } else {
                console.log(resp[menu.val - 1], "value checked");
                let index = dataVariation.findIndex(
                  (i) => i.name === resp[menu.val]
                );
                console.log(index);
                obj = dataVariation[index - 1];
                console.log(obj, "OBJ");
                resolve("services.airtime.confirm");
              }
            } else {
              console.log(resp[menu.val - 1], "value checked");
              let index = dataVariation.findIndex(
                (i) => i.name === resp[menu.val]
              );
              console.log(index);
              obj = dataVariation[index - 1];
              console.log(obj, "OBJ");
              console.log("here");
              resolve("services.airtime.confirm");
            }

            // selectedVarationIndex = menu.val - 1;
            // resolve("services.airtime.confirm");
          });
        },
        0: "services",
      },
    });

    menu.state("services.airtime.confirm", {
      run: () => {
        menu.con(
          `Confirm: ${obj.name} Amount:N${obj.variation_amount} \n Press 1 to proceed \n0. Back`
        );
      },
      next: {
        1: () => {
          return new Promise((resolve) => {
            checkIfUserExists(menu.args.phoneNumber).then( async(data) => {
              bu = data.data[0];

              if (!data.data[0].account) {
                menu.end("Contact Customer Care for Account Upgrade");
                return;
              }
              let account_number = data.data[0].account.accountNumber;

              let walletCheck = await preparePurchase(
                account_number,
                obj.variation_amount * 100
              );

              console.log(walletCheck.canProceed)

              if (walletCheck.canProceed === true) {
                console.log("Processing Airtime");

                let model = {
                  phone: phone,
                  serviceID: `${networkProviders[selectedNetworkProvideIndex].value}-data`,
                  billerCode: phone,
                  variation_code: obj.variation_code,
                };
                console.log(model);
                payBill(model)
                  .then((res) => {
                    console.log(res, res);
                    if (res.data.Success == "TRANSACTION SUCCESSFUL") {
                      airtimeMes = res.data.Success;
                      console.log(
                        "Airtime res: " + JSON.stringify(res.data.Success)
                      );
                      bu["transaction"] = {
                        scheme: scheme,
                        amount: obj.variation_amount,
                        transferType: "airtimeData",
                        transferProvider: "Specqtrum",
                        transferChannel: "ussd",
                        transactionData: {},
                        source: "Account",
                        destination: "VTPass",
                        narration:
                          networkProviders[selectedNetworkProvideIndex].value +
                          obj.variation_code +
                          "Airtime Data to: " +
                          phone,
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

                      // bu["wallet"] = debitWallet(
                      //   walletCheck.wallet,
                      //   obj.variation_amount * 100
                      // );
                      //   bu.wallet.balance = 0;
                      //   bu.wallet.ledger_balance = 0;
                      //   bu.wallet.transaction_funds = 0;
                      //   console.log("Airtime BU: " + JSON.stringify(bu));
                      UpdateWallet(bu).then((updateRes) => {
                        console.log("======================================");
                        console.log(updateRes);
                        // if (updateRes) {
                        //   delete bu["transaction"];
                        // }
                        resolve("service.airtime.mes");
                      });
                    } else if (res.data.Failed) {
                      airtimeMes = res.data.Failed;
                      resolve("service.airtime.mes");
                    }
                  })
                  .catch((err) => {
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
        0: "",
      },
    });

    menu.state("service.airtime.mes", {
      run: () => {
        menu.end(airtimeMes);
      },
    });
  },
};
