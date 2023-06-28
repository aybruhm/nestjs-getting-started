import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksFilterDto } from './dto/filter-tasks.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasks_repository: TasksRepository,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.tasks_repository.getTasks();
  }

  async getTaskByID(id: string): Promise<Task> {
    /* ---------------------------------------
    Service responsible for getting a task by its ID.
    ---------------------------------------*/
    const task = await this.tasks_repository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }
  async getTasksWithFilters(params: TasksFilterDto): Promise<Task[]> {
    /* ----------------------------------------------------------
    Service responsible for getting a list of filtered tasks.
    -----------------------------------------------------------*/
    const tasks = await this.tasks_repository.getTasksByOptions(params);
    return tasks;
  }

  async createTask(payload: CreateTaskDto): Promise<Task> {
    /* ---------------------------------------
    Service responsible for creating a task.
    ---------------------------------------*/
    return this.tasks_repository.createTask(payload);
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    /* ---------------------------------------
    Service responsible for updating a task.
    ---------------------------------------*/
    const task = await this.getTaskByID(id);
    console.log('Task Status: ', status);
    return task;
  }

  async deleteTask(id: string): Promise<string> {
    /* ---------------------------------------
    Service responsible for deleting a task.
    ---------------------------------------*/
    const task = await this.getTaskByID(id);
    this.tasks_repository.deleteTask(task);
    return 'Task successfully deleted!';
  }
}
