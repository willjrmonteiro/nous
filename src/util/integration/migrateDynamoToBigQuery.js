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

async function getServicesWithFlowAction(initialDate) {
  const today = new Date();
  let currentDate = new Date(initialDate);

  while (currentDate <= today) {
    const formattedDate = currentDate.toISOString().slice(0, 10);
    console.log(`Buscando registros para ${formattedDate}...`);

    try {
      const params = {
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: "#dt = :dt",
        ExpressionAttributeNames: {
          "#dt": "dateOfVisit",
        },
        ExpressionAttributeValues: {
          ":dt": formattedDate,
        },
      };

      let lastEvaluatedKey = undefined;

      do {
        if (lastEvaluatedKey) {
          params.ExclusiveStartKey = lastEvaluatedKey;
        }

        const data = await dynamodb.query(params).promise();
        const items = data.Items;
        lastEvaluatedKey = data.LastEvaluatedKey;

        if (items.length > 0) {
          const flowActionServices = allItems.push(
            ...items.filter((item) => item.hasOwnProperty("key"))
          );

          for (const item of flowActionServices) {
            try {
              await SaveToBq(item.serviceId, item.flowAction.voucherCode);
              console.log(`Registro ${item.serviceId} salvo no BigQuery!`);
            } catch (error) {
              console.error(
                `Erro ao salvar registro ${item.serviceId} no BigQuery:`,
                error
              );
            }
          }
        }
      } while (lastEvaluatedKey);
    } catch (error) {
      console.error(`Erro ao buscar registros para ${formattedDate}:`, error);
      throw error;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
}

async function saveToCsv() {
  const data = await getServicesWithFlowAction("2024-07-04");
  const csvHeader = "id";
  const filePath = path.join(__dirname, "result.csv");
  const csv = data
    .map(
      (item) =>
        `${item.id}`
    )
    .join("\n");
  fs.writeFileSync(filePath, `${csvHeader}\n${csv}`);
}

saveToCsv()
  .then(() => {
    console.log("Arquivo salvo com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao salvar arquivo:", error);
  });
