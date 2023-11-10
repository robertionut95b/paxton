package com.irb.paxton.security.oauth2;

import com.irb.paxton.core.media.Photography;
import com.irb.paxton.core.media.PhotographyService;
import com.irb.paxton.exceptions.handler.common.OAuth2AuthenticationProcessingException;
import com.irb.paxton.security.auth.role.RoleService;
import com.irb.paxton.security.auth.user.PaxtonUserDetails;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import com.irb.paxton.security.oauth2.user.OAuth2UserInfo;
import com.irb.paxton.security.oauth2.user.OAuth2UserInfoFactory;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Optional;

@Service
public class PaxtonOAuth2Service extends DefaultOAuth2UserService {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PhotographyService photographyService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (OAuth2AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) throws OAuth2AuthenticationProcessingException {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());

        if (StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userService
                .findByEmailAndAuthProviders(oAuth2UserInfo.getEmail(), AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
//            if (!user.getProvider().equals(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))) {
//                throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
//                        user.getProvider() + " account. Please use your " + user.getProvider() +
//                        " account to login.");
//            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        return new PaxtonUserDetails(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        User user = new User();

        user.addProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
        user.setFirstName(oAuth2UserInfo.getFirstName());
        user.setLastName(oAuth2UserInfo.getLastName());
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setUsername(oAuth2UserInfo.getUsername());
        user.setEmailConfirmed(true);
        user = userService.registerNewUser(user);

        return user;
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setFirstName(oAuth2UserInfo.getFirstName());
        existingUser.setLastName(oAuth2UserInfo.getLastName());
        String base64ImageUrl = Base64.getEncoder().encodeToString(oAuth2UserInfo.getImageUrl().getBytes());
        Optional<Photography> profileAvatarOpt = photographyService.findByNameReturnOptional(base64ImageUrl);
        if (profileAvatarOpt.isEmpty()) {
            photographyService.createPhotography(new Photography(base64ImageUrl, oAuth2UserInfo.getImageUrl(), existingUser.getUserProfile()));
        }
        existingUser.getUserProfile().setPhotography(Base64.getEncoder().encodeToString(oAuth2UserInfo.getImageUrl().getBytes()));

        return userService.updateUser(existingUser);
    }
}
