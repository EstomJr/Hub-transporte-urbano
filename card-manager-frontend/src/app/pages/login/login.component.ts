import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  feedback = '';
  form!: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService, private readonly router: Router) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.feedback = 'Preencha email e senha corretamente.';
      return;
    }

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.feedback = 'Login realizado com sucesso!';
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.feedback = 'Não foi possível autenticar. Verifique os dados e tente novamente.';
      }
    });
  }
}
