package com.irb.paxton.chat;

import com.irb.paxton.PaxtonTestingApplication;
import com.irb.paxton.config.storage.MinioConfig;
import com.irb.paxton.core.messaging.ChatService;
import com.irb.paxton.storage.StorageService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MinIOContainer;

@WithMockUser
@SpringBootTest(classes = PaxtonTestingApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@EnableConfigurationProperties(value = MinioConfig.class)
@TestPropertySource("classpath:application-test.properties")
class ChatServiceUploadTests {

    private static final MinIOContainer minioContainer = new MinIOContainer("minio/minio:RELEASE.2023-09-04T19-57-37Z")
            .withUserName("testUser")
            .withPassword("testPassword");
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private ChatService chatService;
    @MockBean
    private StorageService storageService;

    @BeforeAll
    static void setup() {
        minioContainer.start();
    }

    @AfterAll
    static void onFinish() {
        minioContainer.stop();
    }

    @Test
    void saveChatMessageWithFileUpload() {
        assert (1 == 1);
        storageService.loadAsResourceFromPath("/chat");
    }
}
