import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksFilterDto } from './dto/filter-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './tasks.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasks_service: TasksService) {}

  @Get()
  async getTasks(
    @Query() params: TasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    // if filters are defined, call service to execute get tasks with filters method
    // otherwise, just call service to execute get all tasks method
    if (Object.keys(params).length) {
      return this.tasks_service.getTasksWithFilters(params, user);
    } else {
      return this.tasks_service.getAllTasks(user);
    }
  }

  @Get(':id')
  async getSingleTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasks_service.getTaskByID(id, user);
  }

  @Post()
  async createNewTask(
    @Body() payload: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasks_service.createTask(payload, user);
  }

  @Patch(':id')
  async updateSingleTask(
    @Param('id') id: string,
    @Body() payload: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = payload;
    return this.tasks_service.updateTask(id, status, user);
  }

  @Delete(':id')
  async deleteSingleTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<object> {
    const deleted = await this.tasks_service.deleteTask(id, user);
    return { message: deleted };
  }
}
