export type UnitID = number;

export interface IDict<V> {
    [key: number]: V
}

export function dictSize<V>(dict: IDict<V>) : number {
    return Object.keys(dict).length;
}

export function dictMap<V, O>(dict: IDict<V>, fn: (key: number, val: V) => O) {
    return Object.keys(dict).map((k) => fn(parseInt(k, 10), dict[k]));
}


export interface IUnit {
    id: UnitID,
    name: string,
    subunitIDs: UnitID[]
}


export interface ITreeNode {
    name: string,
    attributes: any
    children: ITreeNode[]
}

export function constructTree(units: IDict<IUnit>, rootID: UnitID) : ITreeNode {
    const unit = units[rootID];
    return {
        attributes: {
            id: rootID
        },
        children: unit.subunitIDs.map(x => constructTree(units, x)),
        name: unit.name
    }
}


export enum AlertType {
    SUCCESS = "alert-success",
    FAILURE = "alert-danger",
    INFO = "alert-info",
    WARNING = "alert-warning"
}

export interface IAlert {
    level: AlertType,
    message: string,
    linkText: string,
    linkURL: string
}


export type UserLevel = number;
export const USERLEVEL_ADMIN: UserLevel     = 3;
export const USERLEVEL_EDITOR: UserLevel    = 2;
export const USERLEVEL_COMMENTOR: UserLevel = 1;
export const USERLEVEL_ANYONE: UserLevel    = 0;