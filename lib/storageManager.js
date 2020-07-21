const AWS = require('aws-sdk');
const { uuid } = require('uuidv4');
const config = require('config');

const S3credentials = config.secrets.s3 ? { accessKeyId: config.secrets.s3.keyId, secretAccessKey: config.secrets.s3.secretKey } : {};
const s3 = new AWS.S3(S3credentials);
const prefix = config.storage.s3Url;

class StorageManager {
    putFile(file, ext) {
        const filename = uuid().replace(/-/g, '_') + (ext || '.ext');
        const fullUrl = prefix + filename;
        return s3.putObject({ Bucket: config.storage.bucketName, Key: filename, Body: file }).promise()
        .then(() => fullUrl);
    }
    deleteFile(fileName) {
        return s3.deleteObject({ Bucket: config.storage.bucketName, Key: fileName.substring(prefix.length) }).promise();
    }
}

module.exports = new StorageManager();