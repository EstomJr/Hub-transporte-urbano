package com.urbpe.auth_service.usecase;

import com.urbpe.auth_service.domain.Role;
import com.urbpe.auth_service.dto.RegisterUserRequestDTO;
import com.urbpe.auth_service.entity.User;
import com.urbpe.auth_service.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterUseCase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void execute(RegisterUserRequestDTO request) {
        if (userRepository.findUserByEmail(request.email()) != null) {
            throw new RuntimeException("Email já cadastrado na base de dados.");
        }
        String encryptedPassword = passwordEncoder.encode(request.password());
        Role role = Role.USER;
        try {
            if (request.role() != null && !request.role().isBlank()) {
                role = Role.valueOf(request.role().toUpperCase());
            }
        } catch (IllegalArgumentException e) {
            role = Role.USER;
        }

        User user = new User(
                request.name(),
                request.email(),
                encryptedPassword,
                role
        );

        userRepository.save(user);
    }
}
