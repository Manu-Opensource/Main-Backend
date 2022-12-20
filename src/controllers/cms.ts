//Originally this served greater purpose as this was built around an external CMS, but since transitioning to Github as a CMS, this just serves as a wrapper
//for the remnants of the original CMS (Which is just used to store user data now)
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
        if (e.response.status == 401) {
            await CMS_LOGIN();
            return await CMS_GET(path, args);
        } else return null;
    });
    return res ? res.data : null;
}

async function CMS_POST(path: string, args?: any) : Promise<any> {
    let res = await axiosClient.post(`${CMS_LINK}/api/${path}`, args ? args : {}).catch(async e => {
        console.log(e);
        if (e.response.status == 401) {
            await CMS_LOGIN();
            return await CMS_POST(path, args);
        } else return null;
    });
    return res ? res.data : null;
}
async function CMS_LOGIN() {
    await CMS_GET("login", {username: CMS_USERNAME, password: CMS_PASSWORD});
}

export async function getCollection(collectionName: string): Promise<Object[]> | null  {
    if (collectionName.startsWith("cms")) return null;
    let collection = (await CMS_GET(`get-collection/${collectionName}`)) as Object[] | void; 
    if (collection) return collection;
    else return null;
}

export async function getDocumentByQuery(collectionName: string, query: Object) : Promise<Object> | null {
    if (collectionName.startsWith("cms")) return null;
    let document = (await CMS_POST(`get-document/${collectionName}`, {query: query})) as Object[] | void;
    if (document) return document;
    else return null;
}

export async function getDocument(collectionName: string, documentId: string): Promise<Object> | null {
    return getDocumentByQuery(collectionName, {id: documentId});
}

export async function addDocument(collectionName: string, document: Object) : Promise<null> | null {
    if (collectionName.startsWith("CMS")) return null;
    await CMS_POST(`add-document/${collectionName}`, document);
    return;
}

export async function updateDocumentByQuery(collectionName: string, document: Object, query: Object) : Promise<null> | null {
    if (collectionName.startsWith("CMS")) return null;
    let body = {query: query};
    Object.keys(document).forEach(key => {body[key] = document[key]});
    await CMS_POST(`update-document/${collectionName}`, body);
    return;
}

export async function updateDocument(collectionName: string, document: Object, documentId: string) : Promise<null> | null {
    return updateDocumentByQuery(collectionName, document, {id: documentId})
}
