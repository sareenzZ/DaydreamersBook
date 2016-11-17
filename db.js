
var mongoose = require('mongoose');
URLSlugs = require('mongoose-url-slugs');
var Schema = mongoose.Schema;

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
var User = new mongoose.Schema({
    // username, password provided by plugin
    lists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
});

// a page (or group of the same ideas under a topic) in a section
// * includes a name, a quantity of number of times loved, and an optional description/feeling/details that can be edited
var Page = new mongoose.Schema({
    name: {type: String, required: true},
    numsLiked: {type: Number, min: 1, required: true},
    description:{type: String, required: false}
}, {
    _id: true
});

// a tab of ideas/'dreams'
// * each tab must have a related user
// * a tab can include 0 or more pages
var Tab = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    name: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    pages: [Page]
}, {
    _id: true
});

Tab.plugin(URLSlugs('name',{index_unique:true}));



mongoose.model('Tab', Tab);
mongoose.model('Page', Page);


mongoose.connect('mongodb://localhost/project');