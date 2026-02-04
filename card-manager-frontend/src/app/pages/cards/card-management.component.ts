import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardService } from '../../services/card.service';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-management.component.html',
  styleUrl: './card-management.component.css'
})
export class CardManagementComponent implements OnInit {
  cards: Card[] = [];
  feedback = '';
  editingCardId: number | null = null;
  form!: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly cardService: CardService) {
    this.form = this.fb.nonNullable.group({
      cardNumber: ['', [Validators.required, Validators.minLength(12)]],
      holderName: ['', [Validators.required]],
      expirationMonth: ['', [Validators.required]],
      expirationYear: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      userId: ['']
    });
  }

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.cardService.list().subscribe({
      next: (cards) => {
        this.cards = cards;
      },
      error: () => {
        this.feedback = 'Não foi possível carregar os cartões.';
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.feedback = 'Preencha todos os campos obrigatórios.';
      return;
    }

    const raw = this.form.getRawValue();
    const payload: Card = {
      ...raw,
      userId: raw.userId ? Number(raw.userId) : undefined
    };

    if (this.editingCardId) {
      this.cardService.update(this.editingCardId, payload).subscribe({
        next: () => {
          this.feedback = 'Cartão atualizado com sucesso.';
          this.resetForm();
          this.loadCards();
        },
        error: () => {
          this.feedback = 'Erro ao atualizar cartão.';
        }
      });
      return;
    }

    this.cardService.create(payload).subscribe({
      next: () => {
        this.feedback = 'Cartão criado com sucesso.';
        this.resetForm();
        this.loadCards();
      },
      error: () => {
        this.feedback = 'Erro ao criar cartão.';
      }
    });
  }

  edit(card: Card): void {
    this.editingCardId = card.id ?? null;
    this.form.patchValue({
      cardNumber: card.cardNumber,
      holderName: card.holderName,
      expirationMonth: card.expirationMonth,
      expirationYear: card.expirationYear,
      brand: card.brand,
      userId: card.userId ? String(card.userId) : ''
    });
  }

  remove(card: Card): void {
    if (!card.id) {
      return;
    }

    this.cardService.remove(card.id).subscribe({
      next: () => {
        this.feedback = 'Cartão removido.';
        this.loadCards();
      },
      error: () => {
        this.feedback = 'Erro ao remover cartão.';
      }
    });
  }

  resetForm(): void {
    this.editingCardId = null;
    this.form.reset({
      cardNumber: '',
      holderName: '',
      expirationMonth: '',
      expirationYear: '',
      brand: '',
      userId: ''
    });
  }
}
