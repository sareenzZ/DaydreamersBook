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

app.set('view engine', 'hbs');

app.get('/login', function(req,res){
    //login page
});


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


app.listen(3000);