/**
 * Global utility methods
 * @author Wes Jordan, Copyright 2018.
 */

/**
 * Gets a random integer
 * @param {number} max - The highest number to get, exclusive.
 * @return {number}
 */
export function getRandomInt(max: number) : number {
    return Math.floor(Math.random() * Math.floor(max))
}