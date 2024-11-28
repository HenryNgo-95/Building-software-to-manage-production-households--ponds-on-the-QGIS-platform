package com.example.demo.Model;

public class PondRequest {
    private Long id; // ID của ao cần cập nhật
    private String namefarm;
    private String namepond;
    private String address;
    private String geom; // Dữ liệu WKT cho Geometry
    private String username;
    private String manager;

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }

    public String getNamefarm() {
        return namefarm;
    }

    public void setNamefarm(String namefarm) {
        this.namefarm = namefarm;
    }

    public String getNamepond() {
        return namepond;
    }

    public void setNamepond(String namepond) {
        this.namepond = namepond;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGeom() {
        return geom;
    }

    public void setGeom(String geom) {
        this.geom = geom;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
