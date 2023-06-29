import { DataSource, Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { TasksFilterDto } from './dto/filter-tasks.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private data_source: DataSource) {
    super(Task, data_source.createEntityManager());
  }

  async getTasks(): Promise<Task[]> {
    /*--------------------------------------------------
	Responsible for retrieving tasks from the database.
	----------------------------------------------------*/
    const query = this.createQueryBuilder('tasks');

    const tasks = await query.getMany();
    return tasks;
  }

  async getTasksByOptions(params: TasksFilterDto): Promise<Task[]> {
    /*--------------------------------------------------
	Responsible for filtering tasks from the database.
	----------------------------------------------------*/
    const { status, search } = params;
    const query = this.createQueryBuilder('tasks');

    if (status) {
      query.andWhere('tasks.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(tasks.title) LIKE LOWER(:search) OR LOWER(tasks.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(payload: CreateTaskDto): Promise<Task> {
    /*--------------------------------------------------
	Responsible for creating a task to the database.
	----------------------------------------------------*/
    const { title, description } = payload;
    const task = this.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    /*--------------------------------------------------
	Responsible for deleting a task from the database.
	----------------------------------------------------*/
    const deleted = await this.delete(id);
    return deleted;
  }
}
