import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

class Database {
    connect() {
        dotenv.config();
        let connectURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_LINK}?retryWrites=true&w=majority`;
        mongoose.connect(connectURL).then(() => {
            console.log('Database connection successfull');
        }).catch((err: any) => {
            console.log('Database connection error');
            console.log(err);
            process.exit();
        });
    }
}

export default new Database();



