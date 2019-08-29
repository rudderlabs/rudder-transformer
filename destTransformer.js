var server = require("./transformerServer");
var router = require("./transformerRouter");
require("./util/logUtil");
server.start(9090, router.route);
