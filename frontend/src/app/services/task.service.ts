// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
    id?: number;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
    private base = `${environment.apiUrl}/tasks`;

    constructor(private http: HttpClient) { }

    getAllTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.base);
    }

    getTask(id: number): Observable<Task> {
        return this.http.get<Task>(`${this.base}/${id}`);
    }

    create(task: Task): Observable<Task> {
        return this.http.post<Task>(this.base, task);
    }

    update(id: number, task: Task): Observable<Task> {
        return this.http.put<Task>(`${this.base}/${id}`, task);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.base}/${id}`);
    }
}
