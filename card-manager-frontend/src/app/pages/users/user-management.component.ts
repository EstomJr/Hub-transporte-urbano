import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  feedback = '';
  editingUserId: number | null = null;
  form!: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly userService: UserService) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER'],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.list().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: () => {
        this.feedback = 'Não foi possível carregar os usuários.';
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.feedback = 'Preencha os campos obrigatórios.';
      return;
    }

    const payload: User = this.form.getRawValue();

    if (this.editingUserId) {
      this.userService.update(this.editingUserId, payload).subscribe({
        next: () => {
          this.feedback = 'Usuário atualizado com sucesso.';
          this.resetForm();
          this.loadUsers();
        },
        error: () => {
          this.feedback = 'Erro ao atualizar usuário.';
        }
      });
      return;
    }

    this.userService.create(payload).subscribe({
      next: () => {
        this.feedback = 'Usuário criado com sucesso.';
        this.resetForm();
        this.loadUsers();
      },
      error: () => {
        this.feedback = 'Erro ao criar usuário.';
      }
    });
  }

  edit(user: User): void {
    this.editingUserId = user.id ?? null;
    this.form.patchValue({
      name: user.name,
      email: user.email,
      role: user.role ?? 'USER',
      password: ''
    });
  }

  remove(user: User): void {
    if (!user.id) {
      return;
    }

    this.userService.remove(user.id).subscribe({
      next: () => {
        this.feedback = 'Usuário removido.';
        this.loadUsers();
      },
      error: () => {
        this.feedback = 'Erro ao remover usuário.';
      }
    });
  }

  resetForm(): void {
    this.editingUserId = null;
    this.form.reset({
      name: '',
      email: '',
      role: 'USER',
      password: ''
    });
  }
}
