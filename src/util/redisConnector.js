const redis = require('redis');

class DBConnector {
    constructor(hostname, port, password) {
        this.hostname = hostname;
        this.port = port;
        this.password = password;
        this.connect();
    };

    async connect() {
        this.client = await redis.createClient({
            socket: {
                host: this.hostname,
                port: this.port
            }
        });
        this.client
            .connect()
            .then(async (res) => {
                console.log('connected');
            })
            .catch((err) => {
                console.log('err happened' + err);
            });
    }

    async postToDB(key, val) {
        await this.client.set(`${key}`, `${val}`);
        console.log("Inserted Key: ", key, " Val: ", val);
    };

    async getFromDB(key) {
        try {
            const value = await this.client.get(`${key}`);
            if (value === null) {
                console.log(" Val: ", value);
                return 1;
            }
            console.log("Got Val: ", value);
            return value;
        }
        catch (e) {
            console.error(e);
            return "error";
        }
    };
};

const redisConnector = new DBConnector('localhost', 6379, 'abcd')

module.exports = { redisConnector }