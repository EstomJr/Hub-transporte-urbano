package com.urbpe.auth_service.usecase;

import com.urbpe.auth_service.dto.LoginRequestDTO;
import com.urbpe.auth_service.dto.JwtResponseDTO;
import com.urbpe.auth_service.entity.User;
import com.urbpe.auth_service.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class LoginUseCase {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService; //

    public LoginUseCase(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public JwtResponseDTO execute(@Valid LoginRequestDTO loginRequestDTO) {

        try {
            var auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDTO.email(),
                            loginRequestDTO.password()
                    )
            );
            var user = (User) auth.getPrincipal();
            String token = jwtService.generateToken(user);
            return new JwtResponseDTO(token);

        } catch (AuthenticationException ex) {
            throw new RuntimeException("Credenciais inválidas", ex);
        }
    }
}
