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
    const tasks = await this.createQueryBuilder('tasks').getMany();
    return tasks;
  }

  async getTasksByOptions(params: TasksFilterDto): Promise<Task[]> {
    /*--------------------------------------------------
	Responsible for filtering tasks from the database.
	----------------------------------------------------*/
    const { status, search } = params;
    console.log('Search: ', search);
    const tasks = await this.find({
      where: {
        status: status,
      },
    });
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
