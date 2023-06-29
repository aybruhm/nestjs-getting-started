import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksFilterDto } from './dto/filter-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './tasks.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasks_service: TasksService) {}

  @Get()
  async getTasks(@Query() params: TasksFilterDto): Promise<Task[]> {
    // if filters are defined, call service to execute get tasks with filters method
    // otherwise, just call service to execute get all tasks method
    if (Object.keys(params).length) {
      return this.tasks_service.getTasksWithFilters(params);
    } else {
      return this.tasks_service.getAllTasks();
    }
  }

  @Get(':id')
  async getSingleTask(@Param('id') id: string): Promise<Task> {
    return this.tasks_service.getTaskByID(id);
  }

  @Post()
  async createNewTask(@Body() payload: CreateTaskDto): Promise<Task> {
    return this.tasks_service.createTask(payload);
  }

  @Patch(':id')
  async updateSingleTask(
    @Param('id') id: string,
    @Body() payload: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = payload;
    return this.tasks_service.updateTask(id, status);
  }

  @Delete(':id')
  async deleteSingleTask(@Param('id') id: string): Promise<object> {
    const deleted = await this.tasks_service.deleteTask(id);
    return { message: deleted };
  }
}
