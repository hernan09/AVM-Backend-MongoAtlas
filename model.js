const mongose = require('mongoose');
const schema = mongose.Schema

let UserAcount = new schema({
    name:{type:String},
    price:{type:String}
})

module.exports = mongose.model('acount',UserAcount);