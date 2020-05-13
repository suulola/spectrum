const UssdMenu = require("ussd-menu-builder");
const { buddymenus } = require("./menus");

let menu = new UssdMenu();

const sessions = {};

module.exports = {
  config(app) {
    app.post("/", function (req, res) {
      let args = {
        phoneNumber: req.body.phoneNumber,
        sessionId: req.body.sessionId,
        serviceCode: req.body.serviceCode,
        text: req.body.text
      };

      menu.run(args, resMsg => {
        res.send(resMsg);
      });

      menu.on("error", err => {
        // handle errors
        res.status(400).send("An error occurred, try again later");
      });
    });

    buddymenus(menu);
  }
};
