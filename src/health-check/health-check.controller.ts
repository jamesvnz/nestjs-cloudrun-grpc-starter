import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { HealthCheckRequest, HealthCheckResponse } from 'grpc-ts-health-check';

@Controller()
export class HealthCheckController {
  //Note: an interesting side effect is that you can add both HTTP and GRPC
  //to the same controller operation.
  @Get('health')
  @GrpcMethod('Health')
  Check(data: HealthCheckRequest.AsObject): HealthCheckResponse.AsObject {
    return {
      status: HealthCheckResponse.ServingStatus.SERVING,
    };
  }
}
