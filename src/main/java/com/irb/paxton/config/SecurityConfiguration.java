package com.irb.paxton.config;

import com.irb.paxton.config.properties.ApplicationProperties;
import com.irb.paxton.config.properties.CorsProperties;
import com.irb.paxton.config.properties.FrontendProperties;
import com.irb.paxton.security.auth.PaxtonUserDetailsService;
import com.irb.paxton.security.auth.jwt.JwtAuthenticationFilter;
import com.irb.paxton.security.auth.role.PaxtonRole;
import com.irb.paxton.security.response.PxAccessDeniedHandler;
import com.irb.paxton.security.response.PxAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableTransactionManagement(order = 0)
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true, jsr250Enabled = true, order = 1)
public class SecurityConfiguration {

    @Autowired
    PaxtonUserDetailsService paxtonUserDetailsService;

    @Autowired
    FrontendProperties frontendProperties;

    @Autowired
    ApplicationProperties applicationProperties;

    @Autowired
    CorsProperties corsProperties;

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RoleHierarchyImpl roleHierarchy() {
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        String hierarchy = String.format("%s > %s > %s", PaxtonRole.ROLE_ADMINISTRATOR.toString(), PaxtonRole.ROLE_READ_ONLY.toString(), PaxtonRole.ROLE_EVERYONE.toString());
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
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(paxtonUserDetailsService);
        authProvider.setPasswordEncoder(bCryptPasswordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public JwtAuthenticationFilter tokenAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .sessionAuthenticationStrategy(new NullAuthenticatedSessionStrategy())
                .and()
                .httpBasic(withDefaults())
                .authenticationProvider(authProvider())
                .exceptionHandling((exceptions) -> exceptions
                        .authenticationEntryPoint(new PxAuthenticationEntryPoint())
                        .accessDeniedHandler(new PxAccessDeniedHandler()))
                .authorizeRequests()
                .antMatchers("/resources/**").permitAll()
                .antMatchers("/assets/**").permitAll()
                .antMatchers("/api/v*/auth/**").permitAll()
                // front-end paths
                .antMatchers("/app/**").permitAll()
                .antMatchers("/",
                        "/favicon.ico",
                        "/**/*.png",
                        "/**/*.gif",
                        "/**/*.svg",
                        "/**/*.jpg",
                        "/**/*.html",
                        "/**/*.css",
                        "/**/*.js")
                .permitAll()
                // h2 console, dev only
                .antMatchers("/h2-console/**").permitAll()
                .and()
                .authorizeRequests()
                .anyRequest().authenticated()
                .and()
                .formLogin().disable();
        // disable for production
        http.headers().frameOptions().disable();
        http.addFilterBefore(tokenAuthenticationFilter(), BasicAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> allowedOrigins = Stream.concat(
                Stream.of("http://localhost:" + applicationProperties.getServerPort(),
                        "https://localhost:" + applicationProperties.getServerPort(),
                        frontendProperties.getFrontendUrl())
                , corsProperties.getAllowedOrigins().stream()).toList();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
