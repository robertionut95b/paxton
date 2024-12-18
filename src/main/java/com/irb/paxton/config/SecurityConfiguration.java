package com.irb.paxton.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.irb.paxton.security.auth.jwt.JwtConverter;
import com.irb.paxton.security.auth.role.PaxtonRole;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.UnauthorizedEntryPoint;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.mapper.ErrorCodeMapper;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.mapper.ErrorMessageMapper;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.mapper.HttpStatusMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.toH2Console;
import static org.springframework.security.config.Customizer.withDefaults;
import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
@EnableWebSecurity
@EnableTransactionManagement(order = 0)
@Order(value = 1)
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
public class SecurityConfiguration {

    private final JwtConverter jwtConverter;

    public SecurityConfiguration(JwtConverter jwtConverter) {
        this.jwtConverter = jwtConverter;
    }

    @Bean
    public RoleHierarchyImpl roleHierarchy() {
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        String hierarchy = "%s > %s > %s".formatted(PaxtonRole.ROLE_ADMINISTRATOR.name(),
                PaxtonRole.ROLE_RECRUITER.name(),
                PaxtonRole.ROLE_EVERYONE.name());
        roleHierarchy.setHierarchy(hierarchy);
        return roleHierarchy;
    }

    @Bean
    public DefaultWebSecurityExpressionHandler webSecurityExpressionHandler() {
        DefaultWebSecurityExpressionHandler expressionHandler = new DefaultWebSecurityExpressionHandler();
        expressionHandler.setRoleHierarchy(roleHierarchy());
        return expressionHandler;
    }

    @Bean
    MvcRequestMatcher.Builder mvc(HandlerMappingIntrospector introspector) {
        return new MvcRequestMatcher.Builder(introspector);
    }

    @Bean
    public UnauthorizedEntryPoint unauthorizedEntryPoint(HttpStatusMapper httpStatusMapper,
                                                         ErrorCodeMapper errorCodeMapper,
                                                         ErrorMessageMapper errorMessageMapper,
                                                         ObjectMapper objectMapper) {
        return new UnauthorizedEntryPoint(httpStatusMapper, errorCodeMapper, errorMessageMapper, objectMapper);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           MvcRequestMatcher.Builder mvc,
                                           UnauthorizedEntryPoint unauthorizedEntryPoint) throws Exception {
        http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                        .sessionAuthenticationStrategy(new NullAuthenticatedSessionStrategy()))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(unauthorizedEntryPoint)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(antMatcher("/resources/**")).permitAll()
                        .requestMatchers(antMatcher("/assets/**")).permitAll()
                        .requestMatchers(mvc.pattern("/login/**")).permitAll()
                        .requestMatchers(mvc.pattern("/oauth2/**")).permitAll()
                        .requestMatchers(mvc.pattern("/v3/api-docs/**")).permitAll()
                        .requestMatchers(mvc.pattern("/swagger-ui/**")).permitAll()
                        // h2 console, dev only
                        .requestMatchers(toH2Console()).permitAll()
                        .requestMatchers(antMatcher("/graphiql")).permitAll()
                        // leave this endpoint as unauthorized until we can find a way to authorize ws clients
                        // initially, when hitting the ws init we cannot pass the Authorization header
                        .requestMatchers(antMatcher("/subscriptions")).permitAll()
                        .requestMatchers(antMatcher("/error")).permitAll()
                        .requestMatchers(antMatcher("/")).permitAll()
                        .requestMatchers(antMatcher("/favicon.ico")).permitAll()
                        .requestMatchers(antMatcher("/**/*.png")).permitAll()
                        .requestMatchers(antMatcher("/**/*.gif")).permitAll()
                        .requestMatchers(antMatcher("/**/*.svg")).permitAll()
                        .requestMatchers(antMatcher("/**/*.jpg")).permitAll()
                        .requestMatchers(antMatcher("/**/*.html")).permitAll()
                        .requestMatchers(antMatcher("/**/*.css")).permitAll()
                        .requestMatchers(antMatcher("/**/*.js")).permitAll()
                        .anyRequest()
                        .authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter)));
                // disable for production
                //.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));
        return http.build();
    }
}
