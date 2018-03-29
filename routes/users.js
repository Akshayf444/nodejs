var express = require('express');
var router = express.Router();

var session = require('express-session');
var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
	
	sess = req.session;
	if(!sess.email) { res.redirect('/');}
	
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM users where is_admin != 1 ORDER BY id DESC',function(err, rows, fields) {
            console.log(rows);
            res.render('users', { title: 'User Listing',results:rows });
        });
    });

});

router.get('/add', function(req, res, next) {
	sess = req.session;
	if(!sess.email) { res.redirect('/');}
	
	res.render('add', { title: 'Add User' });
});

router.get('/edit/(:id)', function(req, res, next) {
	sess = req.session;
	if(!sess.email) { res.redirect('/');}
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM users WHERE id = ' + req.params.id,function(err, rows, fields) {
            res.render('edit', { title: 'Edit User',results:rows });
        });
    });
});

router.post('/edit', function(req, res, next) {
	sess = req.session;
	if(!sess.email) { res.redirect('/');}
    var user = {
        name: req.body.name,
        age: parseInt(req.body.age),
        email: req.body.email,
        password: req.body.password,

    }
    console.log(user);
    req.getConnection(function(error, conn) {
            conn.query('UPDATE users SET ? WHERE id = ' + req.body.id, user, function(err, result) {
                //if (!err) {
                    res.redirect('/users')

                //}
        });
    });
                
});
router.post('/add', function(req, res, next) {
	sess = req.session;
	if(!sess.email) { res.redirect('/');}
    var user = {
        name: req.body.name,
        age: parseInt(req.body.age),
        email: req.body.email,
        password: req.body.password,

    }
	
	var sql = 'INSERT INTO users(name,age,email,password) values("' + user.name + '", ' + user.age + ', "' +  user.email + '", "' +  user.password + '")';
    console.log(sql);
	console.log(user);
    req.getConnection(function(error, conn) {
		
            conn.query(sql, function(err, result) {
                //if (!err) {
                    res.redirect('/users')

               //}
        });
    });
                
});

router.get('/delete/(:id)', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM users WHERE id = ' + req.params.id,function(err, rows) {
             res.redirect('/users')
        });
    });
});
module.exports = router;