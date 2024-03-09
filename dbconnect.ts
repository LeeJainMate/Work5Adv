import mysql from "mysql";
import util from "util";


export const conn = mysql.createPool(
    {
        connectionLimit : 10,
        host : "nv1.metrabyte.cloud",
        user : "aemandko_65011212132",
        password : "65011212132",
        database : "aemandko_65011212132"
    }
);
export const queryAsync = util.promisify(conn.query).bind(conn);
export { mysql };
