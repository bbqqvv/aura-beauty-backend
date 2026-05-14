const { secret } = require("../config/secret");
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
    }
  } catch (error) {
    console.error("Error initializing MinIO bucket:", error);
  }
};
initBucket();

const cloudinaryImageUpload = (imageBuffer) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Generate a unique filename
      const filename = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
      
      // Upload to MinIO
      await minioClient.putObject(BUCKET_NAME, filename, imageBuffer);
      
      // Return a Cloudinary-like response format
      resolve({
        secure_url: `http://localhost:9005/${BUCKET_NAME}/${filename}`,
        public_id: filename
      });
    } catch (error) {
      console.error('Error uploading to MinIO:', error);
      reject(error);
    }
  });
};

const cloudinaryImageDelete = async (public_id) => {
  try {
    // If public_id contains folder (like folder_name/id), we only need the filename 
    // but in our MinIO setup, public_id is just the filename.
    const filename = public_id.includes('/') ? public_id.split('/').pop() : public_id;
    await minioClient.removeObject(BUCKET_NAME, filename);
    return { result: 'ok' };
  } catch (error) {
    console.error('Error deleting from MinIO:', error);
    throw error;
  }
};

exports.cloudinaryServices = {
  cloudinaryImageDelete,
  cloudinaryImageUpload,
};
