import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const CMS_LINK = "http://localhost:8081" //To-Do: Move to a .env file. (And make stronger credentials)
const CMS_USERNAME = "Admin"
const CMS_PASSWORD = "Password"

const jar = new CookieJar();
const axiosClient = wrapper(axios.create({ jar }));

async function CMS_GET(path: string, args?: any) : Promise<any> {
    let res = await axiosClient.get(`${CMS_LINK}/api/${path}`, {
            params: args ? args : {}}).catch(async e => {
        if (e.response.status == 403) {
            await CMS_LOGIN();
            return await CMS_GET(path, args);
        } else return null;
    });
    return res ? res.data : null;
}

async function CMS_POST(path: string, args?: any) : Promise<any> {
    let res = await axiosClient.post(`${CMS_LINK}/api/${path}`, args ? args : {}).catch(async e => {
        console.log(e);
        if (e.response.status == 403) {
            await CMS_LOGIN();
            return await CMS_POST(path, args);
        } else return null;
    });
    return res ? res.data : null;
}

async function CMS_LOGIN() {
    await CMS_GET("login", {username: CMS_USERNAME, password: CMS_PASSWORD});
}

export async function getCollection(collectionName: string): Promise<Object[][]> | null  {
    if (collectionName.startsWith("CMS")) return null;
    let collection = (await CMS_GET("getcollection", {name: collectionName})) as Object[][] | void; 
    if (collection) return collection;
    else return null;
}

export async function getDocument(collectionName: string, documentId: string): Promise<Object[]> | null {
    if (collectionName.startsWith("CMS")) return null;
    let document = (await CMS_GET("getdocument", {collectionname: collectionName, documentid: documentId})) as Object[] | void;
    if (document) return document;
    else return null;
}

export async function addDocument(collectionName: string, document: Object) : Promise<null> | null {
    if (collectionName.startsWith("CMS")) return null;
    await CMS_POST("createdocument", {collectionName: collectionName, doc: document});
    return;
}

export function objectToCMSScheme(object: Object) : Object[] {
    let ret = [];
    Object.keys(object).forEach(key => {
        ret.push({"value": object[key], "name": key}); 
    });
    return ret;
}

export function CMSSchemeToObject(cmsScheme: Object[]) : Object {
    let ret = {};
    cmsScheme.forEach(entry => {
        ret[entry['Key']] = entry['Value']
    });
    return ret;
}

