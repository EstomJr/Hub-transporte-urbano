package com.urbpe.auth_service.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(@NotBlank(message = "Email obrigatorio") String email,
                              @NotBlank(message = "Senha obrigatoria") String password) {
}
