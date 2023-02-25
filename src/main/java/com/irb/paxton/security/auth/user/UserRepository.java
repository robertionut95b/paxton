package com.irb.paxton.security.auth.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    User findByEmailOrUsername(String email, String username);

    @Query("""
            select (count(u) > 0) from User u inner join u.roles roles
            where roles.name = :name and u.username = :username""")
    boolean existsByRoles_NameAndUsername(@Param("name") String name, @Param("username") String username);
}