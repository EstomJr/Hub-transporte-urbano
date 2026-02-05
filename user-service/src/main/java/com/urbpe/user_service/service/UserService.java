package com.urbpe.user_service.service;

import com.urbpe.user_service.dto.request.CardRequestDTO;
import com.urbpe.user_service.dto.response.AdminDashboardResponseDTO;
import com.urbpe.user_service.dto.response.CardResponseDTO;
import com.urbpe.user_service.dto.request.UserRequestDTO;
import com.urbpe.user_service.dto.response.UserResponseDTO;
import com.urbpe.user_service.dto.request.UserUpdateRequestDTO;
import com.urbpe.user_service.entity.Card;
import com.urbpe.user_service.entity.User;
import com.urbpe.user_service.entity.UserRole;
import com.urbpe.user_service.exception.BusinessException;
import com.urbpe.user_service.exception.ResourceNotFoundException;
import com.urbpe.user_service.mapper.CardMapper;
import com.urbpe.user_service.mapper.UserMapper;
import com.urbpe.user_service.repository.CardRepository;
import com.urbpe.user_service.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final CardRepository cardRepository;
    private final UserMapper userMapper;
    private final CardMapper cardMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       CardRepository cardRepository,
                       UserMapper userMapper,
                       CardMapper cardMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.cardRepository = cardRepository;
        this.userMapper = userMapper;
        this.cardMapper = cardMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponseDTO getUser(Long userId) {
        return userMapper.toResponse(findUser(userId));
    }

    @Transactional
    public UserResponseDTO createUser(UserRequestDTO request, String actor) {
        validateEmailAvailability(request.getEmail(), null);
        User user = userMapper.toEntity(request);
        if ("USER".equals(actor)) {
            user.setRole(UserRole.USER);
        } else if (user.getRole() == null) {
            user.setRole(UserRole.USER);
        }
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @Transactional
    public UserResponseDTO updateUser(Long userId, UserUpdateRequestDTO request, String actor) {
        User user = findUser(userId);
        validateEmailAvailability(request.getEmail(), userId);
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        if (!"USER".equals(actor) && request.getRole() != null) {
            user.setRole(request.getRole());
        }
        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @Transactional
    public void deleteUser(Long userId, String actor) {
        User user = findUser(userId);
        userRepository.delete(user);
    }

    @Transactional
    public CardResponseDTO addCard(Long userId, CardRequestDTO request, String actor) {
        User user = findUser(userId);
        Card card = cardMapper.toEntity(request);
        user.addCard(card);
        userRepository.save(user);
        return cardMapper.toResponse(card);
    }

    @Transactional
    public void removeCard(Long userId, Long cardId, String actor) {
        findUser(userId);
        Card card = cardRepository.findByIdAndUserId(cardId, userId)
                .orElseGet(() -> cardRepository.findByIdAndUserId(userId, cardId)
                        .orElseThrow(() -> new ResourceNotFoundException("Card not found for user: " + cardId)));
        cardRepository.delete(card);
    }

    @Transactional
    public CardResponseDTO updateCardStatus(Long userId, Long cardId, boolean status, String actor) {
        User user = findUser(userId);
        Card card = findCardForUser(user, cardId);
        card.setStatus(status);
        cardRepository.save(card);
        return cardMapper.toResponse(card);
    }

    public List<CardResponseDTO> getAllCards() {
        return cardRepository.findAll().stream()
                .map(cardMapper::toResponse)
                .collect(Collectors.toList());
    }

    public AdminDashboardResponseDTO getAdminDashboard() {
        long totalUsers = userRepository.count();
        long totalCards = cardRepository.count();
        long activeCards = cardRepository.countByStatus(true);
        long inactiveCards = cardRepository.countByStatus(false);
        return new AdminDashboardResponseDTO(totalUsers, totalCards, activeCards, inactiveCards);
    }

    public List<CardResponseDTO> getUserCards(Long userId) {
        findUser(userId);
        return cardRepository.findAllByUserId(userId).stream()
                .map(cardMapper::toResponse)
                .collect(Collectors.toList());
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    private Card findCardForUser(User user, Long cardId) {
        return user.getCards().stream()
                .filter(card -> card.getId().equals(cardId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Card not found for user: " + cardId));
    }

    private void validateEmailAvailability(String email, Long userId) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent() && !existing.get().getId().equals(userId)) {
            throw new BusinessException("Email already in use");
        }
    }
}
