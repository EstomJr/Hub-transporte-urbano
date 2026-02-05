package com.urbpe.user_service.dto.response;

public class AdminDashboardResponseDTO {
    private long totalUsers;
    private long totalCards;
    private long activeCards;
    private long inactiveCards;

    public AdminDashboardResponseDTO() {
    }

    public AdminDashboardResponseDTO(long totalUsers, long totalCards, long activeCards, long inactiveCards) {
        this.totalUsers = totalUsers;
        this.totalCards = totalCards;
        this.activeCards = activeCards;
        this.inactiveCards = inactiveCards;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCards() {
        return totalCards;
    }

    public void setTotalCards(long totalCards) {
        this.totalCards = totalCards;
    }

    public long getActiveCards() {
        return activeCards;
    }

    public void setActiveCards(long activeCards) {
        this.activeCards = activeCards;
    }

    public long getInactiveCards() {
        return inactiveCards;
    }

    public void setInactiveCards(long inactiveCards) {
        this.inactiveCards = inactiveCards;
    }
}
