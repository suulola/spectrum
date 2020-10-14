


return new Promise((resolve) => {
    // resolve('loan.req.invalid');
    menu.session.get('data').then((bu) => {
        
        // console.log(cardAuth[0].cardName, 'account cards')
        console.log(Number(menu.val))

        if (bu.bvn !== '') {
            
            if ( Number(menu.val) >= (Number(dt.loanAmtFrom)/100) && Number(menu.val) <= (Number(dt.loanAmtTo)/100)) {
                console.log('am here')
                let tenor = 1 // FIXED TENOR FOR MICRO LOAN JUST FOR SPECTRUM
                let mgtPerc = 3 // FIXED management percentage JUST FOR SPECTRUM
                let paymentOffer = calcRecurringLoanAmount(menu.val, tenor, dt.interest, mgtPerc)
                let payload = {
                    paymentOffer: paymentOffer,
                    offer: dt,
                    amount: menu.val * 100,
                    transaction_desc: "Loan advice for Spectrum",
                    customer_ref: bu.mobile.substring(1),
                    firstname:bu.fName,
                    surname:bu.sName,
                    email: bu.email,
                    mobile_no: bu.mobile.substring(1),
                    scheme:'Spectrum',
                    xid:bu._id,
                    userFullname: bu.fName+' '+ bu.sName,
                    userMobile:bu.mobile,
                    userCode: bu.qrCode,
                    isOverdue:false,
                    hasPaid:false,
                    status:"Pending",
                    principal:menu.val * 100,
                    interest: paymentOffer.monthlyRepayments,
                    duration:tenor,
                    perc:dt.interest,
                    dueDate:"",
                    elapsedSn:"0",
                    account_name:cardChoice.cardName,
                    account_code:cardChoice.authCode,
                    account_no:cardChoice.accNo
                };
                requestloan(payload).then(
                    (res) => {

                        console.log(payload)
                        console.log(res, 'res data');
                        let text =
                            'Hi ' +
                            bu.fName +
                            ' ' +
                            bu.sName +
                            ' Your loan request was successfull. Please check your loan status or visit http://spectrumpay.com.ng/ for more information. Thank you';
                        message(text, menu.args.phoneNumber).then((res) => {
                            console.log(res, 'message res');
                            resolve('loan.response');
                        });
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            } else {
                resolve('loan.req.invalid');
            }
        } else {
            resolve('loan.bvn.error');
        }
    });
});