import { Controller, Get, Req } from '@nestjs/common';

@Controller('')
export class HealthCheckController {
  @Get()
  check(@Req() req) {
    return { OK: true, date: new Date().toISOString(), ip: req.ip };
  }
}
