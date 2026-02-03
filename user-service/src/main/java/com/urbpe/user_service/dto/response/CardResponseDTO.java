package com.urbpe.user_service.dto.response;

import com.urbpe.user_service.entity.CardType;

public class CardResponseDTO {
    private Long id;
    private String numeroCartao;
    private String nome;
    private boolean status;
    private CardType tipoCartao;
    private Long userId;

    public CardResponseDTO() {
    }

    public CardResponseDTO(Long id, String numeroCartao, String nome, boolean status, CardType tipoCartao, Long userId) {
        this.id = id;
        this.numeroCartao = numeroCartao;
        this.nome = nome;
        this.status = status;
        this.tipoCartao = tipoCartao;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroCartao() {
        return numeroCartao;
    }

    public void setNumeroCartao(String numeroCartao) {
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
