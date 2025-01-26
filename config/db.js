const mongoose = require('mongoose');
const User = require('../model/User');

async function connect() {
    try {
        const uri = 'mongodb+srv://vaishnavimunjal8:RbKJ89Yzvp6nZmAo@mongocluster01.ymvbj.mongodb.net/?retryWrites=true&w=majority&appName=MongoCluster01';
        
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB Atlas');

        const users = await User.find(); // Retrieve all users, or adjust the query to match your needs
        console.log('Users:', users.length);

        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.log('Error connecting to database:', error);
    }
}

module.exports = connect;
