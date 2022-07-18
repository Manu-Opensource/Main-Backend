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

export async function getCollections(): Promise<Document[][]> {
    let collections = (await CMS_GET("collections")) as Document[][] | void;
    if (collections) return collections;
    else return null;
}

export async function getCollection(collectionName: string): Promise<Document[]>  {
    let collection = (await CMS_GET("collection", {name: collectionName})) as Document[] | void; 
    if (collection) return collection;
    else return null;
}
