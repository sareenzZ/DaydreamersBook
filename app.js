// app.js
//setup
var express = require('express');

//set up database
require('./db');
var mongoose = require('mongoose');
var Tab = mongoose.model('Tab');
var Page = mongoose.model('Page');

//set up app
var app = express();

//bodyParser
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));


//use passort for user sign in

/*
var passport = require('passport');
app.use(session({secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());
*/


app.set('view engine', 'hbs');

//not working yet...
app.get('/signin', function(req,res){
    //login page
    res.render('signup.hbs');
});

/*
app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })
);

app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })
);

app.get('/logout', function(req, res){
    var name = req.user.username;
    console.log("LOGGIN OUT " + req.user.username)
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
});

*/

app.get('/tabs', function(req, res) {

    Tab.find(function(err,tabs,count) {
        res.render('tabs.hbs', {'tabs': tabs});
    });

});

app.post('/tabs',function(req, res) {

    //add
    if(req.body.add){
        if ((req.body.tabName !== undefined) && (req.body.tabName.length > 0)) {
            var newTab= new Tab({
                'name': req.body.tabName
            });

            newTab.save(function(error, t, count){
                if(error && (error.name == 'ValidationError')) {
                    Tab.find(function(err,tabs,count) {
                        res.render('tabs.hbs', {'tabs': tabs, 'err':error});
                    });
                }
                else
                    res.redirect('/tabs');
            });
        }
        else
            res.redirect('/tabs');
    }//end add

    //delete
    else if(req.body.del){
        var checked = req.body.check;
        if (Array.isArray(checked)) {
            for (var i = 0; i < checked.length; i++) {
                Tab.find({'_id': checked[i]}).remove(
                    function (error, tabs, count) {}
                );
            }
        }
        else {
            Tab.find({'_id': checked}).remove(
                function (error, tabs, count) {}
            );
        }

        res.redirect('/tabs');
    }//end delete

});

//slug for a tab
app.get('/tabs/:slug', function(req, res, next){

    Tab.findOne({'slug':req.params.slug}, function(err,tabs,count) {
        res.render('tabsSlug.hbs', {'tabs': tabs});
    });

});


app.post('/tabs/:slug', function(req, res, next){

    //delete
    if(req.body.del){
        var checked = req.body.check;
        if (Array.isArray(checked)) {
            for (var i = 0; i < checked.length; i++)
                Tab.update(
                    {'slug': req.params.slug},
                    { $pull: {'pages':{'_id':checked[i]}}},
                    false,
                    function(error, tabs, count){ }
                );
        }

        else {
            Tab.update(
                {'slug': req.params.slug},
                { $pull: {'pages':{'_id':checked}}},
                false,
                function(err, tabs, count){}
            );
        }

        res.redirect('/tabs/'+req.params.slug);

    }//end delete

    //add
    else {
        if ((req.body.name !== undefined) && (req.body.name.length > 0)) {
            var newPage = new Page({
                'name': req.body.name,
                'description': req.body.description,
                'numsLiked': req.body.numsLiked
            });

            newPage.save(function(error, img, count){
                if(error && (error.name == 'ValidationError')) {
                    Tab.findOne({'slug':req.params.slug},function(err,tabs,count) {
                        res.render('tabsSlug.hbs', {'imagePosts': tabs, 'err':error});
                    });
                }

                else
                    Tab.findOneAndUpdate({'slug': req.params.slug}, {$push: {'pages': newPage}}, function (error, tabs, count) {
                        res.redirect('/tabs/' + req.params.slug);
                    });

            });

        }

        else
            res.redirect('/tabs/' + req.params.slug);

    }//end add

});










//PORT=19262 NODE_ENV=PRODUCTION node app.js

app.listen(process.env.PORT||3000);


//local testing
//app.listen(3000);