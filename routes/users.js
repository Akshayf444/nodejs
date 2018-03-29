var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM users ORDER BY id DESC',function(err, rows, fields) {
            console.log(rows);
            res.render('users', { title: 'User Listing',results:rows });
        });
    });

});

router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add User' });
});

router.get('/edit/(:id)', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM users WHERE id = ' + req.params.id,function(err, rows, fields) {
            res.render('edit', { title: 'Edit User',results:rows });
        });
    });
});

router.post('/edit', function(req, res, next) {
    var user = {
        name: req.params.name,
        age: req.params.age,
        email: req.params.email,
        password: req.params.password,

    }
    console.log(user);
    req.getConnection(function(error, conn) {
            conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function(err, result) {
                if (err) {
                    res.redirect('/users')

                }
        });
    });
                
});
router.post('/add', function(req, res, next) {
    var user = {
        name: req.params.name,
        age: req.params.age,
        email: req.params.email,
        password: req.params.password,

    }
    console.log(user);
    req.getConnection(function(error, conn) {
            conn.query('INSERT INTO users SET ? ', user, function(err, result) {
                if (err) {
                    res.redirect('/users')

                }
        });
    });
                
});
module.exports = router;