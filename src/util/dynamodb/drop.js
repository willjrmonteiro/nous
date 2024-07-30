
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  "credentials": {
    "accessKeyId": "AKID",
    "secretAccessKey": "SECRET"
},
  region: 'localhost',
  endpoint: 'http://localhost:8000'
});

const params = {
  TableName: 'table-name'
};

dynamodb.deleteTable(params, function(err, data) {
  if (err) {
    console.error('Error deleting table:', err);
  } else {
    console.log('Table deleted:', data);
  }
});
