package com.wevoting.controller;

import com.wevoting.dto.MessageResponse;
import com.wevoting.exception.ResourceNotFoundException;
import com.wevoting.model.Kandidat;
import com.wevoting.repository.KandidatRepository;
import jakarta.annotation.PostConstruct;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/kandidat")
public class KandidatController {

    @Autowired
    KandidatRepository kandidatRepository;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

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

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteKandidat(@PathVariable Long id) {
        Kandidat kandidat = kandidatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kandidat not found with id: " + id));
        // Delete associated files
        if (kandidat.getFoto() != null) {
            try { Files.deleteIfExists(uploadPath.resolve(kandidat.getFoto())); } catch (IOException ignored) {}
        }
        if (kandidat.getVideoVisiMisi() != null) {
            try { Files.deleteIfExists(uploadPath.resolve(kandidat.getVideoVisiMisi())); } catch (IOException ignored) {}
        }
        kandidatRepository.delete(kandidat);
        return ResponseEntity.ok(new MessageResponse("Kandidat deleted successfully"));
    }

    // --- Upload Foto ---
    @PostMapping("/{id}/foto")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadFoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Kandidat kandidat = kandidatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kandidat not found with id: " + id));

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("File foto tidak ditemukan."));
        }

        // Validate image type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(new MessageResponse("File harus berupa gambar (JPEG, PNG, dll)."));
        }

        // Delete old foto if exists
        if (kandidat.getFoto() != null) {
            try { Files.deleteIfExists(uploadPath.resolve(kandidat.getFoto())); } catch (IOException ignored) {}
        }

        // Save new file
        String fileName = saveFile(file);
        kandidat.setFoto(fileName);
        kandidatRepository.save(kandidat);

        return ResponseEntity.ok(Map.of(
            "message", "Foto berhasil diupload!",
            "foto", fileName
        ));
    }

    // --- Upload Video ---
    @PostMapping("/{id}/video")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadVideo(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Kandidat kandidat = kandidatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kandidat not found with id: " + id));

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("File video tidak ditemukan."));
        }

        // Validate video type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            return ResponseEntity.badRequest().body(new MessageResponse("File harus berupa video (MP4, dll)."));
        }

        // Delete old video if exists
        if (kandidat.getVideoVisiMisi() != null) {
            try { Files.deleteIfExists(uploadPath.resolve(kandidat.getVideoVisiMisi())); } catch (IOException ignored) {}
        }

        // Save new file
        String fileName = saveFile(file);
        kandidat.setVideoVisiMisi(fileName);
        kandidatRepository.save(kandidat);

        return ResponseEntity.ok(Map.of(
            "message", "Video berhasil diupload!",
            "video", fileName
        ));
    }

    // --- Import Excel ---
    @PostMapping("/import")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> importExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("File Excel tidak ditemukan."));
        }

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            List<Kandidat> kandidatList = new ArrayList<>();
            List<String> errors = new ArrayList<>();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // skip header row
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String nourut = getCellStringValue(row.getCell(0));
                String nama = getCellStringValue(row.getCell(1));
                String visi = getCellStringValue(row.getCell(2));
                String misi = getCellStringValue(row.getCell(3));

                if (nourut.isEmpty() || nama.isEmpty()) {
                    errors.add("Baris " + (i + 1) + ": No Urut dan Nama wajib diisi.");
                    continue;
                }

                Kandidat k = new Kandidat();
                k.setNourut(nourut);
                k.setNama(nama);
                k.setVisi(visi);
                k.setMisi(misi);
                kandidatList.add(k);
            }

            if (!errors.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", String.join("; ", errors),
                    "successCount", kandidatList.size(),
                    "errorCount", errors.size()
                ));
            }

            if (kandidatList.isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Tidak ada data kandidat yang valid."));
            }

            kandidatRepository.saveAll(kandidatList);
            return ResponseEntity.ok(Map.of(
                "message", kandidatList.size() + " kandidat berhasil diimport!",
                "count", kandidatList.size()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(
                "Gagal membaca file Excel: " + e.getMessage()));
        }
    }

    // --- Download Template Excel ---
    @GetMapping("/template")
    public ResponseEntity<byte[]> downloadTemplate() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Kandidat");

            // Header
            Row headerRow = sheet.createRow(0);
            String[] headers = {"No Urut", "Nama", "Visi", "Misi"};
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Sample data
            Object[][] data = {
                {"1", "Nama Kandidat A", "Visi kandidat A", "Misi kandidat A"},
                {"2", "Nama Kandidat B", "Visi kandidat B", "Misi kandidat B"},
            };
            for (int i = 0; i < data.length; i++) {
                Row row = sheet.createRow(i + 1);
                for (int j = 0; j < data[i].length; j++) {
                    row.createCell(j).setCellValue((String) data[i][j]);
                }
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            byte[] bytes;
            try (var bos = new java.io.ByteArrayOutputStream()) {
                workbook.write(bos);
                bytes = bos.toByteArray();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=template_kandidat.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(bytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // --- Helper Methods ---
    private String saveFile(MultipartFile file) {
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;
        try {
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not save file: " + e.getMessage());
        }
    }

    private String getCellStringValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }

    // --- Response Wrappers ---
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
