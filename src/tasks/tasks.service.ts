import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksFilterDto } from './dto/filter-tasks.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskByID(id: string): Task {
    return this.getAllTasks().filter((task) => task.id === id)[0];
  }

  getTasksWithFilters(params: TasksFilterDto): Task[] {
    const { status, search } = params;

    // get all the tasks
    let tasks = this.getAllTasks();

    // filter tasks with the status param provided
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    // filter tasks with the search param provided
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  createTask(payload: CreateTaskDto): Task {
    const { title, description } = payload;
    const task: Task = {
      id: uuid(),
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, status: TaskStatus): Task {
    const task = this.getTaskByID(id);
    task.status = status;
    return task;
  }

  deleteTask(id: string): string {
    const taskWithIDIndex = this.tasks.findIndex((task) => task.id == id);
    this.tasks.splice(taskWithIDIndex);
    return 'Task successfully deleted!';
  }
}
