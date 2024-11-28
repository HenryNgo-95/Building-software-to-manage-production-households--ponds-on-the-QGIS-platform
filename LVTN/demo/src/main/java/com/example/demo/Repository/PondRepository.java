package com.example.demo.Repository;

import com.example.demo.Model.Pond;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

@Repository
public interface PondRepository extends JpaRepository<Pond, Long> {
        @Modifying
        @Transactional
        @Query(value = "INSERT INTO pond (namefarm, namepond, address, geom, username, manager) " +
                        "VALUES (:namefarm, :namepond, :address, ST_GeomFromText(:geom, 4326), :username, :manager)", nativeQuery = true)
        void savePond(@Param("namefarm") String namefarm,
                        @Param("namepond") String namepond,
                        @Param("address") String address,
                        @Param("geom") String geom,
                        @Param("username") String username,
                        @Param("manager") String manager);

        @Query("SELECT id, namepond, namefarm, ST_AsText(geom) as geom, username, address, manager " +
                        "FROM Pond WHERE username = :username")
        List<Object[]> findPondsByUsername(@Param("username") String username);

        //////////////////////
        Optional<Pond> findById(Long id); // Tìm kiếm ao nuôi theo ID
}