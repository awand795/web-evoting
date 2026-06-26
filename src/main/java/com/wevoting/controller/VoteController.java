package com.wevoting.controller;

import com.wevoting.dto.*;
import com.wevoting.exception.ResourceNotFoundException;
import com.wevoting.model.*;
import com.wevoting.security.UserDetailsImpl;
import com.wevoting.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class VoteController {

    @Autowired
    VoteRepository voteRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    KandidatRepository kandidatRepository;

    @Autowired
    SettingsRepository settingsRepository;

    @Autowired
    RoleRepository roleRepository;

    @PostMapping("/vote")
    public ResponseEntity<?> castVote(Authentication authentication, @Valid @RequestBody VoteRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        // Check if user is admin
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return ResponseEntity.status(403).body(new MessageResponse("Admin tidak diizinkan untuk memilih"));
        }

        // Check if voting is open
        List<Settings> settingsList = settingsRepository.findAll();
        if (settingsList.isEmpty() || !"open".equals(settingsList.get(0).getStatus())) {
            return ResponseEntity.status(403).body(new MessageResponse("Voting sedang ditutup"));
        }

        // Check if kandidat exists
        Kandidat kandidat = kandidatRepository.findById(request.getKandidatId())
                .orElseThrow(() -> new ResourceNotFoundException("Kandidat tidak ditemukan"));

        // Check if user already voted
        if (voteRepository.existsByUserId(userId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Anda sudah melakukan voting"));
        }

        // Save vote
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Vote vote = new Vote(user, kandidat);
        voteRepository.save(vote);

        // Update user status
        user.setStatus("Sudah Memilih");
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Vote berhasil disimpan!"));
    }

    @GetMapping("/vote/status")
    public ResponseEntity<?> getVoteStatus(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        Optional<Vote> vote = voteRepository.findByUserId(userId);
        if (vote.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("sudahMemilih", true);
            Map<String, Object> kandidatInfo = new HashMap<>();
            kandidatInfo.put("id", vote.get().getKandidat().getId());
            kandidatInfo.put("nourut", vote.get().getKandidat().getNourut());
            kandidatInfo.put("nama", vote.get().getKandidat().getNama());
            response.put("kandidat", kandidatInfo);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.ok(Map.of("sudahMemilih", false));
    }

    @GetMapping("/hasil")
    public ResponseEntity<?> getHasil() {
        List<Kandidat> kandidatList = kandidatRepository.findAll();

        // Get admin user IDs to exclude their votes
        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).orElse(null);
        List<Long> adminUserIds = new ArrayList<>();
        if (adminRole != null) {
            adminUserIds = userRepository.findAll().stream()
                    .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName() == ERole.ROLE_ADMIN))
                    .map(User::getId)
                    .collect(Collectors.toList());
        }

        List<KandidatResponse> hasil = kandidatList.stream().map(kandidat -> {
            KandidatResponse kr = new KandidatResponse();
            if (kandidat.getId() != null) {
                long count = voteRepository.countByKandidatId(kandidat.getId());
                kr.setJumlahVote(count);
            }
            kr.setId(kandidat.getId());
            kr.setNourut(kandidat.getNourut());
            kr.setNama(kandidat.getNama());
            kr.setFoto(kandidat.getFoto());
            kr.setVisi(kandidat.getVisi());
            kr.setMisi(kandidat.getMisi());
            kr.setVideoVisiMisi(kandidat.getVideoVisiMisi());
            return kr;
        }).sorted((a, b) -> Long.compare(b.getJumlahVote(), a.getJumlahVote()))
         .collect(Collectors.toList());

        long totalVote = hasil.stream().mapToLong(KandidatResponse::getJumlahVote).sum();

        return ResponseEntity.ok(new HasilResponse(hasil, totalVote));
    }
}
