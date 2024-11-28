package com.example.demo.Api;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class ProxyController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/stations")
    public ResponseEntity<Object> getStations() {
        String thirdPartyApiUrl = "http://103.221.220.183:8088/ctu/geo/stations";

        // Tạo headers cho request (nếu cần gửi Authorization)
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer <your-token-here>"); // Thay <your-token-here> bằng token thật nếu cần
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Object> response = restTemplate.exchange(thirdPartyApiUrl, HttpMethod.GET, entity,
                    Object.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching data: " + ex.getMessage());
        }
    }

    @GetMapping("/multi-data-streams")
    public ResponseEntity<Object> getMultiDataStreams() {
        String thirdPartyApiUrl = "http://103.221.220.183:8088/ctu/geo/multi-data-streams";

        // Tạo headers cho request
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer <your-token-here>"); // Thay <your-token-here> bằng token thật nếu cần
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Object> response = restTemplate.exchange(thirdPartyApiUrl, HttpMethod.GET, entity,
                    Object.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching data: " + ex.getMessage());
        }
    }

}
