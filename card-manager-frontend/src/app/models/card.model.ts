export enum CardType {
    COMUM = 'COMUM',
    ESTUDANTE = 'ESTUDANTE',
    TRABALHADOR = 'TRABALHADOR'
}

export interface Card {
    id?: number;
    numeroCartao: number;
    nome: string;
    status: boolean;
    tipoCartao: CardType;
    userId?: number;
}