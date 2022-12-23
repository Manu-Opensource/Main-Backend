import User from '../interfaces/user';
import UserSchema from '../models/user';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function getUser(userId: string) : Promise<User> | null {
    let doc = await UserSchema.findOne({id: userId}).exec();
    if (!doc) return null;
    delete doc['_id'];
    delete doc['__v'];

    return doc;
}

export async function getUserFromEmail(email: string) : Promise<User> | null {
    let doc = await UserSchema.findOne({email: email}).exec();
    return doc;
}

export function generateUserJWT(userId: string) : string {
   return jwt.sign({ id: userId }, 'key'); 
}

export function decodeUserJWT(token: string) : any {
    try {
        let decoded = jwt.verify(token, 'key')
        return decoded;
    } catch (e) {
        return false;
    }
}

//Returns jwt or null
export async function createUser(email: string, password: string) : Promise<string> | null {
    let user: any = {};
    user.id = randomUUID();
    user.email = email;
    user.passwordHashed = await bcrypt.hash(password, 10);
    user.completedLessons = [];
    user.completedCourses = [];

    await UserSchema.create(user);
    return generateUserJWT(user.id)        
}

export async function loginUser(email: string, password: string): Promise<[boolean, string]> | null {
    let user = await getUserFromEmail(email);
    if (!user) {
        return [false, "User not found with email"];
    }
    if (!(await bcrypt.compare(password, user.passwordHashed))) {
        return [false, "Invalid Password"];
    }
    return [true, generateUserJWT(user.id)];
}

export async function updateUser(user: User) : Promise<null> {
    await UserSchema.findOneAndUpdate({id: user.id}, user)
    return;
}

