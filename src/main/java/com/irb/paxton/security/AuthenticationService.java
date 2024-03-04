package com.irb.paxton.security;

import com.irb.paxton.security.auth.forgot.request.FindEmailDto;
import com.irb.paxton.security.auth.forgot.request.PasswordChangeDto;
import com.irb.paxton.security.auth.login.response.LoginResponse;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.dto.UserLoginDto;
import com.irb.paxton.security.auth.user.dto.UserSignupDto;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthenticationService {

    User registerUser(UserSignupDto userSignupDto);

    void confirmUserRegistrationByEmailToken(String token);

    void sendEmailForgotPasswordRequest(FindEmailDto findEmailDto);

    void changePasswordByEmailRequest(String token, PasswordChangeDto passwordChangeDto);

    LoginResponse loginByUsernameAndPassword(UserLoginDto userLoginDto);

    UserDetails authenticateUser(UserLoginDto userLoginDto);

    LoginResponse loginByOAuth2Code(String token);

    LoginResponse refreshUserAuthenticationByToken(String refreshToken);

    void logOutUserByToken(String token);

    Authentication identifyUserInToken(String token);

    User getCurrentUserFromSecurityContext() throws AuthenticationException, UserNotFoundException;
}
