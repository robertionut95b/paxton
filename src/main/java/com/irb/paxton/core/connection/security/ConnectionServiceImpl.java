package com.irb.paxton.core.connection.security;

import com.irb.paxton.core.connection.Connection;
import com.irb.paxton.core.model.security.PaginationSecurityService;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SlicedResponse;
import com.irb.paxton.security.auth.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service(value = "connectionSecurityService")
public class ConnectionServiceImpl implements PaginationSecurityService {

    @Override
    public boolean isSecured(Authentication authentication, PaginatedResponse<Object> response) {
        Page<Object> list = response.getList();
        return list.stream().allMatch(o -> {
            if (o instanceof Connection connection) {
                List<User> users = List.of(connection.getAddressed(), connection.getRequester());
                return users
                        .stream()
                        .anyMatch(user -> user.getUsername().equals(authentication.getName()));
            } else return false;
        });
    }

    @Override
    public boolean isSecured(Authentication authentication, SlicedResponse<Object> response) {
        Slice<Object> list = response.getList();
        return list.stream().allMatch(o -> {
            if (o instanceof Connection connection) {
                List<User> users = List.of(connection.getAddressed(), connection.getRequester());
                return users
                        .stream()
                        .anyMatch(user -> user.getUsername().equals(authentication.getName()));
            } else return false;
        });
    }
}
