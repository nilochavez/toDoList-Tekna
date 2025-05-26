import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../services/loading.service';
import { AuthService, AuthResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ]
})
export class LoginComponent {
  loginForm: ReturnType<FormBuilder['group']>;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
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

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loadingService.show();
    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value as { email: string; password: string };

    this.authService.login(email, password).subscribe({
      next: (res: AuthResponse) => {
        this.authService.setToken(res.token);
        this.showMessage('Login successful!');
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error while trying to log in.';
        this.showMessage(this.errorMessage, true);
      },
      complete: () => {
        this.isLoading = false;
        this.loadingService.hide();
      }
    });
  }
}
