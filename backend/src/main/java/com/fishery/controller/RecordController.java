package com.fishery.controller;

import com.fishery.model.FisheryRecord;
import com.fishery.repository.FisheryRecordRepository;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/records")
public class RecordController {

    private final FisheryRecordRepository repo;

    public RecordController(FisheryRecordRepository repo) {
        this.repo = repo;
    }

    /** List / search / sort-by-surname.  GET /api/records?q=juan&sort=asc|desc */
    @GetMapping
    public List<FisheryRecord> list(@RequestParam(required = false) String q,
                                    @RequestParam(defaultValue = "asc") String sort) {
        Sort order = Sort.by("desc".equalsIgnoreCase(sort) ? Sort.Direction.DESC : Sort.Direction.ASC,
                "surname", "firstName");
        if (q == null || q.isBlank()) return repo.findAll(order);
        return repo.search(q.trim(), order);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FisheryRecord> get(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody FisheryRecord rec) {
        rec.setId(null);
        try {
            return ResponseEntity.ok(repo.save(rec));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Permit number already exists"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody FisheryRecord rec) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        rec.setId(id);
        try {
            return ResponseEntity.ok(repo.save(rec));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Permit number already exists"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /** Dashboard / report numbers.  GET /api/records/stats */
    @GetMapping("/stats")
    public Map<String, Object> stats() {
        List<FisheryRecord> all = repo.findAll();
        LocalDate today = LocalDate.now();
        long active = all.stream().filter(r -> r.getPermitExpiry() != null && !r.getPermitExpiry().isBefore(today)).count();
        long expired = all.stream().filter(r -> r.getPermitExpiry() != null && r.getPermitExpiry().isBefore(today)).count();
        long boats = all.stream().filter(r -> r.getBoatName() != null && !r.getBoatName().isBlank()).count();

        Map<String, Long> byGear = all.stream()
                .filter(r -> r.getFishingGear() != null && !r.getFishingGear().isBlank())
                .collect(Collectors.groupingBy(FisheryRecord::getFishingGear, TreeMap::new, Collectors.counting()));
        Map<String, Long> byActivity = all.stream()
                .filter(r -> r.getFishingActivity() != null && !r.getFishingActivity().isBlank())
                .collect(Collectors.groupingBy(FisheryRecord::getFishingActivity, TreeMap::new, Collectors.counting()));

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("totalFisherfolk", all.size());
        out.put("activePermits", active);
        out.put("expiredPermits", expired);
        out.put("registeredBoats", boats);
        out.put("byGear", byGear);
        out.put("byActivity", byActivity);
        return out;
    }
}
