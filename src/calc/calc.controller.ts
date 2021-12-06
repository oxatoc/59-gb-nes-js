import { Body, Controller, Patch, Put, Req } from '@nestjs/common';
import { CalcDto } from './calc-dto.interface';
import { Request } from 'express';
import { CalcService } from './calc.service';
import { OperationType } from './operation-type';

@Controller('calc')
export class CalcController {
  constructor(private calcService: CalcService) {}

  @Put()
  calcPut(@Req() request: Request, @Body() calcDto: CalcDto) {
    const operation = request.headers['type-operation'] as OperationType;
    return this.calcService.calculate(operation, calcDto);
  }
  @Patch()
  calcPatch(@Req() request: Request, @Body() calcDto: CalcDto) {
    const operation = request.headers['type-operation'] as OperationType;
    return this.calcService.calculate(operation, calcDto);
  }
}
