const RSServerDestination = require("../../../../core/destination/RSServerDestination");

class S3 extends RSServerDestination {
    customTransformer = (event) => {
        return event.message;
    };

    constructor(event) {
        super();
        this.prepare(event);
    }
}

module.exports = S3;