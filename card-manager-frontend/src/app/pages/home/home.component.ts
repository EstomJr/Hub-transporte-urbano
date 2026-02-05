import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CardService } from '../../services/card.service';
import { UserApiService } from '../../services/user-api.service';
import { AdminService } from '../../services/admin.service';
import { Card, CardType } from '../../models/card.model';
import { User } from '../../models/user.model';
import { AdminDashboard } from '../../models/admin-dashboard.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {
  role: string | null = null;
  userId: number | null = null;
  cartoes$: Observable<Card[]>;
  cartoes: Card[] = [];
  cartaoSelecionado: Card | null = null;
  private cardsSubscription?: Subscription;

  adminDashboard?: AdminDashboard;
  users: User[] = [];
  allCards: Card[] = [];
  adminSelectedCard: Card | null = null;

  adminSection = 'dashboard';
  userSection = 'dashboard';

  addUserForm: FormGroup;
  updateUserForm: FormGroup;
  deleteUserForm: FormGroup;
  addAdminCardForm: FormGroup;
  deleteAdminCardForm: FormGroup;
  toggleAdminCardForm: FormGroup;

  updateProfileForm: FormGroup;
  addUserCardForm: FormGroup;

  userProfile?: User;
  actionMessage = '';
  actionMessageType: 'success' | 'error' = 'success';
  private actionMessageTimeout?: ReturnType<typeof setTimeout>;

  cardTypes = Object.values(CardType);

  constructor(
    private authService: AuthService,
    private cardService: CardService,
    private userApiService: UserApiService,
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.cartoes$ = this.cardService.cards$;
    this.addUserForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER', [Validators.required]]
    });

    this.updateUserForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER']
    });

    this.deleteUserForm = this.fb.group({
      id: ['', [Validators.required]]
    });

    this.addAdminCardForm = this.fb.group({
      userId: ['', [Validators.required]],
      numeroCartao: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      tipoCartao: [CardType.COMUM, [Validators.required]],
      status: [true, [Validators.required]]
    });

    this.deleteAdminCardForm = this.fb.group({
      userId: ['', [Validators.required]],
      cardId: ['', [Validators.required]]
    });

    this.toggleAdminCardForm = this.fb.group({
      userId: ['', [Validators.required]],
      cardId: ['', [Validators.required]],
      status: [true, [Validators.required]]
    });

    this.updateProfileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.addUserCardForm = this.fb.group({
      numeroCartao: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      tipoCartao: [CardType.COMUM, [Validators.required]],
      status: [true, [Validators.required]]
    });
  }
  

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
    this.userId = this.authService.getUserId();
    this.cardsSubscription = this.cartoes$.subscribe(cards => {
      this.cartoes = cards;
      if (this.cartoes.length > 0) {
        this.cartaoSelecionado = this.cartoes[0];
      } else {
        this.cartaoSelecionado = null;
      }
    });

    if (this.role === 'ADMIN') {
      this.setAdminSection('dashboard');
    } else {
      this.setUserSection('dashboard');
    }
  }

  ngOnDestroy(): void {
    this.cardsSubscription?.unsubscribe();
    this.clearActionMessageTimeout();
  }

  setAdminSection(section: string) {
    this.clearActionMessage();
    this.adminSection = section;
    if (section === 'dashboard') {
      this.loadAdminDashboard();
      this.loadUsers();
      this.loadAllCards();
    }
    if (section === 'users-list') {
      this.loadUsers();
    }
    if (section === 'cards-list') {
      this.loadUsers();
      this.loadAllCards();
    }
  }

   logout() {
    this.authService.logout();
  }

  setUserSection(section: string) {
    this.clearActionMessage();
    this.userSection = section;
    if (section === 'dashboard') {
      this.loadUserProfile();
      this.cardService.listarCartoes();
    }
    if (section === 'cards') {
      this.cardService.listarCartoes();
    }
  }

  loadAdminDashboard() {
    this.adminService.getDashboard().subscribe({
      next: (data) => (this.adminDashboard = data),
      error: () => (this.adminDashboard = undefined)
    });
  }

  loadUsers() {
    this.adminService.listUsers().subscribe({
      next: (data) => (this.users = data),
      error: () => (this.users = [])
    });
  }

  loadAllCards() {
    this.adminService.listCards().subscribe({
      next: (data) => {
        this.allCards = data;
        this.syncAdminSelectedCard();
      },
      error: () => {
        this.allCards = [];
        this.adminSelectedCard = null;
      }
    });
  }

  private syncAdminSelectedCard(): void {
    if (!this.allCards.length) {
      this.adminSelectedCard = null;
      return;
    }

    if (!this.adminSelectedCard?.id) {
      this.adminSelectedCard = this.allCards[0];
      return;
    }

    this.adminSelectedCard = this.allCards.find((card) => card.id === this.adminSelectedCard?.id) ?? this.allCards[0];
  }

  selecionarCartaoAdmin(card: Card): void {
    this.adminSelectedCard = card;
  }

  getUsuarioDoCartao(card: Card): User | undefined {
    if (!card.userId) return undefined;
    return this.users.find((user) => user.id === card.userId);
  }

  atualizarStatusCartaoAdmin(card: Card): void {
    if (!card.id || !card.userId) {
      this.showActionMessage('Não foi possível atualizar o status deste cartão.', 'error');
      return;
    }

    const novoStatus = !card.status;
    this.adminService.updateCardStatus(card.userId, card.id, novoStatus).subscribe({
      next: () => {
        this.showActionMessage(`Cartão ${novoStatus ? 'ativado' : 'inativado'} com sucesso.`);
        this.loadAllCards();
        this.loadAdminDashboard();
      }
    });
  }

  removerCartaoAdmin(card: Card): void {
    if (!card.id || !card.userId) {
      this.showActionMessage('Não foi possível remover este cartão.', 'error');
      return;
    }

    const usuario = this.getUsuarioDoCartao(card);
    this.adminService.removeCard(card.userId, card.id).subscribe({
      next: () => {
        const email = usuario?.email || 'email não encontrado';
        this.showActionMessage(`Cartão removido do usuário ${email}.`, 'error');
        this.loadAllCards();
        this.loadAdminDashboard();
      }
    });
  }

  loadUserProfile() {
    if (!this.userId) return;
    this.userApiService.getProfile(this.userId).subscribe({
      next: (user) => {
        this.userProfile = user;
        this.updateProfileForm.patchValue({
          name: user.name,
          email: user.email
        });
      }
    });
  }

   private showActionMessage(message: string, type: 'success' | 'error' = 'success', timeoutMs = 5000): void {
    this.actionMessage = message;
    this.actionMessageType = type;
    this.clearActionMessageTimeout();
    this.actionMessageTimeout = setTimeout(() => {
      this.actionMessage = '';
    }, timeoutMs);
  }

  private clearActionMessageTimeout(): void {
    if (this.actionMessageTimeout) {
      clearTimeout(this.actionMessageTimeout);
      this.actionMessageTimeout = undefined;
    }
  }

  private clearActionMessage(): void {
    this.clearActionMessageTimeout();
    this.actionMessage = '';
  }

  getImagem(tipo: CardType): string {
    const map = {
      [CardType.COMUM]: 'url(images/cartoes/vem_comum_frente.jpg)',
      [CardType.ESTUDANTE]: 'url(images/cartoes/vem_estudante_frente.jpg)',
      [CardType.TRABALHADOR]: 'url(images/cartoes/vem_trabalhador_frente.jpg)'
    };
    return map[tipo] || map[CardType.COMUM];
  }

  selecionarCartao(cartao: Card) {
    this.cartaoSelecionado = cartao;
  }

  bloquearOuDesbloquearCartao() {
     if (this.cartaoSelecionado?.id) {
      const novoStatus = !this.cartaoSelecionado.status;
      this.cardService.atualizarStatus(this.cartaoSelecionado.id, novoStatus).subscribe(() => {
        this.showActionMessage(`Cartão ${novoStatus ? 'ativado' : 'inativado'} com sucesso.`);
        this.cardService.listarCartoes();
      });
    }
  }

  excluirCartao() {
    if (this.cartaoSelecionado?.id) {
      this.cardService.removerCartao(this.cartaoSelecionado.id).subscribe(() => {
        const email = this.userProfile?.email || 'seu usuário';
        this.showActionMessage(`Cartão removido do usuário ${email}.`, 'error');
        this.cardService.listarCartoes();
      });
    }
  }
  
  isAddUserFormReady(): boolean {
    const name = String(this.addUserForm.get('name')?.value ?? '').trim();
    const email = String(this.addUserForm.get('email')?.value ?? '').trim();
    const password = String(this.addUserForm.get('password')?.value ?? '');
    const role = String(this.addUserForm.get('role')?.value ?? '').trim();

    const hasValidName = name.length > 0;
    const hasValidEmail = this.addUserForm.get('email')?.valid === true;
    const hasValidPassword = password.trim().length >= 6;
    const hasValidRole = role.length > 0;

    return hasValidName && hasValidEmail && hasValidPassword && hasValidRole;
  }

  submitAddUser() {
    if (!this.isAddUserFormReady()) return;
    this.adminService.createUser(this.addUserForm.value).subscribe({
      next: () => {
        this.showActionMessage('Usuário cadastrado com sucesso.');
        this.addUserForm.reset({ role: 'USER' });
        this.loadUsers();
        this.loadAdminDashboard();
      }
    });
  }

  submitUpdateUser() {
    if (this.updateUserForm.invalid) return;
    const { id, ...payload } = this.updateUserForm.value;
    this.adminService.updateUser(Number(id), payload).subscribe({
      next: () => {
        this.showActionMessage('Usuário atualizado com sucesso.');
        this.updateUserForm.reset({ role: 'USER' });
        this.loadUsers();
      }
    });
  }

  submitDeleteUser() {
    if (this.deleteUserForm.invalid) return;
    const { id } = this.deleteUserForm.value;
    this.adminService.deleteUser(Number(id)).subscribe({
      next: () => {
        this.showActionMessage('Usuário removido com sucesso.', 'error');
        this.deleteUserForm.reset();
        this.loadUsers();
        this.loadAdminDashboard();
      }
    });
  }

  submitAddAdminCard() {
    if (this.addAdminCardForm.invalid) return;
    const { userId, ...payload } = this.addAdminCardForm.value;
    this.adminService.addCardToUser(Number(userId), payload).subscribe({
      next: () => {
        this.showActionMessage('Cartão adicionado ao usuário.');
        this.addAdminCardForm.reset({ status: true, tipoCartao: CardType.COMUM });
        this.loadAllCards();
        this.loadAdminDashboard();
      }
    });
  }

  submitDeleteAdminCard() {
    if (this.deleteAdminCardForm.invalid) return;
    const { userId, cardId } = this.deleteAdminCardForm.value;
    const parsedUserId = Number(userId);
    const parsedCardId = Number(cardId);
    const user = this.users.find((item) => item.id === parsedUserId);
    this.adminService.removeCard(parsedUserId, parsedCardId).subscribe({
      next: () => {
        const email = user?.email || 'email não encontrado';
        this.showActionMessage(`Cartão removido do usuário ${email}.`, 'error');
        this.deleteAdminCardForm.reset();
        this.loadAllCards();
        this.loadAdminDashboard();
      }
    });
  }

  submitToggleAdminCard() {
    if (this.toggleAdminCardForm.invalid) return;
    const { userId, cardId, status } = this.toggleAdminCardForm.value;
    this.adminService.updateCardStatus(Number(userId), Number(cardId), status).subscribe({
      next: () => {
        this.showActionMessage('Status do cartão atualizado.');
        this.toggleAdminCardForm.reset({ status: true });
        this.loadAllCards();
        this.loadAdminDashboard();
      }
    });
  }

  submitUpdateProfile() {
    if (this.updateProfileForm.invalid || !this.userId) return;
    this.userApiService.updateProfile(this.userId, this.updateProfileForm.value).subscribe({
      next: (user) => {
        this.showActionMessage('Perfil atualizado com sucesso.');
        this.userProfile = user;
        this.loadUserProfile();
      }
    });
  }

  submitAddUserCard() {
    if (this.addUserCardForm.invalid) return;
    this.cardService.adicionarCartao(this.addUserCardForm.value).subscribe({
      next: () => {
        this.showActionMessage('Cartão cadastrado no seu perfil.');
        this.addUserCardForm.reset({ status: true, tipoCartao: CardType.COMUM });
        this.cardService.listarCartoes();
      }
    });
  }
}