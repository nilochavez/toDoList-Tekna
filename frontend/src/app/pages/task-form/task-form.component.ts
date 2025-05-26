import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { TaskService, Task } from '../../services/task.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    ConfirmDialogComponent
  ]
})
export class TaskFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  taskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      completed: [false]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.taskId = +id;
        this.loadTask(this.taskId);
      }
    });
  }

  loadTask(id: number): void {
    this.taskService.getTask(id).subscribe({
      next: task => {
        const formattedDate = task.dueDate
          ? new Date(task.dueDate).toISOString().split('T')[0]
          : '';
        this.form.patchValue({
          title: task.title,
          description: task.description,
          dueDate: formattedDate,
          completed: task.completed
        });
      },
      error: () => {
        this.showMessage('Error loading task data', true);
        this.router.navigate(['/tasks']);
      }
    });
  }

  saveTask(): void {
    if (this.form.invalid) {
      this.showMessage('Please fill out all required fields', true);
      return;
    }

    const task: Task = this.form.value;
    const action$: Observable<Task> =
      this.isEditMode && this.taskId !== null
        ? this.taskService.update(this.taskId, task)
        : this.taskService.create(task);

    this.confirmSave().subscribe(confirmed => {
      if (!confirmed) {
        return;
      }
      action$.subscribe({
        next: () => {
          const message = this.isEditMode
            ? 'Task updated successfully!'
            : 'Task created successfully!';
          this.showMessage(message);
          this.router.navigate(['/tasks']);
        },
        error: () => {
          const errorMessage = this.isEditMode
            ? 'Error updating task'
            : 'Error creating task';
          this.showMessage(errorMessage, true);
        }
      });
    });
  }

  private confirmSave(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: this.isEditMode
          ? 'Are you sure you want to update this task??'
          : 'Are you sure you want to create this task?'
      }
    });
    return dialogRef.afterClosed();
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
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
}
