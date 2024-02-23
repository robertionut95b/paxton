package com.irb.paxton;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.irb.paxton.config.SecurityConfiguration;
import com.irb.paxton.config.WebMvcConfig;
import com.irb.paxton.security.AuthenticationService;
import com.irb.paxton.security.auth.signup.SignupController;
import com.irb.paxton.security.auth.user.dto.UserSignupDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = SignupController.class, excludeAutoConfiguration = {WebMvcConfig.class, SecurityConfiguration.class})
@ContextConfiguration(classes = PaxtonTestingApplication.class)
@AutoConfigureMockMvc(addFilters = false)
class UserServiceTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationService authenticationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testUserCreation400BadRequestAndErrorResultCode() throws Exception {
        UserSignupDto userSignupDto = new UserSignupDto();
        mockMvc.perform(
                        MockMvcRequestBuilders.post("/api/v1/auth/signup")
                                .with(csrf())
                                .content(objectMapper.writeValueAsBytes(userSignupDto))
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                ).andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("VALIDATION_FAILED"))
                .andReturn();
    }
}
