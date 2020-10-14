const { fetchBalance } = require("./buddyFuctions");

module.exports = {
  checkBalanceState(menu) {
    menu.state("checkBalance", {
      run: () => {
        menu.session.get("accountNumber").then(async (acc) => {
          if (!acc) {
            menu.end("Contact Customer Care for Account Upgrade");
            return;
          }
          console.log("accc", acc);
          let bal = await fetchBalance(acc);
          console.log("*******", bal);
          if (bal.data.status === true) {
            menu.con(
              `Your Account Balance is: N` + bal.data.data.Balance + "\n0. Back"
            );
          } else {
            menu.end("Please try again later");
          }
        });
      },
      next: {
        0: "welcomeState",
      },
    });
  },
};
