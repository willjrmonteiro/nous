const configcat = require('configcat-node')

const key = "configcat/key"

const configCatClient = configcat.getClient(key);

configCatClient.getValueAsync('flag', '').then(value => {
    console.log(value);
}).catch(err => {
    console.log(err);
});

configCatClient.getAllKeysAsync().then(keys => {
    keys.forEach(key => {
        configCatClient.getValueAsync(key, '').then(value => {
            console.log(value);
        }).catch(err => {
            console.log(err);
        });
    })
}).catch(err => {
    console.log(err);
})
