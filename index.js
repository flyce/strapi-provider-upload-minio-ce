const Minio = require('minio');
const mime = require("mime-types");


module.exports = {
  init(providerOptions) {
    const { port, useSSL, endPoint, accessKey, secretKey, bucket, folder, private = false, expiry = 7 * 24 * 60 * 60 } = providerOptions;
    const isUseSSL = (useSSL === 'true' || useSSL === true);
    const MINIO = new Minio.Client({
      endPoint,
      port: +port || 9000,
      useSSL: isUseSSL,
      accessKey,
      secretKey,
    });
    const checkMinioConnection = async () => {
      try {
          const buckets = await MINIO.listBuckets();
          console.log("Successfully connected to MinIO. Buckets:", buckets);
      } catch (error) {
          console.error("Failed to connect to MinIO:", error);
      }
    }
    checkMinioConnection();
    const getUploadPath = (file) => {
      const pathChunk = file.path ? `${file.path}/` : '';
      const path = folder ? `${folder}/${pathChunk}` : pathChunk;

      return `${path}${file.hash}${file.ext}`;
    };
    const getHostPart = () => {
      const protocol = isUseSSL ? 'https://' : 'http://';
      const portSuffix = ((isUseSSL && +port === 443) || (isUseSSL && +port === 80)) ? '' : `:${port}`;
      return protocol + endPoint + portSuffix + '/';
    };
    const getFilePath = (file) => {
      const hostPart = getHostPart() + bucket + '/';
      const path = file.url.replace(hostPart, '');

      return path;
    };
    return {
      uploadStream(file) {
        return this.upload(file);
      },
      upload(file) {
        return new Promise((resolve, reject) => {
          const path = getUploadPath(file);
          const metaData = {
            'Content-Type': mime.lookup(file.ext) || 'application/octet-stream',
          }
          MINIO.putObject(
            bucket,
            path,
            file.stream || Buffer.from(file.buffer, 'binary'),
            metaData,
            (err, _etag) => {
              if (err) {
                return reject(err);
              }
              const hostPart = getHostPart();
              const filePath = `${bucket}/${path}`;
              file.url = `${hostPart}${filePath}`;
              resolve();
            }
          );
        });
      },
      delete(file) {
        return new Promise((resolve, reject) => {
          const path = getFilePath(file);

          MINIO.removeObject(bucket, path, err => {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      },
      isPrivate: () => {
        return  (private === 'true' || private === true);
      },
      getSignedUrl(file) {
        return new Promise((resolve, reject) => {
          const url = new URL(file.url);
          if (url.hostname !== endPoint) {
            resolve({ url: file.url });
          } else if (!url.pathname.startsWith(`/${bucket}/`)) {
            resolve({ url: file.url });
          } else {
            const path = getFilePath(file);
            MINIO.presignedGetObject(bucket, path, +expiry, (err, presignedUrl) => {
              if (err) {
                return reject(err);
              }
              resolve({ url: presignedUrl });
            });
          }
        });
      },
    };
  },
};
