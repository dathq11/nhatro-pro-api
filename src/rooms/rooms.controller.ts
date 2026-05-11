import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common'
import { RoomsService } from './rooms.service'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'

@Controller()
export class RoomsController {
  constructor(private readonly service: RoomsService) {}

  @Get('properties/:propertyId/rooms')
  findByProperty(@Param('propertyId') propertyId: string) {
    return this.service.findByProperty(propertyId)
  }

  @Post('properties/:propertyId/rooms')
  create(@Param('propertyId') propertyId: string, @Body() dto: CreateRoomDto) {
    return this.service.create(propertyId, dto)
  }

  @Get('rooms/:id')
  findOne(@Param('id') id: string) { return this.service.findOne(id) }

  @Patch('rooms/:id')
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) { return this.service.update(id, dto) }

  @Delete('rooms/:id')
  remove(@Param('id') id: string) { return this.service.remove(id) }
}
