const viewAllProducts = "SELECT * FROM products";
const viewSingleProduct = "SELECT * FROM products WHERE id = $1";
const createProduct =
  "INSERT INTO products (pname, price, count) VALUES ($1, $2, $3)";
const deleteProduct = "DELETE FROM products WHERE id = $1";
const updateProduct = "UPDATE products SET ";

module.exports = {
  viewAllProducts,
  viewSingleProduct,
  createProduct,
  deleteProduct,
  updateProduct,
};
