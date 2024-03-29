import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksFilterDto } from './dto/filter-tasks.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasks_repository: TasksRepository,
  ) {}

  async getAllTasks(user: User): Promise<Task[]> {
    return await this.tasks_repository.getTasks(user);
  }

  async getTaskByID(id: string, user: User): Promise<Task> {
    /* ---------------------------------------
    Service responsible for getting a task by its ID.
    ---------------------------------------*/
    const task = await this.tasks_repository.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async getTasksWithFilters(
    params: TasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    /* ----------------------------------------------------------
    Service responsible for getting a list of filtered tasks.
    -----------------------------------------------------------*/
    const tasks = await this.tasks_repository.getTasksByOptions(params, user);
    return tasks;
  }

  async createTask(payload: CreateTaskDto, user: User): Promise<Task> {
    /* ---------------------------------------
    Service responsible for creating a task.
    ---------------------------------------*/
    return this.tasks_repository.createTask(payload, user);
  }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    /* ---------------------------------------
    Service responsible for updating a task.
    ---------------------------------------*/
    const task = await this.getTaskByID(id, user);
    task.status = status;
    await this.tasks_repository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<string> {
    /* ---------------------------------------
    Service responsible for deleting a task.
    ---------------------------------------*/
    const result = await this.tasks_repository.deleteTask(id, user);

    if (result.affected === 0) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return 'Task successfully deleted!';
  }
}
