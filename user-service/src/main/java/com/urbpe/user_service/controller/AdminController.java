package com.urbpe.user_service.controller;

import com.urbpe.user_service.dto.request.CardRequestDTO;
import com.urbpe.user_service.dto.response.AdminDashboardResponseDTO;
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
@RequestMapping("/admin")
@Tag(name = "Administração", description = "Endpoints restritos para gestão global do sistema")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    @Operation(summary = "Listar todos os utilizadores", description = "Retorna a lista completa de perfis sincronizados")
    public ResponseEntity<List<UserResponseDTO>> listUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Resumo do dashboard", description = "Retorna contadores globais de utilizadores e cartões")
    public ResponseEntity<AdminDashboardResponseDTO> getDashboard() {
        return ResponseEntity.ok(userService.getAdminDashboard());
    }

    @PostMapping("/users")
    @Operation(summary = "Criar novo utilizador (Admin)", description = "Cria um perfil manualmente via painel administrativo")
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO request) {
        UserResponseDTO response = userService.createUser(request, "ADMIN");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/users/{userId}")
    @Operation(summary = "Atualizar utilizador", description = "Altera dados cadastrais de um utilizador específico")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long userId, @Valid @RequestBody UserUpdateRequestDTO request) {
        UserResponseDTO response = userService.updateUser(userId, request, "ADMIN");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Remover utilizador", description = "Exclui permanentemente um utilizador e seus cartões vinculados")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId, "ADMIN");
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/users/{userId}/cards")
    @Operation(summary = "Vincular cartão", description = "Adiciona um novo cartão de transporte a um utilizador")
    public ResponseEntity<CardResponseDTO> addCard(@PathVariable Long userId, @Valid @RequestBody CardRequestDTO request) {
        CardResponseDTO response = userService.addCard(userId, request, "ADMIN");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/users/{userId}/cards/{cardId}")
    @Operation(summary = "Remover cartão", description = "Desvincula e remove um cartão de um utilizador")
    public ResponseEntity<Void> removeCard(@PathVariable Long userId, @PathVariable Long cardId) {
        userService.removeCard(userId, cardId, "ADMIN");
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/users/{userId}/cards/{cardId}/status")
    @Operation(summary = "Alterar status do cartão", description = "Ativa ou inativa um cartão (Bloqueio/Desbloqueio)")
    public ResponseEntity<CardResponseDTO> updateCardStatus(@PathVariable Long userId,
                                                            @PathVariable Long cardId,
                                                            @RequestParam boolean status) {
        CardResponseDTO response = userService.updateCardStatus(userId, cardId, status, "ADMIN");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cards")
    @Operation(summary = "Listar todos os cartões", description = "Consulta global de todos os cartões emitidos no sistema (NativeQuery)")
    public ResponseEntity<List<CardResponseDTO>> listCards() {
        return ResponseEntity.ok(userService.getAllCards());
    }
}