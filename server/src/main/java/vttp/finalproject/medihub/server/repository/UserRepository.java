package vttp.finalproject.medihub.server.repository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import static vttp.finalproject.medihub.server.Utils.Q_CHECK_USER_EXIST;
import static vttp.finalproject.medihub.server.Utils.Q_INSERT_USER;
import static vttp.finalproject.medihub.server.Utils.Q_RETRIEVE_USER_EMAIL;
import vttp.finalproject.medihub.server.models.User;

@Repository
public class UserRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    //check if user exist
    public Optional<User> checkIfUserExist(String uid){
        SqlRowSet rs = jdbcTemplate.queryForRowSet(Q_CHECK_USER_EXIST , uid);

        if (rs.next()){
            User user = new User(rs.getString("user_id"), rs.getString("email"));
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public void insertUser(User user){
        jdbcTemplate.update(Q_INSERT_USER, user.getEmail(), user.getUid());
    }

    public String retrieveUserEmail(String uid){
        SqlRowSet rs = jdbcTemplate.queryForRowSet(Q_RETRIEVE_USER_EMAIL, uid);
        rs.next();
        return rs.getString("email");
    }

}
