require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRETE_KEY);
const jsonwebtoken = require('jsonwebtoken')


exports.createPayment = async (req, res) => {

  const token = req.headers.logintoken
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
  const email = decode.email
  const {
    name,
    description,
    amount,
    currency,
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
          number: '4242424242424242',
          exp_month: 3,
          exp_year: 2024,
          cvc: '314',
        }
      })
      // res.json(cardTokenGen)

      if (cardTokenGen) {
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


// exports.updateStripeCustomer = async (req, res) => {
//   const stripeCustomerId = req.params.id
//   try {
//     const {
//       name,
//       description,
//       amount,
//       currency,
//     } = req.body

  
//     const updateStripeCustomer = await stripe.customers.update(
//       stripeCustomerId,
      
//        { name: name,
//         description: description,
//         amount:amount,
//         currency
//        } 
//     )
//     res.status(200).json(updateStripeCustomer)
//   }
//   catch (e) {
//     res.status(500).json(e)
//   }
// }



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

  try {
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
  catch (e) {
    res.status(500).json(e)
  }

}



// SecreteKey_sourabh = 'sk_test_51LkLlPLVp3cdDpUh7AUoQIdolBC7QY9JVlF5okcCNIER6wfF7dy5D1sk3sCW4Pqz50hPL6vlJP7YpOfYoJjKeJGQ00Kwtav4kX'
//SecreteKey_Devendra ='sk_test_51MgRB8SBnbzFc2sZ6es5bHJN6retmvTWZ9Bc4f75FUnxWcjIfmpS9Lpkm2Ot931hgaa12FwJNhwc3MBDk42CGqTJ00Quwwl8j8'  


