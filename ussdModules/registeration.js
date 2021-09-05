const { textfunc, registerUser, message, scheme } = require('./buddyFuctions')

module.exports = {
  RegisterUser (menu) {
    let sessions = {}
    let registrationModel = {}

    menu.sessionConfig({
      get: function (sessionId, key) {
        return new Promise((resolve, reject) => {
          let value = sessions[sessionId][key]
          resolve(value)
        })
      },

      set: (sessionId, key, value, callback) => {
        // store key-value pair in current session
        sessions[sessionId][key] = value
        callback()
      },
      start: (sessionId, callback) => {
        // initialize current session if it doesn't exist
        // this is called by menu.run()
        registrationModel[menu.args.phoneNumber] = {}
        if (!(sessionId in sessions)) sessions[sessionId] = {}
        callback()
      },
      end: (sessionId, callback) => {
        // clear current session
        // this is called by menu.end()
        delete sessions[sessionId]
        callback()
      }
    })

    menu.state('help', {
      run: () => {
        menu.end(
          'Thanks for contacting SpectrumMFB. Visit http://spectrumpay.com.ng/ for further instructions'
        )
      }
    })

    menu.state('reg', {
      run: () => {
        menu.con('Welcome, Enter First name')
      },
      next: {
        '*[a-zA-Z]+': () => {
          return new Promise(resolve => {
            console.log(
              'saving first name ',
              menu.val,
              registrationModel[menu.args.phoneNumber]
            )
            if (typeof menu.val === 'string' && menu.val.length > 0) {
              registrationModel[menu.args.phoneNumber].fName = menu.val
              // menu.session.set("fName", menu.val);
              resolve('reg.lName')
            }
          })
        }
      }
    })

    menu.state('reg.lName', {
      run: () => {
        menu.con('Enter your Surname')
      },
      next: {
        '*[a-zA-Z]+': () => {
          console.log('saving last name ', menu.val)
          return new Promise(resolve => {
            if (typeof menu.val === 'string' && menu.val.length > 0) {
              // menu.session.set("sName", menu.val);
              registrationModel[menu.args.phoneNumber].sName = menu.val
              resolve('reg.Email')
            }
          })
        }
      }
    })
    menu.state('reg.Email', {
      run: () => {
        menu.con('Enter your email address')
      },
      next: {
        '*[a-zA-Z]+': () => {
          return new Promise(resolve => {
            // var re = /\S+@\S+\.\S+/;
            if (menu.val.length > 0) {
              registrationModel[menu.args.phoneNumber].email = menu.val
              // menu.session.set("email", menu.val);
              resolve('reg.Username')
            } else {
              resolve('reg.Email')
            }
          })
        }
      }
    })

    menu.state('reg.Username', {
      run: () => {
        menu.con('Enter your preferred username')
      },
      next: {
        '*[a-zA-Z]+': () => {
          console.log('saving username ', menu.val)
          return new Promise(resolve => {
            if (typeof menu.val === 'string' && menu.val.length > 0) {
              // menu.session.set("sName", menu.val);
              registrationModel[menu.args.phoneNumber].username = menu.val
              resolve('reg.Pin')
            }
          })
        }
      }
    })

    menu.state('reg.Pin', {
      run: () => {
        menu.con('Please select/enter a six (6) digit* PIN')
      },

      next: {
        '*[0-9]': () => {
          return new Promise(resolve => {
            if (menu.val.length === 6) {
              registrationModel[menu.args.phoneNumber].pin1 = menu.val
              // menu.session.set("pin1", menu.val);
              resolve('reg.ConfirmPin')
            } else {
              resolve('inValid.Pin')
            }
          })
        }
      }
    })

    menu.state('inValid.Pin', {
      run: () => {
        menu.con('PIN must be 6 digits!\n Pleae enter a valid PIN')
      },
      next: {
        '*[0-9]': () => {
          return new Promise(resolve => {
            if (menu.val.length === 6) {
              // menu.session.set("pin1", menu.val);
              registrationModel[menu.args.phoneNumber].pin1 = menu.val
              resolve('reg.ConfirmPin')
            } else {
              resolve('inValid.Pin')
            }
          })
        }
      }
    })

    menu.state('reg.ConfirmPin', {
      run: () => {
        menu.con('Please Confirm PIN ')
      },

      next: {
        '*[0-9]': () => {
          return new Promise(async (resolve, reject) => {
            const firstPin = registrationModel[menu.args.phoneNumber].pin1
            if (firstPin === menu.val) {
              // menu.session.set("confirmPin", menu.val);
              registrationModel[menu.args.phoneNumber].confirmPin = menu.val

              resolve('check')
            } else {
              resolve('pin.misMatch')
            }
          })
        }
      }
    })

    menu.state('pin.misMatch', {
      run: () => {
        menu.con('PIN does not match!\n please confirm again')
      },

      next: {
        '*[0-9]': () => {
          return new Promise(async (resolve, reject) => {
            const firstPin = registrationModel[menu.args.phoneNumber].pin1
            console.log(
              firstPin,
              '*******first pin*****',
              registrationModel[menu.args.phoneNumber]
            )
            if (firstPin === menu.val) {
              registrationModel[menu.args.phoneNumber].confirmPin = menu.val
              // menu.session.set("confirmPin", menu.val);
              resolve('check')
            } else {
              resolve('pin.misMatch')
            }
          })
        }
      }
    })

    menu.state('check', {
      run: () => {
        console.log(registrationModel[menu.args.phoneNumber])
        menu.con(
          `${registrationModel[menu.args.phoneNumber].fName} ${
            registrationModel[menu.args.phoneNumber].sName
          }, ${registrationModel[menu.args.phoneNumber].username}, ${
            registrationModel[menu.args.phoneNumber].email
          }, 
            ${
              registrationModel[menu.args.phoneNumber].pin1
            }, \nPress 1 to confirm`
        )
      },
      next: {
        1: 'register.User'
        // 2: "loan",
      }
    })

    menu.state('register.User', {
      run: () => {
        // textfunc(sessions[menu.args.sessionId], menu.args.phoneNumber);
        return new Promise(resolve => {
          console.log(
            registrationModel[menu.args.phoneNumber],
            'final registration model'
          )
          if (!registrationModel[menu.args.phoneNumber].email.includes('@')) {
            registrationModel[menu.args.phoneNumber].email = `${
              registrationModel[menu.args.phoneNumber].email
            }@invalid.com`
          }
          registerUser(
            { ...registrationModel[menu.args.phoneNumber] },
            menu.args.phoneNumber
          ).then(
            async res => {
              console.log('******************')
              console.log(res)
              console.log('******************')
              if (res.status === true) {
                await message(res.message, menu.args.phoneNumber)
                resolve(
                  menu.end(
                    `Registration was successful. \n Your account Number is ${00001}`
                  )
                )
              } else {
                resolve(menu.end(res.message))
              }
            },
            err => {
              console.log(err, 'this is the error')
              resolve(menu.end(' Error !!!'))
            }
          )
        })
      },
      next: {
        1: ''
      }
    })
  }
}
