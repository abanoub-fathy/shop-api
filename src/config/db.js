const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "shop",
  password: "popTop123",
  port: 5432,
});

pool
  .query("SELECT NOW()")
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err));

// if no admin create one
pool
  .query("SELECT * from users where role = 'admin';")
  .then(async (result) => {
    if (!result.rows.length) {
      // create admin
      const hashedPass = await bcrypt.hash("123456", 8);
      pool
        .query(
          `INSERT INTO users (name, email, password, role) VALUES ('admin', 'admin@gmail.com', '${hashedPass}', 'admin')`
        )
        .then((result) => console.log("Admin is created"));
    }
  })
  .catch((error) => console.log(error));
module.exports = pool;
