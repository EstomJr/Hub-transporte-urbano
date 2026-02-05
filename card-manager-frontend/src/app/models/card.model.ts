export enum CardType {
    COMUM = 'COMUM',
    ESTUDANTE = 'ESTUDANTE',
    TRABALHADOR = 'TRABALHADOR'
}

export interface Card {
    id?: number;
    numeroCartao: string; // Java: numeroCartao
    nome: string;
    status: boolean;
    tipoCartao: CardType; // Java: Enum
    userId?: number;
}