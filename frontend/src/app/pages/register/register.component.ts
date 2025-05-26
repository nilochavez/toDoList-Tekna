import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, AuthResponse } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ]
})
export class RegisterComponent {
  registerForm;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  private showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['custom-error-snackbar'] : ['custom-success-snackbar']
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.errorMessage = '';
    const { email, password } = this.registerForm.value as { email: string; password: string };

    this.authService.register(email, password).subscribe({
      next: () => {
        this.showMessage('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error while trying to register.';
        this.showMessage(this.errorMessage, true);
      }
    });
  }
}
