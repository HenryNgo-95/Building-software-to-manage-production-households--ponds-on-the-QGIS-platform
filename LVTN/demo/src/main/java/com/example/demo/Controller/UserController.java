package com.example.demo.Controller;

import com.example.demo.Service.UserService;
import com.example.demo.Model.Users;

import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.Model.ResponseMessage;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    // Logic xử lý đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Users user) {
        // Mã hóa mật khẩu
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        // Xử lý lưu người dùng vào csdl
        boolean isSuccess = userService.registerUser(user);
        if (isSuccess) {
            // return ResponseEntity.ok().body("Đăng ký thành công!");
            return ResponseEntity.ok(new ResponseMessage("Đăng ký thành công!"));
        } else {
            return ResponseEntity.badRequest().body("Email đã được sử dụng.");
        }
    }

    // Logic xử lý đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Users user) {
        Users existingUser = userService.findByUsername(user.getUsername()); // Tìmkiếm theo username
        if (existingUser != null && passwordEncoder.matches(user.getPassword(),
                existingUser.getPassword())) {
            // Trả về JSON chứa success: true
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đăng nhập thành công");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(new ResponseMessage("Email hoặc mật khẩu không đúng."));
        }
    }
}
