/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
	const map = new Map(Object.entries(obj));
	let newmap = new Map();
	for (let value of fields){
		if(map.has(value)){
			newmap.set(value,map.get(value));
		}
	}
	return Object.fromEntries(newmap.entries());
};
