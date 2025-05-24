import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TaskFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  taskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      completed: [false]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.taskId = +id;
        this.loadTask(this.taskId);
      }
    });
  }

  loadTask(id: number) {
    this.http.get<any>(`http://localhost:3000/tasks/${id}`).subscribe({
      next: (task) => {
        const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
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

  saveTask() {
    if (this.form.invalid) return;

    const taskData = this.form.value;

    if (this.isEditMode && this.taskId !== null) {
      this.http.put(`http://localhost:3000/tasks/${this.taskId}`, taskData).subscribe({
        next: () => {
          this.showMessage('Task updated successfully!');
          this.router.navigate(['/tasks']);
        },
        error: () => this.showMessage('Error updating task', true)
      });
    } else {
      this.http.post(`http://localhost:3000/tasks`, taskData).subscribe({
        next: () => {
          this.showMessage('Task created successfully!');
          this.router.navigate(['/tasks']);
        },
        error: () => this.showMessage('Error creating task', true)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }


  private showMessage(message: string, isError = false) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['custom-error-snackbar'] : ['custom-success-snackbar']
    });
  }
}
