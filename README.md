# zz589-final-project  My Favorites

## Overview
We are all trying to discover who we are in the world. However, sometimes we become too engaged in living that we could not remember of a big part of our identification: our favorite things! 

My Favorites is a web app that allows users to keep track of their favorite things! Users can register and login. After they are logged in, they can create or view categories of favorites. For every section they have, they can add or delete a customized item which includes a name,  a quantity representing the number of times they feel a strong love towards the item, and an option description of special feelings.  

## Data Model

First draft schema:
```javascript
// users 
// * our site requires authentication... 
// * so users have a username and password 
// * they also can have 0 or more lists 
var User = new mongoose.Schema({     
  // username, password provided by plugin     
  lists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }] 
});  

// an item (or group of the same items) in a category 
// * includes a name, a quantity of number of times loved, and an optional description/feeling
var Item = new mongoose.Schema({     
  name: {type: String, required: true},     
  quantity: {type: Number, min: 1, required: true},     
  description:{type: String, required: false} 
}, {     _
  id: true 
});  
  
// a category of favorite things 
// * each category must have a related user 
// * a list can have 0 or more items 
var List = new mongoose.Schema({     
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},     
  name: {type: String, required: true},     
  createdAt: {type: Date, required: true},     
  items: [Item] 
});
```


## Wireframes
(these are html mockups for wireframes, though they can be created using wireframing tools or even hand-drawn)
/list/create - page for creating a new shopping list

