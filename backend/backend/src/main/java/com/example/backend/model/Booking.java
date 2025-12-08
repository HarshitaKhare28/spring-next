package com.example.backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bookings")
public class Booking {
    
    @Id
    private String id;
    
    private String userId;
    private String userEmail;
    private String hotelId;
    private String hotelName;
    
    // Guest Information
    private String fullName;
    private String email;
    private String phone;
    
    // Booking Details
    private String checkIn;
    private String checkOut;
    private int nights;
    private int rooms;
    private int adults;
    private int children;
    
    // Pricing
    private double pricePerNight;
    private double totalPrice;
    
    // Additional Details
    private String mealPreference; // none, veg, nonveg
    private String specialRequests;
    
    // Booking Status
    private String status; // CONFIRMED, CANCELLED, COMPLETED
    private LocalDateTime bookingDate;
    private LocalDateTime cancellationDate;
    private String cancellationReason;
    
    // Constructors
    public Booking() {
        this.bookingDate = LocalDateTime.now();
        this.status = "CONFIRMED";
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getUserEmail() {
        return userEmail;
    }
    
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
    
    public String getHotelId() {
        return hotelId;
    }
    
    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }
    
    public String getHotelName() {
        return hotelName;
    }
    
    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getCheckIn() {
        return checkIn;
    }
    
    public void setCheckIn(String checkIn) {
        this.checkIn = checkIn;
    }
    
    public String getCheckOut() {
        return checkOut;
    }
    
    public void setCheckOut(String checkOut) {
        this.checkOut = checkOut;
    }
    
    public int getNights() {
        return nights;
    }
    
    public void setNights(int nights) {
        this.nights = nights;
    }
    
    public int getRooms() {
        return rooms;
    }
    
    public void setRooms(int rooms) {
        this.rooms = rooms;
    }
    
    public int getAdults() {
        return adults;
    }
    
    public void setAdults(int adults) {
        this.adults = adults;
    }
    
    public int getChildren() {
        return children;
    }
    
    public void setChildren(int children) {
        this.children = children;
    }
    
    public double getPricePerNight() {
        return pricePerNight;
    }
    
    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }
    
    public double getTotalPrice() {
        return totalPrice;
    }
    
    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }
    
    public String getMealPreference() {
        return mealPreference;
    }
    
    public void setMealPreference(String mealPreference) {
        this.mealPreference = mealPreference;
    }
    
    public String getSpecialRequests() {
        return specialRequests;
    }
    
    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getBookingDate() {
        return bookingDate;
    }
    
    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }
    
    public LocalDateTime getCancellationDate() {
        return cancellationDate;
    }
    
    public void setCancellationDate(LocalDateTime cancellationDate) {
        this.cancellationDate = cancellationDate;
    }
    
    public String getCancellationReason() {
        return cancellationReason;
    }
    
    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }
}
