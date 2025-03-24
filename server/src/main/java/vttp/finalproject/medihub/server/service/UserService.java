package vttp.finalproject.medihub.server.service;

import java.util.List;
import java.util.Optional;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

import vttp.finalproject.medihub.server.models.User;
import vttp.finalproject.medihub.server.repository.ProfileRepository;
import vttp.finalproject.medihub.server.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private ProfileRepository profileRepo;

    @Autowired
    private UserRepository userRepo;

    public boolean registerUser(String token) throws FirebaseAuthException{

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();

            Optional<User> user = userRepo.checkIfUserExist(uid);
            if (user.isEmpty()){
                User newUser = new User(uid, email);
                userRepo.insertUser(newUser);

                return true;
            }

        } catch (Exception e){
            e.printStackTrace();
            return false;
        }
        
        return false;

    }

    public void insertProfile(String prof){

        Document profile = Document.parse(prof);

        profileRepo.insertProfile(profile);

    }

    public Optional<String> retrieveProfile(String uid){

        Optional<List<Document>> prof = profileRepo.retrieveProfile(uid);

        if (prof.isEmpty()){
            return Optional.empty();
        }

        List<Document> profiles = prof.get();
        String profile = profiles.get(0).toJson();
        return Optional.ofNullable(profile);

    }

    @Transactional
    //delete existing medical profile information and replace with new profile
    public void updateProfile(String prof){
        Document profile = Document.parse(prof);

        profileRepo.deleteProfile(profile.getString("user_id"));
        profileRepo.insertProfile(profile);

    }



}
