import { MESSAGES } from '../constants';
import { HttpStatus } from '@nestjs/common';
import { ResponseData } from 'src/dto';

export function SuccessMsgResponse(message = MESSAGES.SUCCESSFUL) {
  return { status: HttpStatus.OK, message };
}

export function SuccessResponse(data: any, message = MESSAGES.SUCCESSFUL) {
  return { status: HttpStatus.OK, message, data };
}

HttpStatus.CREATED
