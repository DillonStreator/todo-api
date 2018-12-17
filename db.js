const {Pool} = require('pg');

const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
console.log(connectionString);

const pool = new Pool({
    connectionString
});

pool.on('error', (err, client) => {
    console.log('Unexpected error on idle client', err);
});
pool.on('connect', async (client) => {
    console.log('connected to database!');
});

exports.GetClient = async () => {
    try {
        const client = await pool.connect();
        return client;
    }
    catch (error) {
        throw error
    }
}

exports.Query = async (query, params=[]) => {
    try {
        const client = await exports.GetClient();
        console.log('------------------ QUERY -------------');
        console.log(query);
        console.log(params);
        console.log('--------------------------------------');
        const result = await client.query(query, params);
        client.release();
        return result;
    }
    catch (error) {
        throw error;
    }
}

