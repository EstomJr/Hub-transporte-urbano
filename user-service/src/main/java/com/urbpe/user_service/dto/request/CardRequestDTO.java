package com.urbpe.user_service.dto.request;

import com.urbpe.user_service.entity.CardType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CardRequestDTO {
    @NotNull
    private Integer numeroCartao;

    @NotBlank
    private String nome;

    @NotNull
    private Boolean status;

    @NotNull
    private CardType tipoCartao;

    public CardRequestDTO() {
    }

    public CardRequestDTO(Integer numeroCartao, String nome, Boolean status, CardType tipoCartao) {
        this.numeroCartao = numeroCartao;
        this.nome = nome;
        this.status = status;
        this.tipoCartao = tipoCartao;
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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public CardType getTipoCartao() {
        return tipoCartao;
    }

    public void setTipoCartao(CardType tipoCartao) {
        this.tipoCartao = tipoCartao;
    }
}
