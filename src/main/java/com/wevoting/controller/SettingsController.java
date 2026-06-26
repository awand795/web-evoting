package com.wevoting.controller;

import com.wevoting.dto.MessageResponse;
import com.wevoting.exception.ResourceNotFoundException;
import com.wevoting.model.Settings;
import com.wevoting.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/settings")
public class SettingsController {

    @Autowired
    SettingsRepository settingsRepository;

    @GetMapping
    public ResponseEntity<?> getSettings() {
        List<Settings> settings = settingsRepository.findAll();
        return ResponseEntity.ok(new SettingsListResponse(settings));
    }

    @GetMapping("/public")
    public ResponseEntity<?> getSettingsPublic() {
        List<Settings> settings = settingsRepository.findAll();
        if (settings.isEmpty()) {
            return ResponseEntity.ok(new SettingsPublicResponse("closed", null, null));
        }
        Settings s = settings.get(0);
        return ResponseEntity.ok(new SettingsPublicResponse(s.getStatus(), s.getWaktuMulai(), s.getWaktuSelesai()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSettings(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Settings settings = settingsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Settings not found"));

        if (body.containsKey("status")) {
            settings.setStatus((String) body.get("status"));
        }
        if (body.containsKey("waktuMulai")) {
            String waktuMulaiStr = (String) body.get("waktuMulai");
            settings.setWaktuMulai(waktuMulaiStr != null && !waktuMulaiStr.isEmpty()
                    ? LocalDateTime.parse(waktuMulaiStr) : null);
        }
        if (body.containsKey("waktuSelesai")) {
            String waktuSelesaiStr = (String) body.get("waktuSelesai");
            settings.setWaktuSelesai(waktuSelesaiStr != null && !waktuSelesaiStr.isEmpty()
                    ? LocalDateTime.parse(waktuSelesaiStr) : null);
        }

        // Validasi: waktuSelesai harus setelah waktuMulai
        if (settings.getWaktuMulai() != null && settings.getWaktuSelesai() != null
                && settings.getWaktuSelesai().isBefore(settings.getWaktuMulai())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Waktu selesai harus setelah waktu mulai"));
        }
        // Validasi: waktuSelesai tidak boleh di masa lalu jika status open
        if ("open".equals(settings.getStatus()) && settings.getWaktuSelesai() != null
                && settings.getWaktuSelesai().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Waktu selesai tidak boleh sudah lewat"));
        }

        settingsRepository.save(settings);
        return ResponseEntity.ok(new MessageResponse("Settings updated successfully"));
    }

    static class SettingsListResponse {
        private List<Settings> data;
        SettingsListResponse(List<Settings> data) { this.data = data; }
        public List<Settings> getData() { return data; }
    }

    static class SettingsPublicResponse {
        private String status;
        private String waktuMulai;
        private String waktuSelesai;
        SettingsPublicResponse(String status, LocalDateTime waktuMulai, LocalDateTime waktuSelesai) {
            this.status = status;
            this.waktuMulai = waktuMulai != null ? waktuMulai.toString() : null;
            this.waktuSelesai = waktuSelesai != null ? waktuSelesai.toString() : null;
        }
        public String getStatus() { return status; }
        public String getWaktuMulai() { return waktuMulai; }
        public String getWaktuSelesai() { return waktuSelesai; }
    }
}
