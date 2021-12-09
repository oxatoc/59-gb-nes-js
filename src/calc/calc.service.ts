import { Injectable } from '@nestjs/common';
import { CalcDto } from './calc-dto.interface';
import { OperationType } from './operation-type';

@Injectable()
export class CalcService {
  calculate(operation: OperationType, calcDto: CalcDto) {
    switch (operation) {
      case 'plus':
        return calcDto.a + calcDto.b;
      case 'minus':
        return calcDto.a - calcDto.b;
      case 'multiply':
        return calcDto.a * calcDto.b;
    }
  }
}
