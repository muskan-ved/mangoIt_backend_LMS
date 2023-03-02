
const stripe = require('stripe')('sk_test_51LkLlPLVp3cdDpUh7AUoQIdolBC7QY9JVlF5okcCNIER6wfF7dy5D1sk3sCW4Pqz50hPL6vlJP7YpOfYoJjKeJGQ00Kwtav4kX');
const jsonwebtoken = require('jsonwebtoken')


exports.createStripeCustomer = async (req, res) => {
  const token = req.headers.logintoken
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
  const email = decode.email
  const name = req.body.name


  try {
    const createCustomer = await stripe.customers.create({
      email: email,
      name: name
    })
    res.send(createCustomer)

  }
  catch (e) {
    res.status(500).json(e)
  }

}

exports.cardToken = async (req, res) => {

  const param = {}
  param.card = {
    number: 4242424242424242,
    exp_month: 11,
    exp_year: 2024,
    cvc: '212'
  }
  stripe.tokens.create(param, (err, token) => {
    if (token) {
      res.status(200).json(token)
    } else {
      res.status(400).json(err)
    }
  })


}

exports.createPayment = async (req, res) => {
  const token = req.headers.logintoken
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
  const email = decode.email
  const name = req.body.name


  try {
    const createCustomer = await stripe.customers.create({
      email: email,
      name: name
    })

    // res.json(createCustomer)
    // generate card token ---------------------------------

    const param = {}
    param.card = {
      number: 4242424242424242,
      exp_month: 11,
      exp_year: 2024,
      cvc: '212'
    }

    stripe.tokens.create(param, (err, token) => {
      if (token) {
        // create source to save card detail to stripe
        stripe.customers.createSource(createCustomer.id, { source: token.id }, async (err, card) => {
          if (card) {

            try {
              const chrg = await stripe.charges.create({
                description: "Pay Ammount With card",
                amount: 49000,
                currency: "usd",
                customer: createCustomer.id
              })

              res.json(chrg)
            }
            catch (e) {
              res.status(500).json(e)
            }

            // //create payment intent
            // const paymentIntent = await stripe.paymentIntents.create({
            //   description: "Pay Ammount With card",
            //   payment_method_types: ["card"],
            //   amount: 49000,
            //   currency: "usd",
            // });
            // // res.json(paymentIntent)
            // const conformpayment = await stripe.paymentIntents.confirm(
            //   paymentIntent.id,
            //   {
            //     payment_method: "pm_card_visa",
            //   }
            // );
            // // res.json(conformpayment)
            // if (conformpayment.status === "succeeded") {
            //   res.status(200).send(conformpayment);
            // } else {
            //   res.status(500).send("payment failed");
            // }


          } else {
            res.json(err)
          }
        })
        // res.json(token)
      } else {
        res.json(err)
      }
    })


  }
  catch (e) {
    res.status(500).json(e)
  }


}

// SecreteKey_sourabh = 'sk_test_51LkLlPLVp3cdDpUh7AUoQIdolBC7QY9JVlF5okcCNIER6wfF7dy5D1sk3sCW4Pqz50hPL6vlJP7YpOfYoJjKeJGQ00Kwtav4kX'
//SecreteKey_Devendra ='sk_test_51MgRB8SBnbzFc2sZ6es5bHJN6retmvTWZ9Bc4f75FUnxWcjIfmpS9Lpkm2Ot931hgaa12FwJNhwc3MBDk42CGqTJ00Quwwl8j8'