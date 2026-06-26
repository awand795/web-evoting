package com.wevoting.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wevoting.dto.VoteRequest;
import com.wevoting.config.DatabaseInitializer;
import com.wevoting.model.*;
import com.wevoting.repository.*;
import com.wevoting.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class VoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private VoteRepository voteRepository;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private KandidatRepository kandidatRepository;

    @MockitoBean
    private SettingsRepository settingsRepository;

    @MockitoBean
    private RoleRepository roleRepository;

    @MockitoBean
    private DatabaseInitializer databaseInitializer;

    @Autowired
    private ObjectMapper objectMapper;

    private Settings openSettings;
    private Kandidat testKandidat;
    private VoteRequest validVoteRequest;
    private User testUser;
    private UserDetailsImpl testUserDetails;

    @BeforeEach
    void setUp() {
        openSettings = new Settings("open");
        openSettings.setId(1L);
        openSettings.setWaktuMulai(LocalDateTime.now().minusDays(1));
        openSettings.setWaktuSelesai(LocalDateTime.now().plusDays(1));

        testKandidat = new Kandidat();
        testKandidat.setId(1L);
        testKandidat.setNourut("1");
        testKandidat.setNama("Test Kandidat");

        validVoteRequest = new VoteRequest();
        validVoteRequest.setKandidatId(1L);

        Role userRole = new Role(ERole.ROLE_USER);
        testUser = new User("Test User", "testuser", "test@test.com", "password");
        testUser.setId(1L);
        testUser.setRoles(Set.of(userRole));

        testUserDetails = UserDetailsImpl.build(testUser);
    }

    @Test
    void castVote_withValidUser_shouldSucceed() throws Exception {
        when(settingsRepository.findAll()).thenReturn(List.of(openSettings));
        when(kandidatRepository.findById(1L)).thenReturn(Optional.of(testKandidat));
        when(voteRepository.existsByUserId(any())).thenReturn(false);
        when(userRepository.findById(any())).thenReturn(Optional.of(testUser));
        when(voteRepository.save(any(Vote.class))).thenReturn(new Vote());

        mockMvc.perform(post("/vote")
                .with(user(testUserDetails))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validVoteRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Vote berhasil disimpan!"));
    }

    @Test
    void castVote_whenAlreadyVoted_shouldReturn400() throws Exception {
        when(settingsRepository.findAll()).thenReturn(List.of(openSettings));
        when(kandidatRepository.findById(1L)).thenReturn(Optional.of(testKandidat));
        when(voteRepository.existsByUserId(any())).thenReturn(true);

        mockMvc.perform(post("/vote")
                .with(user(testUserDetails))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validVoteRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Anda sudah melakukan voting"));
    }

    @Test
    void castVote_asAdmin_shouldReturn403() throws Exception {
        Role adminRole = new Role(ERole.ROLE_ADMIN);
        User adminUser = new User("Admin", "admin", "admin@test.com", "password");
        adminUser.setId(2L);
        adminUser.setRoles(Set.of(adminRole));
        UserDetailsImpl adminDetails = UserDetailsImpl.build(adminUser);

        mockMvc.perform(post("/vote")
                .with(user(adminDetails))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validVoteRequest)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Admin tidak diizinkan untuk memilih"));
    }

    @Test
    void castVote_whenVotingClosed_shouldReturn403() throws Exception {
        Settings closedSettings = new Settings("closed");
        closedSettings.setId(1L);
        when(settingsRepository.findAll()).thenReturn(List.of(closedSettings));

        mockMvc.perform(post("/vote")
                .with(user(testUserDetails))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validVoteRequest)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Voting sedang ditutup"));
    }

    @Test
    void castVote_whenVotingNotStarted_shouldReturn403() throws Exception {
        Settings notStartedSettings = new Settings("open");
        notStartedSettings.setId(1L);
        notStartedSettings.setWaktuMulai(LocalDateTime.now().plusDays(1));
        notStartedSettings.setWaktuSelesai(LocalDateTime.now().plusDays(2));
        when(settingsRepository.findAll()).thenReturn(List.of(notStartedSettings));

        mockMvc.perform(post("/vote")
                .with(user(testUserDetails))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validVoteRequest)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Voting belum dimulai. Silakan tunggu jadwal yang ditentukan."));
    }

    @Test
    void castVote_whenVotingEnded_shouldReturn403() throws Exception {
        Settings endedSettings = new Settings("open");
        endedSettings.setId(1L);
        endedSettings.setWaktuMulai(LocalDateTime.now().minusDays(2));
        endedSettings.setWaktuSelesai(LocalDateTime.now().minusDays(1));
        when(settingsRepository.findAll()).thenReturn(List.of(endedSettings));

        mockMvc.perform(post("/vote")
                .with(user(testUserDetails))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validVoteRequest)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Sesi voting telah berakhir."));
    }

    @Test
    void castVote_whenNoKandidat_shouldReturn404() throws Exception {
        when(settingsRepository.findAll()).thenReturn(List.of(openSettings));
        when(kandidatRepository.findById(99L)).thenReturn(Optional.empty());

        VoteRequest invalidRequest = new VoteRequest();
        invalidRequest.setKandidatId(99L);

        mockMvc.perform(post("/vote")
                .with(user(testUserDetails))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isNotFound());
    }
}
