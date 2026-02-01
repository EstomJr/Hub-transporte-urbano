package com.urbpe.auth_service.controller;

import com.urbpe.auth_service.dto.request.LoginRequestDTO;
import com.urbpe.auth_service.dto.request.RegisterUserRequestDTO;
import com.urbpe.auth_service.dto.response.LoginResponseDTO;
import com.urbpe.auth_service.dto.response.RegisterUserResponseDTO;
import com.urbpe.auth_service.entity.User;
import com.urbpe.auth_service.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {

        UsernamePasswordAuthenticationToken userAndPass = new UsernamePasswordAuthenticationToken(loginRequestDTO.email(), loginRequestDTO.password());
        Authentication authentication = authenticationManager.authenticate(userAndPass);
        return null;
    }

    public ResponseEntity<RegisterUserResponseDTO> resgister(@Valid @RequestBody RegisterUserRequestDTO request){
        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(new RegisterUserResponseDTO(user.getName(), user.getEmail()));
    }



}