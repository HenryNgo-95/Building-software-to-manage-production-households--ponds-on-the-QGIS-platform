package com.example.demo.Model;

public class PondResponse {
    private Long id;
    private String namepond;
    private String namefarm;
    private String geom; // Dữ liệu WKT
    private String username;
    private String address;
    private String manager;

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNamepond() {
        return namepond;
    }

    public void setNamepond(String namepond) {
        this.namepond = namepond;
    }

    public String getNamefarm() {
        return namefarm;
    }

    public void setNamefarm(String namefarm) {
        this.namefarm = namefarm;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    // Constructor
    public PondResponse(Long id, String namepond, String namefarm, String geom, String username, String address,
            String manager) {
        this.id = id;
        this.namepond = namepond;
        this.namefarm = namefarm;
        this.geom = geom;
        this.username = username;
        this.address = address;
        this.manager = manager;
    }
}
