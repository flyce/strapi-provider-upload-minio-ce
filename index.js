const Minio = require('minio');

module.exports = {
  init(providerOptions) {
    // init your provider if necessary
    const { port, useSSL, endPoint, accessKey, secretKey, bucket, host, folder } = providerOptions;
    const MINIO = new Minio.Client({
      endPoint,
      port: parseInt(port, 10) || 9000,
      useSSL: true,
      accessKey,
      secretKey,
    });
    return {
      upload(file) {
        return new Promise((resolve, reject) => {
          // upload file to a bucket
          let path = `${file.hash}${file.ext}`;
          if (folder) {
            path = `${folder}/${path}`
          }

          MINIO.putObject(
            bucket,
            path,
            Buffer.from(file.buffer, 'binary'),
            (err, _etag) => {
              if (err) {
                return reject(err);
              }

              const hostPart = (useSSL ? 'https://' : 'http://') + `${host}/`
              const filePath = `${bucket}/${path}`;
              file.url = `${hostPart}${filePath}`;
              console.log(file);


              resolve();
            }
          );
        });
      },
      delete(file) {
        console.log(file);
        return new Promise((resolve, reject) => {
          let path = `${file.hash}${file.ext}`;
          if (folder) {
            path = `${folder}/${path}`
          }
          console.log(path);

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
