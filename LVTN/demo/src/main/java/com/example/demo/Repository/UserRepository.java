package com.example.demo.Repository;

import com.example.demo.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, String> {
    boolean existsByEmail(String email); // Kiểm tra tồn tại email

    boolean existsByUsername(String username); // Kiểm tra tồn tại username

    Users findByEmail(String email); // Kiểm tra và tìm kiếm người dùng theo email

    Users findByUsername(String username); // Tìm kiếm người dùng theo username
}
