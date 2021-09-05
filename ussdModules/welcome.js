const { verifyPin, scheme } = require("./buddyFuctions");
const { STATE } = require("../store/store");

module.exports = {
  setBaseUser: [],
  welcomeState(menu) {
    menu.state("welcomeState", {
      run: () => {
        menu.session.get("loginStatus").then((status) => {
          if (status) {
            menu.con(
              "Welcome to SpectrumMFB . Choose an option " +
                "\n1. Airtime \n2. Check balance \n3. Fund Account \n4. Services \n5. Referrals  \n6. Loans \n0. Exit "
            );
          } else {
            verifyPin(menu.val, menu.args.phoneNumber)
              .then((val) => {
                menu.session.set("data", val.data.data);

                this.setBaseUser = val.data.data;
                STATE.data = val.data.data;

                if (val.data.status) {
                  menu.session.set("loginStatus", "isLogedIn");
                  menu.session.set(
                    "accountNumber",
                    val.data.data.account.accountNumber
                  );

                  menu.con(
                    "Welcome to SpectrumMFB. Choose an option " +
                      "\n1. Airtime \n2. Check Balance  \n3. Fund Account \n4. Services \n5. Referrals \n6. Loans \n0. Exit"
                  );
                } else {
                  menu.session.set("loginStatus", "");
                  menu.con("Please login again. Enter a valid PIN");
                }
              })
              .catch((err) => {
                menu.con("Please login again. Enter a valid PIN");
              });
          }
        });
      },
      next: {
        1: "service.airtime",
        2: "checkBalance",
        3: "fundWalletState",
        4: "services",
        5: "referal",
        6: "loan",
        0: "exit",
        "*[1-9]": "welcomeState",
      },
    });

    menu.state("exit", {
      run: () => {
        menu.session.set("loginStatus", "").then((val) => {
          menu.end("Thanks for using SpectrumMFB");
        });
      },
    });
  },
};
