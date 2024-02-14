/** Database setup for BizTime. */
const {Client} = require("pg")

let db = new Client({
    connectionString: DB_URI
})

db.connect();

modules.export = db