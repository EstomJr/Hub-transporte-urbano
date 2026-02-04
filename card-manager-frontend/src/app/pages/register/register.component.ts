import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  feedback = '';
  form!: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService, private readonly router: Router) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.feedback = 'Preencha todos os campos corretamente.';
      return;
    }

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.feedback = 'Cadastro realizado com sucesso!';
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.feedback = 'Não foi possível registrar. Tente novamente.';
      }
    });
  }
}
