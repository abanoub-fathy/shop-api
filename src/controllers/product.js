const db = require("../config/db");
const productQueries = require("../queries/products");
const updateManyFields = require("./utils/updateMany");

exports.viewProducts = async (req, res) => {
  try {
    const products = await db.query(productQueries.viewAllProducts);
    res.send({
      numberOfProducts: products.rows.length,
      products: products.rows,
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

exports.viewSingleProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new Error("Bad id");
    }

    const product = await db.query(productQueries.viewSingleProduct, [id]);
    if (!product.rows[0]) {
      return res.status(404).send({ error: "product not found!" });
    }

    res.send(product.rows[0]);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { pname, price, count } = req.body;
    const product = await db.query(productQueries.createProduct, [
      pname,
      price,
      count,
    ]);

    // created response
    res.status(201).send({
      status: "success",
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.updateProduct = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send({ error: "request with bad id" });
  }

  // check for valid updates
  const validUpdates = ["pname", "price", "count"];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((update) =>
    validUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "not valid update operation" });
  }

  try {
    // check product is existed
    const product = await db.query(productQueries.viewSingleProduct, [id]);
    if (!product.rows.length) {
      return res.status(404).send({ error: "product not found" });
    }

    // get executable update query
    const updateQuery = updateManyFields(
      productQueries.updateProduct,
      updates,
      req,
      id
    );
    await db.query(updateQuery.q, updateQuery.params);

    res.status(200).send({
      status: "success",
    });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ error: e.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send({ error: "request with bad id" });
  }

  try {
    // check product is existed
    const product = await db.query(productQueries.viewSingleProduct, [id]);
    if (!product.rows.length) {
      return res.status(404).send({ error: "product not found" });
    }

    await db.query(productQueries.deleteProduct, [id]);
    res.send({ status: "Success", product: product.rows[0] });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};
