package com.urbpe.user_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "cards")
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_cartao", nullable = false)
    private Integer numeroCartao;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private boolean status;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_cartao", nullable = false)
    private CardType tipoCartao;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Card() {
    }

    public Card(Long id, Integer numeroCartao, String nome, boolean status, CardType tipoCartao) {
        this.id = id;
        this.numeroCartao = numeroCartao;
        this.nome = nome;
        this.status = status;
        this.tipoCartao = tipoCartao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumeroCartao() {
        return numeroCartao;
    }

    public void setNumeroCartao(Integer numeroCartao) {
        this.numeroCartao = numeroCartao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public CardType getTipoCartao() {
        return tipoCartao;
    }

    public void setTipoCartao(CardType tipoCartao) {
        this.tipoCartao = tipoCartao;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
