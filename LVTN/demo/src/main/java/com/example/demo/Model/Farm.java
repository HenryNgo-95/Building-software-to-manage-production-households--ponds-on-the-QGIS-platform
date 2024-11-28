package com.example.demo.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "farm")
public class Farm {

    @Id
    @Column(name = "namefarm", nullable = false, unique = true) // Đánh dấu name_farm là khóa chính
    private String namefarm; // Tên trại, khóa chính

    private String username; // Khóa phụ
    private String address; // Địa chỉ
    private String phone; // Số điện thoại
    private String farming; // Loại hình nuôi trồng
    private String obj; // Loại giống
    private String manager; // Tên người quản lý

    // Getter và Setter
    public String getNamefarm() {
        return namefarm;
    }

    public void setNamefarm(String namefarm) {
        this.namefarm = namefarm;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFarming() {
        return farming;
    }

    public void setFarming(String farming) {
        this.farming = farming;
    }

    public String getObj() {
        return obj;
    }

    public void setObj(String obj) {
        this.obj = obj;
    }

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }
}
