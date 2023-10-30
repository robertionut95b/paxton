package com.irb.paxton;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.irb.paxton.config.SecurityConfiguration;
import com.irb.paxton.config.WebMvcConfig;
import com.irb.paxton.security.AuthenticationService;
import com.irb.paxton.security.auth.signup.SignupController;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = SignupController.class, excludeAutoConfiguration = {WebMvcConfig.class, SecurityConfiguration.class})
@AutoConfigureMockMvc(addFilters = false)
public class ErrorHandlingResponseTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationService authenticationService;

    @Autowired
    private ObjectMapper objectMapper;


    @Test
    void testController500InternalErrorAndErrorResultCode() throws Exception {
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/exception")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isInternalServerError())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("RUNTIME"))
                .andReturn();
    }

    @Test
    void testController404NotFoundAndErrorResultCode() throws Exception {
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/exception/404")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isNotFound())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("USER_NOT_FOUND"))
                .andReturn();
    }

    @Test
    void testController500SqlInternalErrorAndErrorResultCode() throws Exception {
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/exception/sql")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isInternalServerError())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("SQL"))
                .andReturn();
    }

    @Configuration
    @EnableAutoConfiguration
    static class TestConfig {
        @RestController
        public static class TestController {

            @GetMapping("/exception")
            public void getException() {
                throw new RuntimeException();
            }

            @GetMapping("/exception/404")
            public void getNotFoundException() {
                throw new UserNotFoundException("User not found");
            }

            @GetMapping("/exception/sql")
            public void getSqlException() throws SQLException {
                throw new SQLException("Unknown SQL exception occurred");
            }
        }
    }
}