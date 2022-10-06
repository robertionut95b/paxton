package com.irb.paxton.security.auth.user.resolver;

import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@DgsComponent
public class UserQueryResolver {
    @Autowired
    private UserService userService;

    @DgsQuery
    public List<User> getAllUsers() {
        return this.userService.getUsers();
    }
}
