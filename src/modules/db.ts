import sql from 'mysql2/promise';
import config from '../config.json';

const connection = sql.createPool({
    connectionLimit: 10,
    user: config.db.username,
    database: config.db.database,
    password: config.db.password,
    host: config.db.host
})

async function query(sqlq: string, options: string[]) {
    const d: any = await connection.query(sqlq, options);
    return d[0];
}

export { query }