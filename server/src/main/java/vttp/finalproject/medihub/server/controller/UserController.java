package vttp.finalproject.medihub.server.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.firebase.auth.FirebaseAuthException;

import jakarta.servlet.http.HttpServletRequest;
import vttp.finalproject.medihub.server.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userSvc;

    @PostMapping(path={"/signup"}, produces=MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> postSignupUser(
            HttpServletRequest req) throws FirebaseAuthException {
        String authHeader = req.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            return new ResponseEntity<>("Missing or invalid authorization header", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        Boolean reg = userSvc.registerUser(token);

        if (reg) {
            return ResponseEntity.ok("User registered successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
        }
    }


    @PostMapping(path={"/saveprofile"})
    public ResponseEntity<String> postSaveProfile(
        @RequestBody String payload
    ){
        userSvc.insertProfile(payload);

        return ResponseEntity.ok("");
    }

    @GetMapping(path={"/retrieveprofile"})
    public ResponseEntity<String> getRetrieveProfile(
        @RequestParam String uid
    ){
        System.out.println(uid);
        Optional<String> profile = userSvc.retrieveProfile(uid);
        System.out.println(profile.get());
        if (profile.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(profile.get());
    }

    @PutMapping(path="/updateprofile")
    public ResponseEntity<String> putUpdatedProfile(
        @RequestBody String payload
    ){
        userSvc.updateProfile(payload);

        return ResponseEntity.ok("");
    }
}