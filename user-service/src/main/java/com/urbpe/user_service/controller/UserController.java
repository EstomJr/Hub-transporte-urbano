package com.urbpe.user_service.controller;

import com.urbpe.user_service.dto.request.CardRequestDTO;
import com.urbpe.user_service.dto.response.CardResponseDTO;
import com.urbpe.user_service.dto.request.UserRequestDTO;
import com.urbpe.user_service.dto.response.UserResponseDTO;
import com.urbpe.user_service.dto.request.UserUpdateRequestDTO;
import com.urbpe.user_service.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(name = "Usuário", description = "Endpoints para auto-gestão de perfil e cartões")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @Operation(summary = "Auto-cadastro", description = "Permite que novos utilizadores se registem no sistema")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserRequestDTO request) {
        UserResponseDTO response = userService.createUser(request, "USER");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Consultar perfil", description = "Retorna os dados do próprio utilizador logado")
    public ResponseEntity<UserResponseDTO> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Atualizar perfil", description = "Permite ao utilizador alterar os seus próprios dados (Nome, Senha)")
    public ResponseEntity<UserResponseDTO> updateProfile(@PathVariable Long userId, @Valid @RequestBody UserUpdateRequestDTO request) {
        UserResponseDTO response = userService.updateUser(userId, request, "USER");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/cards")
    @Operation(summary = "Listar cartões próprios", description = "Retorna a lista de cartões vinculados ao perfil do utilizador")
    public ResponseEntity<List<CardResponseDTO>> listCards(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserCards(userId));
    }

    @PostMapping("/{userId}/cards")
    @Operation(summary = "Vincular novo cartão", description = "Adiciona um cartão de transporte ao perfil do utilizador")
    public ResponseEntity<CardResponseDTO> addCard(@PathVariable Long userId, @Valid @RequestBody CardRequestDTO request) {
        CardResponseDTO response = userService.addCard(userId, request, "USER");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{userId}/cards/{cardId}")
    @Operation(summary = "Remover cartão próprio", description = "Desvincula um cartão do perfil do utilizador")
    public ResponseEntity<Void> removeCard(@PathVariable Long userId, @PathVariable Long cardId) {
        userService.removeCard(userId, cardId, "USER");
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{userId}/cards/{cardId}/status")
    @Operation(summary = "Alterar status do cartão", description = "Ativa ou inativa (bloqueia) um cartão de sua propriedade")
    public ResponseEntity<CardResponseDTO> updateCardStatus(@PathVariable Long userId,
                                                            @PathVariable Long cardId,
                                                            @RequestParam boolean status) {
        CardResponseDTO response = userService.updateCardStatus(userId, cardId, status, "USER");
        return ResponseEntity.ok(response);
    }
}