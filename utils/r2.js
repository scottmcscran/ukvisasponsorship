const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

exports.uploadFile = async (fileBuffer, fileName, mimeType) => {
  const uploadParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  return fileName;
};

exports.deleteFile = async (fileName) => {
  const deleteParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
  };

  await s3Client.send(new DeleteObjectCommand(deleteParams));
};

exports.getFileStream = async (fileName) => {
  const downloadParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
  };

  const response = await s3Client.send(new GetObjectCommand(downloadParams));
  return { stream: response.Body, contentType: response.ContentType };
};

exports.getFileBuffer = async (fileName) => {
  const { stream } = await exports.getFileStream(fileName);
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

exports.getSignedUrl = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
