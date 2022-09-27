This upload provider uses the [JavaScript Minio.Client](https://docs.min.io/docs/javascript-client-api-reference.html) to upload files to a (self hosted) instance of [Minio](https://min.io/).

It's compatible with the strapi ce 3.6.x and 4.x.

# How to use

## Installation

`npm i --save strapi-provider-upload-minio-ce`

## Config

### For strapi ce 4.x
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
    provider: 'minio-ce',
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

### Pictures cannot be displayed?
Mostly because of CSP, you can refer to [https://github.com/strapi/strapi/issues/12886](https://github.com/strapi/strapi/issues/12886) 

If the image you uploaded is not displayed properly, you need to modify `./config/middlewares.js` as follows.
```js
// ./config/middlewares.js
module.exports = [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "REPLACE_YOUR_MINIO_HOST_HRER",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "REPLACE_YOUR_MINIO_HOST_HRER",
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];

```