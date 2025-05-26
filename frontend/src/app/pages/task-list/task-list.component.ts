import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { LoadingService } from '../../services/loading.service';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    ConfirmDialogComponent
  ]
})
export class TaskListComponent implements OnInit {
  displayedColumns = ['completed', 'title', 'description', 'dueDate', 'actions'];
  tasks: Task[] = [];
  isLoading = false;

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  goToNewTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  private showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['custom-error-snackbar'] : ['custom-success-snackbar']
    });
  }

  loadTasks(): void {
    this.isLoading = true;
    this.loadingService.show();

    this.taskService.getAllTasks().subscribe({
      next: tasks => this.tasks = tasks,
      error: err => this.showMessage(err.error?.message || 'Error loading tasks', true),
      complete: () => {
        this.isLoading = false;
        this.loadingService.hide();
      }
    });
  }

  toggleComplete(task: Task, event: any): void {
    const updatedTask: Task = { ...task, completed: event.checked };
    this.taskService.update(task.id!, updatedTask).subscribe({
      next: () => {
        this.showMessage('Task updated successfully!');
        this.loadTasks();
      },
      error: () => this.showMessage('Error updating task', true)
    });
  }

  delete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to delete this task?' }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.taskService.delete(id).subscribe({
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
