package com.urbpe.auth_service.controller;

import com.urbpe.auth_service.dto.LoginRequestDTO;
import com.urbpe.auth_service.dto.RegisterUserRequestDTO;
import com.urbpe.auth_service.dto.JwtResponseDTO;
import com.urbpe.auth_service.usecase.LoginUseCase;
import com.urbpe.auth_service.usecase.RegisterUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RegisterUseCase registerUseCase;

    public AuthController(LoginUseCase loginUseCase, RegisterUseCase registerUseCase) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        JwtResponseDTO jwtResponse = loginUseCase.execute(loginRequestDTO);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterUserRequestDTO request) {
        registerUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }






}