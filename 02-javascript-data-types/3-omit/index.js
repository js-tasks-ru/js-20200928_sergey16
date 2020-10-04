/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
 	const map = new Map(Object.entries(obj));
	for (let value of fields){
		if(map.has(value)){
			map.delete(value);
		}
	}
	return Object.fromEntries(map.entries());
};
