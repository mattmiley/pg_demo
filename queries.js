const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'osm',
    password: 'postgres',
    port: 5432,
})

const getDefects = (request, response) => {
    pool.query('SELECT id, type, ST_asText(geom) geom FROM defects', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getBuildings = (request, response) => {
    pool.query('SELECT id, name, ST_asText(geom) geom FROM buildings', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createDefect = (request, response) => {
    const { name, lon, lat } = request.body

    var qry = 'INSERT INTO defects (type, geom) VALUES (\'' + name + '\', ST_GeomFromText(\'POINT('+ lon +' ' + lat +')\', 4326))';
    pool.query(qry, (error, result) => {
        if (error) {
            response.status(409).json(`Error: ${error.message}`)
            // throw error
        }
        else{
            response.status(201).json(`Defect added sucessfully`)
        }
    })
}


module.exports = {
    getDefects,
    getBuildings,
    createDefect
}
