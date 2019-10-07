//Conditional enable/disable of logging
const DEBUG = false;
if (!DEBUG){
	console.log = function (){};
}