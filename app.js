// app.js
//setup
var express = require('express');

//set up database
require('./db');
var mongoose = require('mongoose');
var Tab = mongoose.model('Tab');
var Page = mongoose.model('Page');
var User = mongoose.model('User');

//set up app
var app = express();

//bodyParser
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

//serving static files
var path = require('path');
var publicPath = path.resolve(__dirname,'public');
app.use(express.static('public'));


//use passort for user sign in


var passport = require('passport');
    LocalStrategy = require('passport-local').Strategy;
var flash=require("connect-flash");
var expressSession = require('express-session');

app.use(expressSession({secret: 'mySecret', resave:'false', saveUninitialized:'false'}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.set('view engine', 'hbs');
/*
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
*/

passport.serializeUser(function(user,done){
    done(null,user._id);
});
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err,user);
    });
});




passport.use('local-login', new LocalStrategy({
    passReqToCallback: true
},
    function(req, username, password, done){

        User.findOne({'username':username}, function (err,user) {
            if(err) return done(err);
            if(!user){
                console.log('Please enter a valid username instead of '+username );
                return done(null,false, req.flash('message','No user found.'));
            }
            if(!user.isValidPassword(password)) {
                console.log('Invlaid password!');
                return done(null, false, req.flash('message', 'Invalid password.'));
            }

            return done(null,user);
            }
        );

}));

passport.use('local-signup', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done){
            process.nextTick(function(){

            User.findOne({'username': username}, function (err, user) {
                    if (err) {console.log('SignUp Error: '+err); return done(err);}
                    if (user) {
                        console.log('User already exists');
                        return done(null, false, req.flash('message',"User already exists."));
                    } else {

                        var newUser = new User()

                        newUser.username = username;
                        newUser.password = newUser.createHash(password);

                        newUser.save(function(err){
                            if(err) {console.log('Error: '+err); throw err;}
                            console.log("SignUp Succeeded");
                            return done(null,newUser);
                        });

                    }


                });

            });
    }
));






//not working yet...
app.get('/login', function(req,res){
    //login page
    res.render('login.hbs', {'user':req.user});
});

app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/tabs',
        failureRedirect: '/login',
        failureFlash : true
    })
);

/*
req.login(user, function(err){
    if(err){return next(err);}
    return res.redirect('/users/'+req.user.username);
});
*/

app.get('/', function(req,res){
    //login page
    res.redirect('/login');
});


app.get('/signup', function(req,res){
    //login page
    res.render('signup.hbs');
});

app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/login',
        failureRedirect: '/signup',
        failureFlash : true
    })
);


app.get('/logout', function(req, res){
    var name = req.user.username;
    console.log("LOGGIN OUT " + req.user.username)
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
});

/*Reference:
http://passportjs.org/docs/configure
* */



var isAuthenticated = function (req,res,next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/');
}

app.get('/book',isAuthenticated,function (req,res) {
 //   res.render('home', {'user': req.user});
    if(req.user) {
        Tab.find(function (err, tabs, count) {
            res.render('tabs.hbs', {'tabs': tabs});
        });
    }
    else
        console.log("please login :)");
});


app.get('/tabs', function(req, res) {
    if(req.user) {
        Tab.find({'user': req.user.id}, function (err, tabs, count) {
            if(tabs.pages) {
                tabs.totalLikes = tabs.pages.reduce(function (a, b) {
                    return a.numsLiked + b.numsLiked;
                }, 0);
            }
            res.render('tabs.hbs', {'tabs': tabs});
        });
    }
    else
        res.send("please login :)");

});

app.post('/tabs',function(req, res) {

    //add
    if(req.body.add){
        if ((req.body.tabName !== undefined) && (req.body.tabName.length > 0)) {
            var newTab= new Tab({
                'name': req.body.tabName,
                'user': req.user.id
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

//slug for a tab -- tab page
app.get('/tabs/:slug', function(req, res, next){

    if(!req.user) res.send("please login :)");

    else {
        Tab.findOne({'slug': req.params.slug}, function (err, tabs, count) {
            res.render('tabsSlug.hbs', {'tabs': tabs});
        });
    }

});

//add and delete a page
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

/*
app.get('/api/pages', function(req, res) {
    var movieFilter = {},
        searchExists = false;

    if(req.query.director) {
        movieFilter.director = req.query.director;
        searchExists = true;
    }

    Movie.find(movieFilter, function(err, tabs, count) {

        res.json(movies.map(function(ele){
            return {
                'title':ele.title,
                'director':ele.director,
                'year': ele.year
            };
        }));

    });

});
*/






//PORT=19262 NODE_ENV=PRODUCTION node app.js

app.listen(process.env.PORT||3000);


//local testing
//app.listen(3000);