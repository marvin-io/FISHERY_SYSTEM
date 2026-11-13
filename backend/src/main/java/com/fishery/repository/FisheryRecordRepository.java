package com.fishery.repository;

import com.fishery.model.FisheryRecord;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FisheryRecordRepository extends JpaRepository<FisheryRecord, Long> {

    @Query("""
        SELECT r FROM FisheryRecord r
        WHERE LOWER(r.firstName)          LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(r.surname)            LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(r.permitNumber)       LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(r.boatName)           LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(r.boatRegistrationNo) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(r.fishingGear)        LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(r.fishingActivity)    LIKE LOWER(CONCAT('%', :q, '%'))
        """)
    List<FisheryRecord> search(@Param("q") String q, Sort sort);
}
