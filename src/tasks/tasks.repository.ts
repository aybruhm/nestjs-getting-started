import { DataSource, Repository } from 'typeorm';
import { Task } from './tasks.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { TasksFilterDto } from './dto/filter-tasks.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger();

  constructor(private data_source: DataSource) {
    super(Task, data_source.createEntityManager());
  }

  async getTasks(user: User): Promise<Task[]> {
    /*--------------------------------------------------
	Responsible for retrieving tasks from the database.
	----------------------------------------------------*/
    const query = this.createQueryBuilder('tasks');
    try {
      const tasks = await query.where({ user }).getMany();
      return tasks;
    } catch (err) {
      this.logger.error(
        `Failed to retrieve tasks from database for user ${user.username}. Meta information: ${err.stack}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTasksByOptions(params: TasksFilterDto, user: User): Promise<Task[]> {
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
        '(LOWER(tasks.title) LIKE LOWER(:search) OR LOWER(tasks.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.where({ user }).getMany();
    return tasks;
  }

  async createTask(payload: CreateTaskDto, user: User): Promise<Task> {
    /*--------------------------------------------------
	Responsible for creating a task to the database.
	----------------------------------------------------*/
    const { title, description } = payload;
    const task = this.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN,
      user: user,
    });

    await this.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<DeleteResult> {
    /*--------------------------------------------------
	Responsible for deleting a task from the database.
	----------------------------------------------------*/
    const deleted = await this.delete({ id, user });
    return deleted;
  }
}
