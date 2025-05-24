import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class TaskListComponent implements OnInit {
  displayedColumns = ['completed', 'title', 'description', 'dueDate', 'actions'];
  tasks: Array<{ id: number; title: string; dueDate: string; completed: boolean }> = [];
  isLoading = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadTasks();
  }

  goToNewTask() {
    this.router.navigate(['/tasks/new']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  showMessage(message: string, isError = false) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['custom-error-snackbar'] : ['custom-success-snackbar']
    });
  }

  loadTasks() {
    this.isLoading = true;
    this.loadingService.show();

    this.http.get<any[]>('http://localhost:3000/tasks')
      .subscribe({
        next: data => this.tasks = data,
        error: err => this.showMessage(err.error?.message || 'Error loading tasks', true),
        complete: () => {
          this.isLoading = false;
          this.loadingService.hide();
        }
      });
    console.log(this.tasks);
  }

  toggleComplete(task: any, event: any) {
    this.http.put(`http://localhost:3000/tasks/${task.id}`, {
      ...task,
      completed: event.checked
    }).subscribe({
      next: () => this.showMessage('Task updated!'),
      error: () => this.showMessage('Error updating task', true),
      complete: () => this.loadTasks()
    });
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to delete this task?' }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.http.delete<{ message: string }>(`http://localhost:3000/tasks/${id}`)
          .subscribe({
            next: () => {
              this.showMessage('Task deleted successfully.');
              this.loadTasks();
            },
            error: () => this.showMessage('Error deleting task.', true)
          });
      }
    });
  }
}
