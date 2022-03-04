const db = require("../../config/db");
const productQueries = require("../../queries/products");

const constructStripeItems = async (items) => {
  let stripeElements = [];
  for (let i = 0; i < items.length; i++) {
    let product = await db.query(productQueries.viewSingleProduct, [
      items[i].id,
    ]);
    if (!product.rows.length) {
      continue;
    }
    let productObj = {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.rows[0].pname,
        },
        unit_amount: product.rows[0].price * 100,
      },
      quantity: items[i].quantity,
    };

    stripeElements.push(productObj);
  }

  return stripeElements;
};

module.exports = constructStripeItems;
