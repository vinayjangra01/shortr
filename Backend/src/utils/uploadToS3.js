import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import config from '../config/env.js';

const s3 = new AWS.S3({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region
});

async function uploadQR(base64QR)
{
    const buffer = Buffer.from(base64QR.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const fileName = `qr/${uuid()}.png`;

    await s3
    .putObject({
        Bucket: config.AWS_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: "image/png",
        ContentEncoding: "base64"
    })
    .promise();

    return fileName;
}

export default uploadQR;