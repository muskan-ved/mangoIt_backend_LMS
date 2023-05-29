require("dotenv").config();
const Stripe = require("stripe");
//add stripe key
const stripe = Stripe(process.env.STRIPE_SECRETE_KEY);

exports.AcceptPayment = async (req, res) => {
  //#####################  payment by Shubham ##########################################
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "https://mynodeherokuappproject.herokuapp.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://example.com/cancel",
    });
    res.status(201).json({ returnurl: session.url });
  } catch (error) {
    console.log(error);
  }

  //#####################  payment by devendra ##########################################
  // const token = req.headers.logintoken;
  // const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  // const email = decode.email;
  // const user_id = decode.id;
  // const {
  //   name,
  //   description,
  //   amount,
  //   currency,
  //   number,
  //   exp_month,
  //   exp_year,
  //   cvc,
  //   key,
  // } = req.body;
  // const idempotencyKey = uuidv4();
  // try {
  //   const createCustomer = await stripe.customers.create({
  //     email: email,
  //     name: name,
  //   });
  //   // res.json(createCustomer)
  //   // generate card token ---------------------------------
  //   if (createCustomer) {
  //     const cardTokenGen = await stripe.tokens.create({
  //       card: {
  //         number,
  //         exp_month,
  //         exp_year,
  //         cvc,
  //       },
  //     });
  //     // console.log(cardTokenGen.card.exp_year)
  //     if (cardTokenGen) {
  //       // res.json(tokenData)
  //       // create source to save card detail to stripe
  //       const card = await stripe.customers.createSource(createCustomer.id, {
  //         source: cardTokenGen.id,
  //       });
  //       if (card) {
  //         try {
  //           const customerPayment = await stripe.charges.create(
  //             {
  //               description: description,
  //               amount: amount * 100,
  //               currency: currency,
  //               customer: createCustomer.id,
  //             },
  //             { idempotencyKey }
  //           );
  //           if (customerPayment) {
  //             const createPayment = await Payment.create({
  //               user_id: user_id,
  //               token: cardTokenGen.id,
  //             });
  //             // console.log(createPayment.id)
  //             if (createPayment) {
  //               const tokenData = await Token.create({
  //                 token_id: createPayment.id,
  //                 key,
  //                 value: cardTokenGen.card.exp_year,
  //               });
  //             }
  //           }
  //           res.json(customerPayment);
  //         } catch (e) {
  //           res.status(500).json(e);
  //         }
  //       }
  //       // res.send(card)
  //     }
  //   }
  // } catch (e) {
  //   res.status(500).json(e);
  // }
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
