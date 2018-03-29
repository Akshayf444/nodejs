var express = require('express');
var router = express.Router();

var session = require('express-session');
var sess;

function slugify(text) {

    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
}

/* GET home page. */
router.get('/', function(req, res, next) {

    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM pages',function(err, rows, fields) {
            console.log(rows);
            res.render('pages/pages', { title: 'Page Listing', results:rows });
        });
    });

});

router.get('/add', function(req, res, next) {
	sess = req.session;
	if(!sess.email) { res.redirect('/');}
	res.render('pages/add', { title: 'Add Pages' });
});

router.get('/edit/(:id)', function(req, res, next) {

    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM pages WHERE id = ' + req.params.id,function(err, rows, fields) {
            res.render('pages/edit', { title: 'Edit Page',results:rows });
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

    var pages = {
        title: req.body.title,
        description: req.body.description,
        keywords: req.body.keywords,
		slug:slugify(req.body.title)
    }
	
	var sql = 'INSERT INTO pages(title,description,keywords,slug) values("' + pages.title + '", "' + pages.description + '", "' +  pages.keywords + '", "' +  pages.slug + '")';
	console.log(sql);
    req.getConnection(function(error, conn) {
		
            conn.query(sql, function(err, result) {
                //if (!err) {
					console.log('Page Added');
                    res.redirect('/pages')

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