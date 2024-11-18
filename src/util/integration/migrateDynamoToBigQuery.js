const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKID",
  secretAccessKey: "SECRET",
  sessionToken: "TOKEN",
});
const dynamodb = new AWS.DynamoDB.DocumentClient();



const credentials = 'jsonKey.json'
async function SaveToBq(id) {
  try {
      const bigQuery = new BigQuery({ projectId, credentials })

      const query = `
          INSERT INTO \`sbbx.dataset.tablename\` 
          SELECT *
          FROM \`sbbx.dataset.tablenam\`
          WHERE NOT EXISTS (
              SELECT 1
              FROM \`sbbx.dataset.tablenam\`
              WHERE id = '${id}'
          )
      `
      const [job] = await bigQuery.createQueryJob({ query, location: 'US' })
      const [rows] = await job.getQueryResults()

      console.log(`Rows fetched: ${rows.length}`)

      return rows

  } catch (error) {
      console.error(error)
      throw error

  }

}