const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber:{
            type:mongoose.Schema.Types.ObjectId, //one who is subscribing channel
            ref:"User"
        },
        channel:{
            type:mongoose.Schema.Types.ObjectId, //one to who subscriber is  subscribing
            ref:"User"
        }
    },
    {timestamps:true}
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;