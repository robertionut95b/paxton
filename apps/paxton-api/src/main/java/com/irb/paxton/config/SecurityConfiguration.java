package com.irb.paxton.config;

import com.irb.paxton.security.auth.BasicUserDetailsService;
import com.irb.paxton.security.auth.jwt.JwtCookieAuthenticationFilter;
import com.irb.paxton.security.auth.jwt.PaxtonJwtAuthenticationConverter;
import com.irb.paxton.security.auth.role.PaxtonRole;
import com.irb.paxton.security.cors.CorsFilter;
import com.irb.paxton.security.response.PxAccessDeniedHandler;
import com.irb.paxton.security.response.PxAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.session.SessionManagementFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
public class SecurityConfiguration {

    @Autowired
    BasicUserDetailsService paxtonUserDetailsService;

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
    public JwtCookieAuthenticationFilter tokenAuthenticationFilter() {
        return new JwtCookieAuthenticationFilter();
    }

    @Bean
    CorsFilter corsFilter() {
        return new CorsFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf((csrf) -> csrf.ignoringAntMatchers(new String[]{"/h2-console/**"}))
                .csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .sessionAuthenticationStrategy(new NullAuthenticatedSessionStrategy())
                .and()
                .httpBasic(Customizer.withDefaults())
                .authenticationProvider(authProvider())
                .exceptionHandling((exceptions) -> exceptions
                        .authenticationEntryPoint(new PxAuthenticationEntryPoint())
                        .accessDeniedHandler(new PxAccessDeniedHandler()))
                .authorizeRequests()
                .antMatchers("/resources/**").permitAll()
                .antMatchers("/auth/**").permitAll()
                .antMatchers("/h2-console/**").permitAll()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .anyRequest().authenticated()
                .and()
                .oauth2ResourceServer()
                .jwt()
                .jwtAuthenticationConverter(new PaxtonJwtAuthenticationConverter().jwtAuthenticationConverter());
        // disable for production
        http.headers().frameOptions().disable();
        http.addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(corsFilter(), SessionManagementFilter.class);
        return http.build();
    }
}
