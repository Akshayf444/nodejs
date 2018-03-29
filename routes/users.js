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

router.post('/edit/(:id)', function(req, res, next) {
    var user = {
        name: req.params.name.escape().trim(),
        age: req.params.age.escape().trim(),
        email: req.params.email.escape().trim(),
        password: req.params.password.escape().trim(),

    }
    
    req.getConnection(function(error, conn) {
            conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function(err, result) {
                if (err) {
                    res.redirect('/users')

                }
        });
    });
                
});
module.exports = router;
