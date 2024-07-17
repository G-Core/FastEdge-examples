# S3 uploader

This edge app uploads the file to S3 bucket.

## Config

S3 bucket access params are configured in environment variables:

- `ACCESS_KEY` - bucket access key
- `SECRET_KEY` - bucket secret key
- `REGION` - region name, for example `s-ed1`
- `BASE_HOSTNAME` - base name (without region), for example `cloud.gcore.lu`
- `BUCKET` - bucket name

## Using the app

Send the file content using `POST` or `PUT` method. It is recommeneded to specify correct `Content-Type`, if it is no specified, default `application/octet-stream` is used.

Filename must be specified in `name` param of URL query.
