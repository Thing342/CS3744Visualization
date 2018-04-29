import axios from 'axios';
import {IDict, IUnit} from "./types";

export type Fetch = IDict<IUnit>;

export async function read(backend: string) : Promise<Fetch> {
    const url = backend + "/companies/json";
    const resp = await axios.get<Fetch>(url);

    return resp.data;
}