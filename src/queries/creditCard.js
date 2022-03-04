// add credit card to user account
const addCreditCard =
  "INSERT INTO creditcards (ccnum, ccname, cvc, owner) VALUES ($1, $2, $3, $4)";

// get credit card by num
const getCreditCardByNum = "SELECT * FROM creditcards WHERE ccnum = $1";

module.exports = {
  addCreditCard,
  getCreditCardByNum,
};
