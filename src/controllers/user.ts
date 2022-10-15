import User from '../interfaces/user';
import { getDocument, addDocument, CMSSchemeToObject, objectToCMSScheme } from './cms';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

function emailHash(email: string) : string { //My CMS doesn't support custom queries so document lookups can only be done with ID
    //So, emails are hashed into IDs, that way when users provide email for signin, that can be turned into ID for lookup.
    return crypto.createHash('sha256').update(email).digest('hex');
}

export async function getUser(userId: string) : Promise<User> | null {
    let docO = await getDocument("Users", userId);
    if (!docO) return null;
    let doc = CMSSchemeToObject(docO) as any

    let ret: User = {} as User;
    ret.id = doc.Id;
    ret.email = doc.email;
    ret.passwordHashed = doc.passwordHashed;
    ret.completedLessons = (doc.completedLessons || "");
    ret.completedCourses = (doc.completedCourses || "");
    return ret;
}

export async function getUserFromEmail(email: string) : Promise<User> | null {
    let id = emailHash(email);
    return await getUser(id);
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
    user.Id = emailHash(email);
    user.email = email;
    user.passwordHashed = await bcrypt.hash(password, 10);
    user.completedLessons = "[]";
    user.completedCourses = "[]";

    await addDocument("Users", objectToCMSScheme(user));
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

