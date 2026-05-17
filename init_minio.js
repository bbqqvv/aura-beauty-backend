const Minio = require("minio");

// Configure MinIO Client
const minioClient = new Minio.Client({
  endPoint: '127.0.0.1',
  port: 9005,
  useSSL: false,
  accessKey: 'shofyadmin',
  secretKey: 'shofypassword123'
});

const BUCKET_NAME = 'aura-beauty';

// Ensure bucket exists
const initBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      // Set bucket policy to public so images can be viewed
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["s3:GetObject"],
            Effect: "Allow",
            Principal: "*",
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
          }
        ]
      };
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
      console.log(`Bucket '${BUCKET_NAME}' created successfully.`);
    } else {
      console.log(`Bucket '${BUCKET_NAME}' already exists.`);
    }
  } catch (error) {
    console.error("Error initializing MinIO bucket:", error);
  }
};
initBucket();
