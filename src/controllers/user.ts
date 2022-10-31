import User from '../interfaces/user';
import { getDocument, addDocument, updateDocument, getDocumentByQuery } from './cms';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function getUser(userId: string) : Promise<User> | null {
    let doc = await getDocument("User", userId) as User;
    if (!doc) return null;
    delete doc['_id'];
    delete doc['__v'];

    return doc;
}

export async function getUserFromEmail(email: string) : Promise<User> | null {
    let doc = await getDocumentByQuery("User", {email: email}) as User
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

    console.log(user);

    await addDocument("User", user);
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
    await updateDocument("Users", user, user.id)
    return;
}

