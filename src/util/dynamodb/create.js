const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  "credentials": {
    "accessKeyId": "AKID",
    "secretAccessKey": "SECRET"
},
  region: 'localhost',
  endpoint: 'http://localhost:8000'
});

dynamodb.createTable({
  TableName: 'table-name',
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' },
    { AttributeName: 'timestamp', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'timestamp', AttributeType: 'S' },
    { AttributeName: 'name', AttributeType: 'S' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'name-index',
      KeySchema: [
        { AttributeName: 'name', KeyType: 'HASH' }
      ],
      Projection: {
        ProjectionType: 'ALL',
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
}, function(err, data) {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created:', data);
  }
});

