const {BigQuery} = require('@google-cloud/bigquery');
const bigqueryClient = new BigQuery(); 

// relevant queries
const stateQuery = `
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
  covid.new_confirmed as new_confirmed, 
  covid.new_deceased as new_deceased,
  covid.new_persons_vaccinated, 
  covid.new_persons_fully_vaccinated,
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
ORDER BY covid.date desc
`

// county level agg query
const countyQuery = `
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
  covid.new_confirmed as new_confirmed, 
  covid.new_deceased as new_deceased,
  covid.new_persons_vaccinated, 
  covid.new_persons_fully_vaccinated,
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
  covid.aggregation_level = 2 AND
  covid.subregion1_code = "CT"
ORDER BY covid.date desc
`

// county aggregates
const countyAgg = `
SELECT
  covid.subregion2_name AS county,
  covid.subregion2_code AS fips,
  covid.location_key AS combined_key,
  SUM(covid.cumulative_confirmed) AS confirmed,
  SUM(covid.cumulative_deceased) AS deaths,
  SUM(covid.cumulative_recovered) AS recovered,
  SUM(covid.new_confirmed) as new_confirmed, 
  SUM(covid.new_deceased) as new_deceased,
  SUM(covid.new_persons_vaccinated) as new_person_vaccinated, 
  SUM(covid.new_persons_fully_vaccinated) as new_persons_fully_vacinated,
FROM
  \`bigquery-public-data.covid19_open_data.covid19_open_data\` covid
WHERE 
  LOWER(covid.country_name) LIKE "%united states of america%" AND 
  covid.aggregation_level = 2 AND
  covid.subregion1_code = "CT"
GROUP BY 1,2,3
`

async function queryBQ(query) { 
    const options = {
        query: query,
        // Location must match that of the dataset(s) referenced in the query.
        location: 'US',
    };
    // run the query 
    const [rows] = await bigqueryClient.query(options);
    console.log('Query processed');
    return rows;
}

module.exports = { queryBQ, stateQuery, countyQuery, countyAgg }; 

  