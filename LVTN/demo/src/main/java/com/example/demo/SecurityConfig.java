package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Bean để mã hóa mật khẩu bằng BCrypt
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Cấu hình CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.addAllowedOrigin("http://127.0.0.1:5500"); // Chỉ định nguồn được phép
        configuration.addAllowedOrigin("http://localhost:5500"); // Thêm cả localhost
        configuration.addAllowedHeader("*"); // Cho phép tất cả các headers
        configuration.addAllowedMethod("*"); // Cho phép tất cả các phương thức (GET, POST, PUT, DELETE, ...)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Cấu hình bảo mật chính
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("Configuring security for /api/ponds with permitAll");
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Kích hoạt CORS với cấu hình trên
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/register", "/api/register", "/api/login", "/api/addfarm", "/api/farms",
                                "/api/addpond", "/api/farms/**", "/api/ponds", "/api/deletepond/**", "/api/updatepond",
                                "/api/stations",
                                "api/multi-data-streams")
                        .permitAll()
                        .anyRequest().authenticated())
                .httpBasic(); // Sử dụng http basic cho xác thực đơn giản (có thể thay bằng xác thực JWT nếu
                              // cần)
        return http.build();
    }
}
