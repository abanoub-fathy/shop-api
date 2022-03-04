const db = require("../config/db");
const userQueries = require("../queries/user");
const creditCardQueries = require("../queries/creditCard");
const { hashUserPassword, comapreUserPassword } = require("./utils/password");
const { generateAuthToken } = require("./utils/tokens");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const constructStripeItems = require("./utils/constructStripeItems");

exports.signup = async (req, res) => {
  // destructure name, email, password
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .send({ error: "You should fill all required fields" });
  }
  try {
    // check if the email is already existed
    const user = await db.query(userQueries.getUserByEmail, [email]);
    if (user.rows.length) {
      return res.status(400).send({ error: "The email is already taken" });
    }

    // hash the user password
    const hashedPassword = await hashUserPassword(password);

    // create the user and save it to the db
    await db.query(userQueries.createUser, [name, email, hashedPassword]);
    const newUser = await db.query(userQueries.getUserByEmail, [email]);
    if (!newUser.rows.length) {
      return res.status(400).send({ error: "Unable to create the user" });
    }

    // generate auth token
    const token = generateAuthToken(newUser.rows[0].id);
    await db.query(userQueries.saveTokenToUser, [token, newUser.rows[0].id]);

    // return response
    res.status(201).send({
      status: "success",
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role,
      },
      token,
    });
  } catch (e) {
    res.status(400).send({ status: "failed", error: e.message });
  }
};

exports.login = async (req, res) => {
  // destructure email and password
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: "email and password are required!" });
  }
  try {
    // find the user by email first
    const user = await db.query(userQueries.getUserByEmail, [email]);
    if (!user.rows.length) {
      return res.status(400).send({ error: "Email is not correct" });
    }

    // check for correct password
    const passMatch = await comapreUserPassword(
      password,
      user.rows[0].password
    );
    if (!passMatch) {
      return res.status(400).send({ error: "Password is not correct" });
    }

    // generate new auth token
    const token = generateAuthToken(user.rows[0].id);

    // save the token
    await db.query(userQueries.saveTokenToUser, [token, user.rows[0].id]);

    // return the user to the requester
    res.status(200).send({
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
      token,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.addCreditCard = async (req, res) => {
  // destructure credit card fields
  const { ccnum, ccname, cvc } = req.body;
  if (!ccnum || !ccname || !cvc) {
    return res
      .status(400)
      .send({ error: "You should provide all credit card fields" });
  }
  try {
    // check if the credit card is existed
    const creditCard = await db.query(creditCardQueries.getCreditCardByNum, [
      ccnum,
    ]);
    if (creditCard.rows.length) {
      return res
        .status(400)
        .send({ error: "The credit card number is already existed" });
    }

    // create credit card
    await db.query(creditCardQueries.addCreditCard, [
      ccnum,
      ccname,
      cvc,
      req.user.id,
    ]);

    // fetch the newly created credit card
    const newCreditCard = await db.query(creditCardQueries.getCreditCardByNum, [
      ccnum,
    ]);
    if (!newCreditCard.rows.length) {
      throw new Error("Cannot create the credit card");
    }
    res.status(201).send({
      status: "success",
      creditCard: newCreditCard.rows[0],
    });
  } catch (e) {
    res.status(400).send({ status: "fail", error: e.message });
  }
};

exports.buy = async (req, res) => {
  let items = req.body;
  if (!items) {
    return res.status(400).send({ error: "You should select items to buy" });
  }

  try {
    let stripeItems = await constructStripeItems(items);
    console.log(stripeItems);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      line_items: stripeItems,
    });
    res.send({
      paymentUrl: session.url,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};
