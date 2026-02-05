import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CardService } from '../../services/card.service';
import { Card, CardType } from '../../models/card.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {
  cartoes$: Observable<Card[]>;
  cartoes: Card[] = [];
  cartaoSelecionado: Card | null = null;
  isModalOpen = false;
  private cardsSubscription?: Subscription;

  constructor(private cardService: CardService) {
    this.cartoes$ = this.cardService.cards$;
  }

  ngOnInit(): void {
    this.cardService.listarCartoes();
    this.cardsSubscription = this.cartoes$.subscribe(cards => {
      this.cartoes = cards;
      if (this.cartoes.length > 0) {
        this.cartaoSelecionado = this.cartoes[0];
      } else {
        this.cartaoSelecionado = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.cardsSubscription?.unsubscribe();
  }

  getImagem(tipo: CardType): string {
    const map = {
      [CardType.COMUM]: 'url(assets/images/cartoes/vem_comum_frente.jpg)',
      [CardType.ESTUDANTE]: 'url(assets/images/cartoes/vem_estudante_frente.jpg)',
      [CardType.TRABALHADOR]: 'url(assets/images/cartoes/vem_trabalhador_frente.jpg)'
    };
    return map[tipo] || map[CardType.COMUM];
  }

  selecionarCartao(cartao: Card) {
    this.cartaoSelecionado = cartao;
  }

  bloquearOuDesbloquearCartao() {
    if (this.cartaoSelecionado && this.cartaoSelecionado.id) {
      const novoStatus = !this.cartaoSelecionado.status;
      this.cardService.atualizarStatus(this.cartaoSelecionado.id, novoStatus).subscribe(() => {
        this.cardService.listarCartoes();
      });
    }
  }

  excluirCartao() {
    if (this.cartaoSelecionado?.id) {
      this.cardService.removerCartao(this.cartaoSelecionado.id).subscribe(() => {
        this.cardService.listarCartoes();
      });
    }
  }
}
