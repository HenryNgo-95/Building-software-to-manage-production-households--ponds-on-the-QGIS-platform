package com.example.demo.Service;

import com.example.demo.Repository.UserRepository;
import com.example.demo.Model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean registerUser(Users user) {
        // Kiểm tra xem email đã tồn tại hay chưa
        if (userRepository.existsByEmail(user.getEmail())) {
            return false; // Email đã tồn tại
        }
        // Kiểm tra xem username đã tồn tại hay chưa
        if (userRepository.existsByUsername(user.getUsername())) {
            return false; // Username đã tồn tại
        }
        userRepository.save(user); // Lưu người dùng vào CSDL
        return true; // Đăng ký thành công
    }

    public Users findByEmail(String email) {
        return userRepository.findByEmail(email); // Giả định bạn đã tạo phương thức này trong UserRepository
    }

    public Users findByUsername(String username) {
        return userRepository.findByUsername(username); // Tìm kiếm người dùng theo username
    }
}
