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
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksFilterDto } from './dto/filter-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasks_service: TasksService) {}

  @Get()
  getTasks(@Query() params: TasksFilterDto): Task[] {
    // if filters are defined, call service to execute get tasks with filters method
    // otherwise, just call service to execute get all tasks method
    if (Object.keys(params).length) {
      return this.tasks_service.getTasksWithFilters(params);
    } else {
      return this.tasks_service.getAllTasks();
    }
  }

  @Get(':id')
  getSingleTask(@Param('id') id: string): Task {
    return this.tasks_service.getTaskByID(id);
  }

  @Post()
  createNewTask(@Body() payload: CreateTaskDto): Task {
    return this.tasks_service.createTask(payload);
  }

  @Patch(':id')
  updateSingleTask(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.tasks_service.updateTask(id, status);
  }

  @Delete(':id')
  deleteSingleTask(@Param('id') id: string): string {
    return this.tasks_service.deleteTask(id);
  }
}
