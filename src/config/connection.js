const mongoose = require('mongoose');

class Database {
        static async connect() {
            try {
                await mongoose.connect(process.env.DB_URI);
        
                console.log('MongoDB connect successfully!');
                
            } catch (error) {
                console.error('DB connection error', error.message);
                process.exit(1);
            }
        }
}

module.exports = Database;

