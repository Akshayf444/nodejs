var express = require('express');
var router = express.Router();

var session = require('express-session');
var sess;
var row;

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
			if(req.query.page){
				var sql = 'SELECT * FROM pages where slug = "' + req.query.page + '"';
			}else{
				var sql = "";
			}
				conn.query(sql,function(err, result, fields) {
					if(req.query.page){

						row = result;
					}
					res.render('pages/pages', { title: 'Page Listing', results:rows,result:row });

				});
			//console.log(row);
        });
    });

});

router.get('/add', function(req, res, next) {
	sess = req.session;
	if(!sess.email) { res.redirect('/');}
	res.render('pages/add', { title: 'Add Pages' });
});

/*
router.get('/edit/(:id)', function(req, res, next) {

    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM pages WHERE id = ' + req.params.id,function(err, rows, fields) {
            res.render('pages/edit', { title: 'Edit Page',results:rows });
        });
    });
});*/

router.post('/edit', function(req, res, next) {
	sess = req.session;
	if(!sess.email) { res.redirect('/');}
    
    var pages = {
        title: req.body.title,
        description: req.body.description,
        keywords: req.body.keywords,
		slug:slugify(req.body.title)
    }
	
    req.getConnection(function(error, conn) {
        conn.query('UPDATE pages SET ? WHERE id = ' + req.body.id, pages, function(err, result) {
                //if (!err) {
                    res.redirect('/pages')

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