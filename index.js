const Minio = require('minio');

module.exports = {
  init(providerOptions) {
    const { port, useSSL, endPoint, accessKey, secretKey, bucket, host, folder } = providerOptions;
    const MINIO = new Minio.Client({
      endPoint,
      port: parseInt(port, 10) || 9000,
      useSSL: useSSL === "true",
      accessKey,
      secretKey,
    });
    const getPath = (file) => {
      const pathChunk = file.path ? `${file.path}/` : '';
      const path = folder ? `${folder}/${pathChunk}` : pathChunk;

      return `${path}${file.hash}${file.ext}`;
    };
    return {
      upload(file) {
        return new Promise((resolve, reject) => {
          // upload file to a bucket
          const path = getPath(file);

          MINIO.putObject(
            bucket,
            path,
            Buffer.from(file.buffer, 'binary'),
            (err, _etag) => {
              if (err) {
                return reject(err);
              }

              const hostPart = (useSSL === 'true' ? 'https://' : 'http://') + `${host}/`
              const filePath = `${bucket}/${path}`;
              file.url = `${hostPart}${filePath}`;

              resolve();
            }
          );
        });
      },
      delete(file) {
        console.log(file);
        return new Promise((resolve, reject) => {
          const path = getPath(file);

          MINIO.removeObject(bucket, path, err => {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      },
    };
  },
};
