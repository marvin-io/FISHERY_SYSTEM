package com.fishery.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "fishery_records")
public class FisheryRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ----- Fisher / Fisherfolk Registration -----
    @NotBlank
    @Column(name = "first_name", nullable = false, length = 60)
    private String firstName;

    @Column(name = "middle_name", length = 60)
    private String middleName;

    @NotBlank
    @Column(nullable = false, length = 60)
    private String surname;

    @Column(length = 200)
    private String address;

    @Column(name = "contact_number", length = 30)
    private String contactNumber;

    @NotNull
    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate;

    // ----- Permit Information -----
    @Column(name = "permit_number", unique = true, length = 50)
    private String permitNumber;

    @Column(name = "permit_expiry")
    private LocalDate permitExpiry;

    // ----- Fishing Boat -----
    @Column(name = "boat_name", length = 80)
    private String boatName;

    @Column(name = "boat_registration_no", length = 50)
    private String boatRegistrationNo;

    @Column(name = "boat_type", length = 50)
    private String boatType;

    // ----- Fishing Gear -----
    @Column(name = "fishing_gear", length = 100)
    private String fishingGear;

    // ----- Fishing Activity -----
    @Column(name = "fishing_activity", length = 100)
    private String fishingActivity;

    @Column(name = "fishing_area", length = 100)
    private String fishingArea;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String v) { this.firstName = v; }
    public String getMiddleName() { return middleName; }
    public void setMiddleName(String v) { this.middleName = v; }
    public String getSurname() { return surname; }
    public void setSurname(String v) { this.surname = v; }
    public String getAddress() { return address; }
    public void setAddress(String v) { this.address = v; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String v) { this.contactNumber = v; }
    public LocalDate getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDate v) { this.registrationDate = v; }
    public String getPermitNumber() { return permitNumber; }
    public void setPermitNumber(String v) { this.permitNumber = (v == null || v.isBlank()) ? null : v; }
    public LocalDate getPermitExpiry() { return permitExpiry; }
    public void setPermitExpiry(LocalDate v) { this.permitExpiry = v; }
    public String getBoatName() { return boatName; }
    public void setBoatName(String v) { this.boatName = v; }
    public String getBoatRegistrationNo() { return boatRegistrationNo; }
    public void setBoatRegistrationNo(String v) { this.boatRegistrationNo = v; }
    public String getBoatType() { return boatType; }
    public void setBoatType(String v) { this.boatType = v; }
    public String getFishingGear() { return fishingGear; }
    public void setFishingGear(String v) { this.fishingGear = v; }
    public String getFishingActivity() { return fishingActivity; }
    public void setFishingActivity(String v) { this.fishingActivity = v; }
    public String getFishingArea() { return fishingArea; }
    public void setFishingArea(String v) { this.fishingArea = v; }
}
