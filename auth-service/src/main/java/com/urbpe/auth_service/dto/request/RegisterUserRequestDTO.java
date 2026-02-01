package com.urbpe.auth_service.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RegisterUserRequestDTO(@NotBlank (message = "Nome é obrigatorio")String name,
                                     @NotBlank (message = "Email é obrigatorio")String email,
                                     @NotBlank (message = "Senha é obrigatorio")String password) {
}
