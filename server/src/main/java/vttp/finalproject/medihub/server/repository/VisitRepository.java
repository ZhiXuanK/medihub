package vttp.finalproject.medihub.server.repository;

import java.util.LinkedList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import static vttp.finalproject.medihub.server.Utils.Q_INSERT_VISIT;
import static vttp.finalproject.medihub.server.Utils.Q_RETRIEVE_VISIT;
import static vttp.finalproject.medihub.server.Utils.Q_RETRIEVE_VISITS_BY_USER;
import static vttp.finalproject.medihub.server.Utils.Q_UPDATE_VISIT;
import static vttp.finalproject.medihub.server.Utils.longToDate;

import java.util.List;

import vttp.finalproject.medihub.server.models.Visit;

@Repository
public class VisitRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void insertVisit(Visit visit){
        jdbcTemplate.update(Q_INSERT_VISIT, visit.getVisit_id(), visit.getUser_id(), visit.getDoctor(), visit.getVisit_date().getTime(), visit.getPurpose(), visit.getNotes());
    }

    public void updateVisit(Visit visit){
        jdbcTemplate.update(Q_UPDATE_VISIT, visit.getVisit_date().getTime(), visit.getPurpose(), visit.getNotes(), visit.getVisit_id());
    }

    public Visit retrieveVisit(String visitid){
        final SqlRowSet rs = jdbcTemplate.queryForRowSet(Q_RETRIEVE_VISIT, visitid);
        rs.next();
        Visit visit = new Visit(
            rs.getString("visit_id"),
            rs.getString("user_id"),
            rs.getString("doctor"),
            longToDate(rs.getLong("visit_date")),
            rs.getString("purpose"),
            rs.getString("notes")
        );

        return visit;
    }

    public List<Visit> retrieveAllVisitByUser(String userid){
        final SqlRowSet rs = jdbcTemplate.queryForRowSet(Q_RETRIEVE_VISITS_BY_USER, userid);
        List<Visit> visits = new LinkedList<>();
        while (rs.next()){
            Visit visit = new Visit(
                rs.getString("visit_id"),
                rs.getString("user_id"),
                rs.getString("doctor"),
                longToDate(rs.getLong("visit_date")),
                rs.getString("purpose"),
                rs.getString("notes")
            );
            visits.add(visit);
        }

        return visits;
    }

}