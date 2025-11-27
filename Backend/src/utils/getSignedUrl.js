import AWS from "aws-sdk";
import config from "../config/env.js";

const s3 = new AWS.S3({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.AWS_BUCKET
});

export default function getSignedQrUrl(key) {
  return s3.getSignedUrl("getObject", {
    Bucket: config.AWS_BUCKET,
    Key: key,
    Expires: 60 * 5
  });
}
