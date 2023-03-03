const redis = require('redis');
const log =  require('../logger');

class DBConnector {
    constructor(hostname, port, password) {
        this.hostname = hostname;
        this.port = port;
        this.password = password;
        this.connect()
    };

    async connect() {
        this.client = await redis.createClient();
        this.client
            .connect()
            .then( (res) => {
                log.info('Redis Connected');
            })
            .catch((err) => {
                log.info(`err happened${  err}`);
            });
    }

    async postToDB(key, val) {
        await this.client.set(`${key}`, `${val}`);
    };

    async getFromDB(key) {
        try {
            const value = await this.client.get(`${key}`);
            return value;
        }
        catch (e) {
            log.error(`get ${e}`);
            return "error";
        }
    };
};

const redisConnector = () =>{
    const host = process.env.REDIS_HOST || 'localhost';
    const port = process.env.REDIS_PORT || 6379;
    const password = process.env.REDIS_PASSWORD || "";
    const redisInstance = new DBConnector(host, port, password)
    return redisInstance;
}

module.exports = { redisConnector }