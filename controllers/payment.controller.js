require("dotenv").config();
const Stripe = require("stripe");
//add stripe key
const stripe = Stripe(process.env.STRIPE_SECRETE_KEY);

exports.AcceptPayment = async (req, res) => {
  //#####################  payment by Shubham ##########################################
  const { productName, amount, quantity } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
            },
            unit_amount: amount,
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/paymentsuccess/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/paymentcancel`,
    });
    res.status(201).json({ returnurl: session.url });
  } catch (error) {
    console.log(error);
  }
};

exports.GetpaymentDetailsBycheckoutSessionIdPayment = async (req, res) => {
  //#####################  payment by Shubham ##########################################
  const { cs_test_key } = req.body;
  try {
    stripe.checkout.sessions.listLineItems(
      cs_test_key,
      { limit: 5 },
      function (err, lineItems) {
        res.status(200).json({ orderdetails: lineItems });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// exports.getStripeCustomer = async (req, res) => {
//   try {
//     const stripeCustomerId = req.params.id
//     const getStipeCustomer = await stripe.customers.retrieve(stripeCustomerId)
//     res.status(200).json(getStipeCustomer)
//   }
//   catch (e) {
//     res.status(500).json(e)
//   }
// }

// exports.updateStripeCustomer = async (req, res) => {
//   const token = req.headers.logintoken
//   const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
//   const email = decode.email
//   const {
//     name,
//     description,
//   } = req.body
//   try {
//     const stripeCustomerId = req.params.id
//     const customer = await stripe.customers.update(
//       stripeCustomerId,
//       {
//         name,
//         description,
//       }
//     )
//     res.json(customer)
//   }
//   catch (e) {
//     res.status(500).json(e)
//   }
// }

// exports.deleteStripeCustomer = async (req, res) => {
//   try {
//     const stripeCustomerId = req.params.id
//     const deleteStripecustomer = await stripe.customers.del(stripeCustomerId)
//     res.status(200).json(deleteStripecustomer)
//   }
//   catch (e) {
//     res.status(500).json(e)
//   }
// }

// exports.cardToken = async (req, res) => {
//   const cardTokenGen = await stripe.tokens.create({
//     card: {
//       number: '4242424242424242',
//       exp_month: 3,
//       exp_year: 2024,
//       cvc: '314',
//     }
//   })
//   res.status(200).json(cardTokenGen)
// }
