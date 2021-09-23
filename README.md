This upload provider uses the [JavaScript Minio.Client](https://docs.min.io/docs/javascript-client-api-reference.html) to upload files to a (self hosted) instance of [Minio](https://min.io/).

It's compatible with the strapi ce 3.6.8.
# how to use
## installation
`npm i --save strapi-provider-upload-minio-ce`

## config
```
// file: ./config/plugins.js
module.exports = ({ env }) => ({
  upload: {
    provider: 'minio',
    providerOptions: {
      accessKey: env('MINIO_ACCESS_KEY',),
      secretKey: env('MINIO_SECRET_KEY'),
      bucket: env('MINIO_BUCKET'),
      endPoint: env('MINIO_ENDPOINT'),
      port: env('MINIO_PORT'),
      useSSL: env('MINIO_USE_SSL', 'true'),
      host: env('MINIO_HOST'),
      folder: env('MINIO_FOLDER'),
    },
  },
});

```