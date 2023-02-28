const Stripe = require('stripe')
const stripe = Stripe(
    "sk_test_51LkLlPLVp3cdDpUh7AUoQIdolBC7QY9JVlF5okcCNIER6wfF7dy5D1sk3sCW4Pqz50hPL6vlJP7YpOfYoJjKeJGQ00Kwtav4kX"
)

exports.createPayment = (req, res) => {
    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Gautam Sharma',
        address: {
        line1: 'TC 9/4 Old MES colony',
        postal_code: '110092',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        }
        })
        .then((customer) => {
         
        return stripe.charges.create({
        amount: 7000, // Charing Rs 25
        description: 'Web Development Product',
        currency: 'USD',
        customer: customer.id
        });
        })
        .then((charge) => {
        res.send("Success") // If no error occurs
        })
        .catch((err) => {
        res.send(err) // If some error occurs
        });
 
}








/*
const Stripe = require("stripe");
//add stripe key
const stripe = Stripe(
  "sk_test_51LkLlPLVp3cdDpUh7AUoQIdolBC7QY9JVlF5okcCNIER6wfF7dy5D1sk3sCW4Pqz50hPL6vlJP7YpOfYoJjKeJGQ00Kwtav4kX"
);

//stripe payment controller for react
const StripePaymentController = async (req, res) => {
  //console.log(req.body);
  const items = req.body;
  //console.log(items);
  try {
    // stripe create customer
    const customers = await stripe.customers.create({
      name: items.address.billing_name,
      email: items.email,
      address: {
        line1: items.address.billing_address_line1,
        postal_code: items.token.card.address_zip,
        city: items.token.card.address_city,
        state: items.token.card.address_city,
        country: items.token.card.address_country,
      },
    });
    //console.log(customers);
    //create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      description: "Pay AmmountI With catd",
      payment_method_types: ["card"],
      amount: items.ammount * 100,
      currency: "inr",
      shipping: {
        name: items.address.shipping_name,
        address: {
          line1: items.address.shipping_address_line1,
          postal_code: items.address.shipping_address_zip,
          city: items.address.shipping_address_city,
          state: "MP",
          country: items.address.shipping_address_country,
        },
      },
    });
    //console.log(paymentIntent);
    //confirm payment intent
    const conformpayment = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method: "pm_card_visa",
      }
    );
    console.log(conformpayment);
    //return false;
    if (conformpayment.status === "succeeded") {
      res.status(200).send(conformpayment);
    } else {
      res.status(500).send("payment failed");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//stripe payment controller for Gatsbyjs
const StripePaymentGatsbyController = async (req, res) => {
  //console.log(req.body);
  const items = req.body;
  //console.log(items);
  //return false;
  try {
    // stripe create customer
    const customers = await stripe.customers.create({
      name: items.formdata.name,
      email: items.email,
      address: {
        line1:
          items.formdata.city +
          "," +
          items.formdata.state +
          "," +
          items.formdata.country,
        postal_code: items.formdata.zipcode,
        city: items.formdata.city,
        state: items.formdata.state,
        country: items.formdata.country,
      },
    });
    //console.log(customers);
    //create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      description: "Pay AmmountI With catd",
      payment_method_types: ["card"],
      amount: items.ammount * 100,
      currency: "INR",
      shipping: {
        name: items.formdata.name,
        address: {
          line1:
            items.formdata.city +
            "," +
            items.formdata.state +
            "," +
            items.formdata.country,
          postal_code: items.formdata.zipcode,
          city: items.formdata.city,
          state: items.formdata.state,
          country: items.formdata.country,
        },
      },
    });
    //console.log(paymentIntent);
    //confirm payment intent
    const conformpayment = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method: "pm_card_visa",
      }
    );
    //console.log(conformpayment);
    //return false;
    if (conformpayment.status === "succeeded") {
      res.status(200).send(conformpayment);
    } else {
      res.status(500).send("payment failed");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const StripeCuntomers = async (req, res) => {
  //console.log("get call customers");
  try {
    const listofcustomers = await stripe.customers.list();
    //console.log(listofcustomers);
    res.status(200).send(listofcustomers);
  } catch (error) {
    res.status(400).send(error);
  }
};

//stripe payment with node
const StripePaymentWithNode = async (req, res) => {
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
    //console.log(session);
    res.redirect(303, session.url);
  } catch (error) {
    console.log(error);
  }
};
// get all stripe customers
const GetStripeNodePaymentInfo = async (req, res) => {
  const retsession = await stripe.checkout.sessions.retrieve(
    req.query.session_id
  );
  //console.log(retsession);
  res.render("pages/success.hbs");
};

//get customers by id
const GetCustomerById = async (req, res) => {
  //console.log("all customers");
  const cust_id = req.params.cust_id;
  //console.log(cust_id);
  try {
    const customer = await stripe.customers.retrieve(cust_id);
    //console.log(customer);
    res.status(200).send(customer);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  StripePaymentController,
  StripePaymentWithNode,
  GetStripeNodePaymentInfo,
  StripeCuntomers,
  GetCustomerById,
  StripePaymentGatsbyController,
};

*/

// xpet-dobx-rxpg-nohb-bfyu

// pk_test_51MgRB8SBnbzFc2sZsdftPB7JizcRMN526slPULJXAkXD5SnL1JFKxqIjwiXtMiAjNtX41EIN6pl3YzplISV3J6Hz00HpSsA6EZ