import axios from 'axios';
import {IDict, IUnit, UnitID} from "./types";

export type Fetch = IDict<IUnit>;

export interface IAPISuccess<T> {
    resourceID: UnitID,
    result: string,
    value: T,
}

export interface IAPIFailure {
    result: string,
    error: string
}

export type APIResult<T> = IAPISuccess<T> | IAPIFailure;

export async function read(backend: string) : Promise<Fetch> {
    const url = backend + "/companies/json";
    const resp = await axios.get<Fetch>(url);

    return resp.data;
}

export async function create(backend: string, payload: IUnit) : Promise<IAPISuccess<Fetch>> {
    const url = backend + "/companies/json";
    const response = await axios.post<APIResult<Fetch>>(url, payload);

    if(response.data.result !== "success") {
        throw (response.data as IAPIFailure).error;
    }

    return response.data as IAPISuccess<Fetch>;
}

export async function remove(backend: string, id: UnitID) : Promise<IAPISuccess<Fetch>> {
    const url = backend + "/companies/json/delete/" + id;
    const response = await axios.post<APIResult<Fetch>>(url);

    if(response.data.result !== "success") {
        throw (response.data as IAPIFailure).error;
    }

    return response.data as IAPISuccess<Fetch>;
}