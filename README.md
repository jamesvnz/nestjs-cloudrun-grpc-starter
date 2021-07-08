## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository, with support for GRPC and deployment to Google Cloud run.

The main differences from the base NestJS project are:
- Installation of the ```@nestjs/config package```.
- Server listening port will use the ```PORT``` Environment variable if set.
- A global prefix (e.g. ```/api/```) can be set with ```GLOBAL_PREFIX``` environment variable. If not set, no prefix is configured.
- Addition of a 2 step builder Dockerfile, .dockerignore. 
- Addition of .gcloudignore
- Addition of GRPC + GRPC health check

TODO
- Add in support for Bearer token verification and GRPC authentication
- Consider distroless production runtime

## Installation

```bash
$ npm install
```
Create a ```.env``` file if you wish to set environment variables locally.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Testing GRPC

Install ```grpcurl``` and run command to verify health of server:
```sh
grpcurl -import-path protos -proto protos/health.proto -plaintext localhost:5000 grpc.health.v1.Health/Check
```
You should get a response similar to:
```json
{
"status": "SERVING"
}
```


## Deployment

### Quick Deployment
Clicking this button from your Github repo will deploy the code straight to Cloud Run.

[![Run on Google Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run)

### Manual Deployment

The following will build and deploy the current source directory to a new service. (Replace ```SERVICE``` with the name you want for your service)
```bash
gcloud beta run deploy SERVICE --use-http2 --source .
```
Note: If you’d like to stream gRPCs with HTTP/2, add the flag --use-http2

## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
