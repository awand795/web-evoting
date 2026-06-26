package com.wevoting.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wevoting.config.DatabaseInitializer;
import com.wevoting.model.Settings;
import com.wevoting.repository.SettingsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SettingsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SettingsRepository settingsRepository;

    @MockitoBean
    private DatabaseInitializer databaseInitializer;

    @Autowired
    private ObjectMapper objectMapper;

    private Settings testSettings;

    @BeforeEach
    void setUp() {
        testSettings = new Settings("open");
        testSettings.setId(1L);
        testSettings.setWaktuMulai(LocalDateTime.now().plusDays(1));
        testSettings.setWaktuSelesai(LocalDateTime.now().plusDays(2));
    }

    @Test
    void getSettingsPublic_shouldReturnSchedule() throws Exception {
        when(settingsRepository.findAll()).thenReturn(List.of(testSettings));

        mockMvc.perform(get("/settings/public"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("open"))
                .andExpect(jsonPath("$.waktuMulai").isNotEmpty())
                .andExpect(jsonPath("$.waktuSelesai").isNotEmpty());
    }

    @Test
    void getSettingsPublic_whenEmpty_shouldReturnClosed() throws Exception {
        when(settingsRepository.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/settings/public"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("closed"))
                .andExpect(jsonPath("$.waktuMulai").isEmpty())
                .andExpect(jsonPath("$.waktuSelesai").isEmpty());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSettings_withValidSchedule_shouldSucceed() throws Exception {
        when(settingsRepository.findById(1L)).thenReturn(Optional.of(testSettings));
        when(settingsRepository.save(any(Settings.class))).thenReturn(testSettings);

        LocalDateTime futureStart = LocalDateTime.now().plusDays(3);
        LocalDateTime futureEnd = LocalDateTime.now().plusDays(4);

        Map<String, String> body = Map.of(
            "waktuMulai", futureStart.toString(),
            "waktuSelesai", futureEnd.toString()
        );

        mockMvc.perform(put("/settings/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Settings updated successfully"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSettings_withInvalidSchedule_shouldReturn400() throws Exception {
        when(settingsRepository.findById(1L)).thenReturn(Optional.of(testSettings));

        LocalDateTime start = LocalDateTime.now().plusDays(5);
        LocalDateTime end = LocalDateTime.now().plusDays(3);

        Map<String, String> body = Map.of(
            "waktuMulai", start.toString(),
            "waktuSelesai", end.toString()
        );

        mockMvc.perform(put("/settings/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Waktu selesai harus setelah waktu mulai"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSettings_withOnlyStatus_shouldSucceed() throws Exception {
        when(settingsRepository.findById(1L)).thenReturn(Optional.of(testSettings));
        when(settingsRepository.save(any(Settings.class))).thenReturn(testSettings);

        Map<String, String> body = Map.of("status", "closed");

        mockMvc.perform(put("/settings/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Settings updated successfully"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSettings_withNullSchedule_shouldClearDates() throws Exception {
        when(settingsRepository.findById(1L)).thenReturn(Optional.of(testSettings));
        when(settingsRepository.save(any(Settings.class))).thenReturn(testSettings);

        Map<String, String> body = Map.of(
            "waktuMulai", "",
            "waktuSelesai", ""
        );

        mockMvc.perform(put("/settings/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Settings updated successfully"));
    }
}
