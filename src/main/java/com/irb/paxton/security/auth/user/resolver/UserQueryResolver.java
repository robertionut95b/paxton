package com.irb.paxton.security.auth.user.resolver;

import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@DgsComponent
public class UserQueryResolver {

    @Autowired
    private UserService userService;

    @DgsQuery
    public List<User> getAllUsers() {
        return this.userService.getUsers();
    }

    @DgsQuery
    public Optional<User> getCurrentUser() {
        return this.userService.getCurrentUser();
    }

    @DgsQuery
    public PaginatedResponse<User> getAllUsersPaged(@InputArgument SearchRequest searchQuery) {
        return this.userService.advSearch(searchQuery);
    }
}
