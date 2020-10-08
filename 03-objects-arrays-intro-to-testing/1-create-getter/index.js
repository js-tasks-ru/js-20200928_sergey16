/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
 return function getter(product){
		if (path){
			let rez = product;
			const arr = path.split('.');
			for (const item of arr){
				if (item in rez)	rez = rez[item];
				else return;
			}
			return rez;	
			
		}
		else console.log("Не введен корректный путь");
	}
}
