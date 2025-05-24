import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

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
  errorMessage = '';
   isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
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

 showMessage(message: string, isError = false) {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: isError ? ['custom-error-snackbar'] : ['custom-success-snackbar']
  });
}

  login() {
    if (this.loginForm.invalid) return;

    this.loadingService.show();
    this.isLoading = true;

    this.http.post<{ token: string }>('http://localhost:3000/auth/login', this.loginForm.value)
      .subscribe({
        next: (res) => {
          this.authService.setToken(res.token);
          this.showMessage('Login successful!', false);
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.showMessage('Error while trying to log in.', true);

          this.isLoading = false;
          this.loadingService.hide();
        },
        complete: () => {
          this.isLoading = false;
          this.loadingService.hide();
        }
      });

  }
}
