import bcrypt from 'bcrypt';
import User from '../interfaces/user';
import { getCollection, getDocument, addDocument, mapToCMSScheme } from './cms';

export async function getUser(userId: string) : Promise<User> | null {
    let doc = await getDocument("Users", userId);
    if (!doc) return null;

    let ret: User;
    ret.id = doc.Id;
    ret.email = doc.email;
    ret.passwordHashed = doc.passwordHashed;
    ret.completedLessons = doc.completedLessons.split(',');
    ret.completedCourses = doc.completedCourses.split('.');
    return ret;
}

export async function getUserFromEmail(email: string) : Promise<User> | null {
    return null;
}

export function generateUserJWT(userId: string) : string {
   return ""; 
}


//Returns jwt or null
export async function createUser(email: string, password: string) : Promise<string> | null {
    let user: any = {};
    user.Id = `u${Math.floor(Math.random() * 90000000000 + 10000000000)}`;
    while ((await getUser(user.id)) != null) { //In case ID is already in use generate new one (This should never happen but just in case)
        user.id = `u${Math.floor(Math.random() * 90000000000 + 10000000000)}`;
    }
    user.email = email;
    user.passwordHashed = await bcrypt.hash(password, 10);
    user.completedLessons = "[]";
    user.completedCourses = "[]";

    await addDocument("Users", mapToCMSScheme(user));
    return generateUserJWT(user.id)        
}
