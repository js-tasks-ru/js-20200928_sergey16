/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
	const arr = Array.from(string);
	const newarr =[];
	if (size==0) return "";
	else if (!size) return string;
	else {
		let counter = size;
		let prev = "";
		arr.forEach((item,index,array)=>{
			if (item === prev && counter>0){
				counter+= -1;
				if (counter>0)newarr.push(item);
			}		
			else if (item !== prev){
				prev=item;
				counter = size;
				newarr.push(item);
			}
		});	
		return newarr.join('');
	}
}
