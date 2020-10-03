/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
	let newarr = arr.slice();
	let collator = new Intl.Collator(['ru','en'], {sensitivity: 'case',caseFirst: 'upper'});
	newarr.sort(function(a, b) {
		return collator.compare(a, b);
	});
	if (param === 'asc') return newarr;
	else if (param === 'desc') return newarr.reverse();
}