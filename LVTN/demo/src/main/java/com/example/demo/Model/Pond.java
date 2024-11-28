package com.example.demo.Model;

import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.io.WKTWriter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pond")
public class Pond {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

    private String namepond;
    private String namefarm;
    private String address;
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

    @Column(name = "geom", columnDefinition = "geometry", nullable = true)
    private Geometry geom; // Sử dụng PGgeometry thay vì Geometry

    public Geometry getGeom() {
        return geom;
    }

    public void setGeom(Geometry geom) {
        this.geom = geom;
    }

    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // Constructor mặc định
    public Pond() {
    }

    // Constructor có tham số
    public Pond(String namefarm, String namepond, String address, Geometry geom, String username, String manager) {
        this.namefarm = namefarm;
        this.namepond = namepond;
        this.address = address;
        this.geom = geom;
        this.username = username;
        this.manager = manager;
    }

    ////////////////////////////////
    // Phương thức để chuyển geom thành WKT khi trả về
    public String getGeomWKT() {
        if (geom != null) {
            WKTWriter writer = new WKTWriter();
            return writer.write(geom);
        }
        return null;
    }

}
