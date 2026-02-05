import { Card } from "./card.model";

export interface User {
    id: number;
    name: string;
    email: string;
    cards: Card[];
}