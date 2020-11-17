const {Pool} = require('pg');

function Request(connectionString) {
    this.pool = new Pool({
        connectionString,
    });
    this.pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    });
};

Request.prototype.execute = function(sql, binds) {
    return new Promise( (resolve, reject ) => {
        this.pool
        .connect()
        .then(client => 
            client.query(sql, binds)
            .then(res => resolve(res))
            .catch(e => console.error(e))
            .finally(() => client.release())
        );
    });
};



module.exports = Request;
