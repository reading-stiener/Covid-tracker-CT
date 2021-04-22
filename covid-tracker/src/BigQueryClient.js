const {BigQuery} = require('@google-cloud/bigquery');
const bigqueryClient = new BigQuery(); 

// relevant queries
// overall aggregates
const aggQuery = `
SELECT
  covid.subregion1_name AS province_state,
  covid.country_name AS country_region,
  covid.date,
  covid.latitude, 
  covid.longitude, 
  covid.subregion1_name AS state,
  covid.subregion2_name AS county,
  covid.location_geometry AS location_geom,
  covid.cumulative_confirmed AS confirmed,
  covid.cumulative_deceased AS deaths,
  covid.cumulative_recovered AS recovered,
  CASE
    WHEN covid.cumulative_confirmed is NULL THEN NULL
    WHEN covid.cumulative_deceased is NULL THEN NULL
    WHEN covid.cumulative_recovered is NULL THEN NULL
    ELSE (covid.cumulative_confirmed-covid.cumulative_recovered-covid.cumulative_deceased)
    END
  AS active,
  covid.subregion2_code AS fips,
  covid.location_key AS combined_key
FROM
  \`bigquery-public-data.covid19_open_data.covid19_open_data\` covid
WHERE 
  LOWER(covid.country_name) LIKE "%united states of america%" AND 
  covid.aggregation_level = 1 AND
  covid.subregion1_code = "CT"
`
async function queryBQ(query) { 
    const options = {
        query: aggQuery,
        // Location must match that of the dataset(s) referenced in the query.
        location: 'US',
    };
    // run the query 
    const [rows] = await bigqueryClient.query(options);
    console.log('Query processed');
    // console.log(rows);
    return rows;
}

module.exports = { queryBQ }; 

  