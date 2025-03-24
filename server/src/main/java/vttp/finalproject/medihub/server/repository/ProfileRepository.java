package vttp.finalproject.medihub.server.repository;

import java.util.List;
import java.util.Optional;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;


@Repository
public class ProfileRepository {
    
    @Autowired
    private MongoTemplate mongoTemplate;

    //insert medicine profile
    public void insertProfile(Document profile){
        mongoTemplate.insert(profile, "medicine_profile");
    }

    //retrieve medical profile
    public Optional<List<Document>> retrieveProfile(String uid){
        Query query = Query.query(Criteria.where("user_id").is(uid));
        return Optional.ofNullable(mongoTemplate.find(query, Document.class, "medicine_profile"));
    }

    public void deleteProfile(String uid){
        Query query = Query.query(Criteria.where("user_id").is(uid));
        mongoTemplate.remove(query, "medicine_profile");
    }

}