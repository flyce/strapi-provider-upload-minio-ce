This upload provider uses the [JavaScript Minio.Client](https://docs.min.io/docs/javascript-client-api-reference.html) to upload files to a (self hosted) instance of [Minio](https://min.io/).

It's compatible with the strapi ce 3.6.8 and 4.0.0.

# How to use

## Installation

`npm i --save strapi-provider-upload-minio-ce`

## Config

### For strapi ce 4.0.0
```js
// file: ./config/plugins.js
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-minio-ce',
      providerOptions: {
        accessKey: env('MINIO_ACCESS_KEY', 'Q3AM3UQ867SPQQA43P2F'),
        secretKey: env('MINIO_SECRET_KEY', 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'),
        bucket: env('MINIO_BUCKET', 'test-2021-09-22'),
        endPoint: env('MINIO_ENDPOINT', 'play.min.io'),
        port: env('MINIO_PORT', '9000'),
        useSSL: env('MINIO_USE_SSL', 'true'),
        host: env('MINIO_HOST', 'play.min.io'),
        folder: env('MINIO_FOLDER', 'cms'),
      },
    },
  },
});

```

### For strapi ce 3.6.8
```js
// file: ./config/plugins.js
module.exports = ({ env }) => ({
  upload: {
    provider: 'minio',
    providerOptions: {
      accessKey: env('MINIO_ACCESS_KEY', 'Q3AM3UQ867SPQQA43P2F'),
      secretKey: env('MINIO_SECRET_KEY', 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'),
      bucket: env('MINIO_BUCKET', 'test-2021-09-22'),
      endPoint: env('MINIO_ENDPOINT', 'play.min.io'),
      port: env('MINIO_PORT', '9000'),
      useSSL: env('MINIO_USE_SSL', 'true'),
      host: env('MINIO_HOST', 'play.min.io'),
      folder: env('MINIO_FOLDER', 'cms'),
    },
  },
});
```
