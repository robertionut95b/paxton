package com.irb.paxton.security.auth.user.resolver;

import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class UserQueryResolver implements GraphQLQueryResolver {
    @Autowired
    private UserService userService;

    public List<User> getAllUsers() {
        return this.userService.getUsers();
    }

    public PaginatedResponse<User> getAllUsersPaged(SearchRequest searchRequest) {
        return this.userService.advSearch(searchRequest);
    }
}
