package com.irb.paxton.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.irb.paxton.config.properties.ApplicationProperties;
import com.irb.paxton.config.properties.CorsProperties;
import com.irb.paxton.config.properties.FrontendProperties;
import com.irb.paxton.security.auth.PaxtonUserDetailsService;
import com.irb.paxton.security.auth.jwt.JwtAuthenticationFilter;
import com.irb.paxton.security.auth.role.PaxtonRole;
import com.irb.paxton.security.oauth2.OAuth2AuthenticationFailureHandler;
import com.irb.paxton.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.irb.paxton.security.oauth2.PaxtonOAuth2Service;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.UnauthorizedEntryPoint;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.mapper.ErrorCodeMapper;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.mapper.ErrorMessageMapper;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.mapper.HttpStatusMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;
import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.toH2Console;
import static org.springframework.security.config.Customizer.withDefaults;
import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
@EnableWebSecurity
@EnableTransactionManagement(order = 0)
@Order(value = 1)
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
public class SecurityConfiguration {

    @Autowired
    private PaxtonUserDetailsService paxtonUserDetailsService;

    @Autowired
    private FrontendProperties frontendProperties;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private CorsProperties corsProperties;

    @Autowired
    private OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

    @Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Autowired
    private PaxtonOAuth2Service paxtonOAuth2Service;

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RoleHierarchyImpl roleHierarchy() {
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        String hierarchy = "%s > %s > %s".formatted(PaxtonRole.ROLE_ADMINISTRATOR.name(), PaxtonRole.ROLE_RECRUITER.name(), PaxtonRole.ROLE_EVERYONE.name());
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
    public SecurityFilterChain filterChain(HttpSecurity http, MvcRequestMatcher.Builder mvc, UnauthorizedEntryPoint unauthorizedEntryPoint) throws Exception {
        http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                        .sessionAuthenticationStrategy(new NullAuthenticatedSessionStrategy()))
                .httpBasic(Customizer.withDefaults())
                .authenticationProvider(authProvider())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(unauthorizedEntryPoint)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(antMatcher("/resources/**")).permitAll()
                        .requestMatchers(antMatcher("/assets/**")).permitAll()
                        .requestMatchers(mvc.pattern("/api/v*/auth/**")).permitAll()
                        .requestMatchers(mvc.pattern("/api/v*/images/**")).permitAll()
                        .requestMatchers(mvc.pattern("/login/**")).permitAll()
                        // front-end paths
                        .requestMatchers(mvc.pattern("/app/**")).permitAll()
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
                .oauth2Login(oauth2 ->
                        oauth2.authorizationEndpoint(auth ->
                                        auth.baseUri("/api/%s/auth/login/oauth2/".formatted(API_VERSION))
                                )
                                .redirectionEndpoint(auth ->
                                        auth.baseUri("/api/%s/auth/login/oauth2/callback/*".formatted(API_VERSION)))
                                .userInfoEndpoint(userInfoEndpointConfig ->
                                        userInfoEndpointConfig.userService(paxtonOAuth2Service))
                                .failureHandler(oAuth2AuthenticationFailureHandler)
                                .successHandler(oAuth2AuthenticationSuccessHandler)
                )
                // disable for production
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
                .addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> allowedOrigins = Stream.concat(
                Stream.of("http://localhost:%s".formatted(applicationProperties.getServerPort()),
                        "https://localhost:%s".formatted(applicationProperties.getServerPort()),
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
