package com.urbpe.user_service.dto.response;

import java.util.List;

public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private List<CardResponseDTO> cards;

    public UserResponseDTO() {
    }

    public UserResponseDTO(Long id, String name, String email, List<CardResponseDTO> cards) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.cards = cards;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<CardResponseDTO> getCards() {
        return cards;
    }

    public void setCards(List<CardResponseDTO> cards) {
        this.cards = cards;
    }
}
