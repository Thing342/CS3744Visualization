/**
 * Contains common info on types used through application.
 * @author Wes Jordan, Copyright 2018.
 **/

/**
 * Type alias for an integer dictionary, mapping to the specified type.
 * @type T - the stored type
 */
export interface IDict<V> {
    [key: number]: V
}

/**
 * Returns the size (number of objects) in the dict.
 *
 * @type V - the value type stored in the dict
 *
 * @param {IDict<V>} dict - dict to check
 * @return {number} - the number of entries in the dict.
 */
export function dictSize<V>(dict: IDict<V>) : number {
    return Object.keys(dict).length;
}

/**
 * Iterate over the key, value pairs the the IDict.
 *
 * @type V - the value type stored in the dict
 * @type O - the output type of the mapping function.
 *
 * @param {IDict<V>} dict - Dict to map over.
 * @param {(key: number, val: V) => O} fn - Function to call, accepts the integer key and the value and returns an output.
 * @return {O[]} - The results of each function call, stored in an array
 */
export function dictMap<V, O>(dict: IDict<V>, fn: (key: number, val: V) => O) {
    return Object.keys(dict).map((k) => fn(parseInt(k, 10), dict[k]));
}

//----

export type UnitID = number;

/**
 * Type describing a Unit object.
 */
export interface IUnit {
    id: UnitID, // The unique unit ID.
    name: string, // The unit's name.
    subunitIDs: UnitID[], // The list of IDs for this unit's sub-units
    unitParentID: UnitID // The ID of this unit's parent.
}

//----

/**
 * Kludge type for the react-d3-tree node type
 */
export interface ITreeNode {
    name: string, // Name displayed in the tree
    attributes: any // Attributes displayed below the name
    children: ITreeNode[] // Child nodes
}

/**
 * Converts a unit dictionary into a ITreeNode tree.
 * @param {IDict<IUnit>} units - unit dictionary.
 * @param {UnitID} rootID - unit root to start at.
 * @return {ITreeNode} - A completed tree of the data.
 */
export function constructTree(units: IDict<IUnit>, rootID: UnitID) : ITreeNode {
    const unit = units[rootID];
    if(unit) {
        return {
            attributes: {
                id: rootID
            },
            children: unit.subunitIDs.map(x => constructTree(units, x)),
            name: unit.name
        }
    } else {
        return {
            attributes: {},
            children: [],
            name: "No data"
        }
    }
}

//----

export enum AlertType {
    SUCCESS = "alert-success",
    FAILURE = "alert-danger",
    INFO = "alert-info",
    WARNING = "alert-warning"
}

export interface IAlert {
    level: AlertType,
    message: string,
    linkText: string | null,
    linkURL: string | null
}


export type UserLevel = number;
export const USERLEVEL_ADMIN: UserLevel     = 3;
export const USERLEVEL_EDITOR: UserLevel    = 2;
export const USERLEVEL_COMMENTOR: UserLevel = 1;
export const USERLEVEL_ANYONE: UserLevel    = 0;