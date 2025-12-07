package com.example.backend.dto;

public class AuthResponse {
    private String message;
    private String userId;
    private String email;
    private String name;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String message, String userId, String email, String name) {
        this.message = message;
        this.userId = userId;
        this.email = email;
        this.name = name;
    }
    
    // Getters and Setters
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
