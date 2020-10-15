const { fetchBalance } = require("./buddyFuctions");
const {
  checkIfUserExists,
} = require("./universalFuctions");

module.exports = {
  checkBalanceState(menu) {
    menu.state("checkBalance", {
      run: () => {
        return new Promise((resolve) => {
          checkIfUserExists(menu.args.phoneNumber).then(async (data) => {
            let userData = data.data[0]
            if (!userData.account) {
              menu.end("Contact Customer Care for Account Upgrade");
              return;
            }
            let account_number = userData.account.accountNumber;

            let bal = await fetchBalance(account_number);

            if (bal.data.status === true) {
              menu.con(
                `Your Account Balance is: N` + bal.data.data.Balance + "\n0. Back"
              );
            } else {
              menu.end("Please try again later");
            }

          })})
      },
      next: {
        0: "welcomeState",
      },
    });
  },
};
