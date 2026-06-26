package com.wevoting.controller;

import com.wevoting.dto.MessageResponse;
import com.wevoting.exception.ResourceNotFoundException;
import com.wevoting.model.Kandidat;
import com.wevoting.repository.KandidatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/kandidat")
public class KandidatController {

    @Autowired
    KandidatRepository kandidatRepository;

    @GetMapping
    public ResponseEntity<?> getAllKandidat() {
        List<Kandidat> kandidatList = kandidatRepository.findAllByOrderByNourutAsc();
        return ResponseEntity.ok(new KandidatListResponse(kandidatList));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getKandidatById(@PathVariable Long id) {
        Kandidat kandidat = kandidatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kandidat not found with id: " + id));
        return ResponseEntity.ok(new KandidatResponse(kandidat));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createKandidat(@RequestBody Kandidat kandidat) {
        kandidatRepository.save(kandidat);
        return ResponseEntity.ok(new MessageResponse("Kandidat created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateKandidat(@PathVariable Long id, @RequestBody Kandidat request) {
        Kandidat kandidat = kandidatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kandidat not found with id: " + id));
        if (request.getNourut() != null) kandidat.setNourut(request.getNourut());
        if (request.getNama() != null) kandidat.setNama(request.getNama());
        if (request.getVisi() != null) kandidat.setVisi(request.getVisi());
        if (request.getMisi() != null) kandidat.setMisi(request.getMisi());
        if (request.getFoto() != null) kandidat.setFoto(request.getFoto());
        if (request.getVideoVisiMisi() != null) kandidat.setVideoVisiMisi(request.getVideoVisiMisi());
        kandidatRepository.save(kandidat);
        return ResponseEntity.ok(new MessageResponse("Kandidat updated successfully"));
    }

    @GetMapping("/template")
    public ResponseEntity<?> downloadTemplate() {
        String[] headers = {"No Urut", "Nama", "Visi", "Misi"};
        String[][] data = {
            {"1", "Nama Kandidat A", "Visi kandidat A", "Misi kandidat A"},
            {"2", "Nama Kandidat B", "Visi kandidat B", "Misi kandidat B"}
        };
        return ResponseEntity.ok(Map.of(
            "headers", headers,
            "template", data,
            "message", "Template format: No Urut, Nama, Visi, Misi"
        ));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteKandidat(@PathVariable Long id) {
        Kandidat kandidat = kandidatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kandidat not found with id: " + id));
        kandidatRepository.delete(kandidat);
        return ResponseEntity.ok(new MessageResponse("Kandidat deleted successfully"));
    }

    // Response wrapper classes
    static class KandidatListResponse {
        private List<Kandidat> data;
        KandidatListResponse(List<Kandidat> data) { this.data = data; }
        public List<Kandidat> getData() { return data; }
    }

    static class KandidatResponse {
        private Kandidat data;
        KandidatResponse(Kandidat data) { this.data = data; }
        public Kandidat getData() { return data; }
    }
}
