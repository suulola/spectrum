const { verifyUser, textfunc, message, scheme } = require("./buddyFuctions");

module.exports = {
  referalState(menu) {
    menu.state("referal", {
      run: () => {
        menu.con(`Refer a friend \n Enter your friend\'s number:`);
      },
      next: {
        "*[0-9]": () => {
          return new Promise((resolve, reject) => {
            menu.session.get("data").then((val) => {
              // console.log(val, "***************");
              let text =
                "Your friend " +
                val.fName +
                " " +
                val.sName +
                " has invited you to use SpectrumMFB" +
                ".\nPlease visit http://spectrumpay.com.ng/ and start earning!!\n" +
                "Use 0" +
                val.mobile.slice(4) +
                "  as your referral code. \n" +
                "Regards, The SpectrumMFB Team";

                
              let phoneNumber = "+234" + menu.val.substring(1);
              message(text, phoneNumber)
                .then((res) => {
                  resolve("referal.status");
                })
                .catch((err) => {
                  console.log(err, "err");
                  resolve("referal.error");
                });
            });
          });
        },
        0: "welcome",
      },
    });
    menu.state("referal.status", {
      run: () => {
        menu.con("Sent. Thank you \n Press 0 to go back");
      },
      Next: {
        0: "welcome",
      },
    });

    menu.state("referal.error", {
      run: () => {
        menu.con("Error!!!, Please check input \n Press 0 to go back");
      },
      Next: {
        0: "welcome",
      },
    });
  },
};
