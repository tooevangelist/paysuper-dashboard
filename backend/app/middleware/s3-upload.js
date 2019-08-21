const aws = require('aws-sdk');
const fs = require('fs');
const _ = require('lodash');
const uuid = require('uuid');
const envUtils = require('../utils/env');

const { getEnvVariable } = envUtils;
const config = {
  s3AccessKeyId: getEnvVariable('S3_ACCESS_KEY_ID'),
  s3SecretAccessKey: getEnvVariable('S3_SECRET_ACCESS_KEY'),
  s3BucketName: getEnvVariable('S3_BUCKET_NAME'),
  s3Region: getEnvVariable('S3_REGION'),
};

const allowedTypes = [
  {
    type: 'image/jpeg',
    extention: 'jpg',
  },
  {
    type: 'image/png',
    extention: 'png',
  },
];
const maxFileSizeInMb = 30;
const maxFileSize = maxFileSizeInMb * 1000 * 1000;

const uploadFile = async file => new Promise((resolve, reject) => {
  const fileType = _.find(allowedTypes, { type: file.type });
  if (!fileType) {
    reject(new Error('The file type in not allowed'));
  }
  if (file.size > maxFileSize) {
    reject(new Error(`The file size is over ${maxFileSizeInMb}Mb`));
  }

  aws.config.update({
    accessKeyId: config.s3AccessKeyId,
    secretAccessKey: config.s3SecretAccessKey,
    region: config.s3Region,
  });

  const s3 = new aws.S3({
    apiVersion: '2006-03-01',
  });

  const stream = fs.createReadStream(file.path);
  stream.on('error', (err) => {
    reject(err);
  });

  const preKey = uuid();
  s3.upload(
    {
      Bucket: config.s3BucketName,
      Body: stream,
      Key: `${preKey}.${fileType.extention}`,
      ContentType: file.type,
    },
    (err, data) => {
      if (err) {
        reject(err);
      } else if (data) {
        resolve({
          file: {
            name: data.Key,
            nameWithoutExtention: preKey,
            extention: fileType.extention,
          },
          url: data.Location,
        });
      }
    },
  );
});

module.exports = { uploadFile };
