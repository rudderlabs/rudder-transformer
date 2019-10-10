//Conditional enable/disable of logging
const DEBUG = true;
if (!DEBUG){
	console.log = function (){};
}