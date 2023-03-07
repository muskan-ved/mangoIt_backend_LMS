const db = require('../models/index.model')
const Payment = db.Payment
const Token = db.Token
const User = db.User
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRETE_KEY);
const jsonwebtoken = require('jsonwebtoken')


exports.createPayment = async (req, res) => {

  const token = req.headers.logintoken
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
  const email = decode.email
  const user_id = decode.id
  const {
    name,
    description,
    amount,
    currency,
    number,
    exp_month,
    exp_year,
    cvc,
    key,
  } = req.body

  const idempotencyKey = uuidv4()

  try {
    const createCustomer = await stripe.customers.create({
      email: email,
      name: name
    })
    // res.json(createCustomer)

    // generate card token ---------------------------------


    if (createCustomer) {
      const cardTokenGen = await stripe.tokens.create({
        card: {
          number,
          exp_month,
          exp_year,
          cvc,
        }
      })
      // console.log(cardTokenGen.card.exp_year)

      if (cardTokenGen) {

        // res.json(tokenData)

        // create source to save card detail to stripe
        const card = await stripe.customers.createSource(createCustomer.id, { source: cardTokenGen.id })

        if (card) {
          try {
            const customerPayment = await stripe.charges.create({
              description: description,
              amount: amount * 100,
              currency: currency,
              customer: createCustomer.id,
            }, { idempotencyKey })

            if (customerPayment) {
              const createPayment = await Payment.create({
                user_id: user_id,
                token: cardTokenGen.id
              })
              // console.log(createPayment.id)

              if (createPayment) {
                const tokenData = await Token.create({
                  token_id: createPayment.id,
                  key,
                  value: cardTokenGen.card.exp_year
                })
              }

            }


            res.json(customerPayment)
          }
          catch (e) {
            res.status(500).json(e)
          }
        }

        // res.send(card)
      }
    }

  }
  catch (e) {
    res.status(500).json(e)
  }

}


exports.getStripeCustomer = async (req, res) => {
  try {
    const stripeCustomerId = req.params.id
    const getStipeCustomer = await stripe.customers.retrieve(stripeCustomerId)
    res.status(200).json(getStipeCustomer)
  }
  catch (e) {
    res.status(500).json(e)
  }
}


exports.updateStripeCustomer = async (req, res) => {

  const token = req.headers.logintoken
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
  const email = decode.email
  const {
    name,
    description,
  } = req.body

  try {

    const stripeCustomerId = req.params.id
    const customer = await stripe.customers.update(
      stripeCustomerId,
      {
        name,
        description,
      }
    )
    res.json(customer)

  }
  catch (e) {
    res.status(500).json(e)
  }
}



exports.deleteStripeCustomer = async (req, res) => {
  try {
    const stripeCustomerId = req.params.id
    const deleteStripecustomer = await stripe.customers.del(stripeCustomerId)
    res.status(200).json(deleteStripecustomer)
  }
  catch (e) {
    res.status(500).json(e)
  }
}

exports.cardToken = async (req, res) => {
  const cardTokenGen = await stripe.tokens.create({
    card: {
      number: '4242424242424242',
      exp_month: 3,
      exp_year: 2024,
      cvc: '314',
    }
  })
  res.status(200).json(cardTokenGen)
}


// SecreteKey_sourabh = 'sk_test_51LkLlPLVp3cdDpUh7AUoQIdolBC7QY9JVlF5okcCNIER6wfF7dy5D1sk3sCW4Pqz50hPL6vlJP7YpOfYoJjKeJGQ00Kwtav4kX'
//SecreteKey_Devendra ='sk_test_51MgRB8SBnbzFc2sZ6es5bHJN6retmvTWZ9Bc4f75FUnxWcjIfmpS9Lpkm2Ot931hgaa12FwJNhwc3MBDk42CGqTJ00Quwwl8j8'  


