const updateManyFields = (q, updates, req, id) => {
  // params
  let params = [id];

  // update product
  for (let i = 0; i < updates.length; i++) {
    q = `${q}${updates[i]} = $${params.length + 1},`;
    params.push(req.body[updates[i]]);
  }
  q = `${q.substring(0, q.length - 1)} WHERE id = $1`;

  return {
    q,
    params,
  };
};

module.exports = updateManyFields;
