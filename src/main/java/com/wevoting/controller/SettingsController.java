package com.wevoting.controller;

import com.wevoting.dto.MessageResponse;
import com.wevoting.exception.ResourceNotFoundException;
import com.wevoting.model.Settings;
import com.wevoting.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSettings(@PathVariable Long id, @RequestBody Settings request) {
        Settings settings = settingsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Settings not found"));
        if (request.getStatus() != null) {
            settings.setStatus(request.getStatus());
        }
        settingsRepository.save(settings);
        return ResponseEntity.ok(new MessageResponse("Settings updated successfully"));
    }

    static class SettingsListResponse {
        private List<Settings> data;
        SettingsListResponse(List<Settings> data) { this.data = data; }
        public List<Settings> getData() { return data; }
    }
}
