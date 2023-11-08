const mysql = require('mysql');

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// encapsulated database operations using the connection pool and a promise-based
function query(sql, values) {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Using this function to check request param query
function getQueryParam(req, param) {
  const value = req.query[param];
  return value !== null && value !== undefined ? value : null;
}


// View All Users
exports.view = async (req, res) => {
  try {
    const error = getQueryParam(req, 'error');
    const alert = getQueryParam(req, 'alert');
    const removedUser = getQueryParam(req, 'removed');

    const rows = await query('SELECT * FROM user WHERE status = "active"');
    res.render('home', { rows, alert, error, removedUser });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

// Find User by Search
exports.find = async (req, res) => {
  try {
    const searchTerm = req.body.search;
    const rows = await query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%']);
    res.render('home', { rows });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

// Add User page
exports.form = (req, res) => {
  try {
    const error = getQueryParam(req, 'error');
    const alert = getQueryParam(req, 'alert');

    res.render('add-user', { alert, error });

  } catch (err) {
    res.status(500).send('Internal server error');
  }
};

// Post Requst for new user
exports.create = async (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  try {
    const result = await query('INSERT INTO user SET ?', { first_name, last_name, email, phone, comments });
    const addedUser = encodeURIComponent(`${first_name} has been created.`);
    res.redirect('/?alert=' + addedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

// Edit user
exports.edit = async (req, res) => {
  try {
    const error = req.query.error
    const rows = await query('SELECT * FROM user WHERE id = ?', [req.params.id]);
    res.render('edit-user', { rows, error });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

// Update User
exports.update = async (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  try {
    await query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id]);
    const updatedRows = await query('SELECT * FROM user WHERE id = ?', [req.params.id]);
    res.render('edit-user', { rows: updatedRows, alert: `${first_name} has been updated.` });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

// Delete User
exports.delete = async (req, res) => {
  try {
    await query('DELETE FROM user WHERE id = ?', [req.params.id]);
    const removedUser = encodeURIComponent('User successfully removed.');
    res.redirect('/?removed=' + removedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

// View specific Users
exports.viewUser = async (req, res) => {
  try {
    const rows = await query('SELECT * FROM user WHERE id = ?', [req.params.id]);
    res.render('view-user', { rows });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};