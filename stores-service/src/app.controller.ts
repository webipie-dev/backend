import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}
}
