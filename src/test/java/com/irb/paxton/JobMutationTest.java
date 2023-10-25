package com.irb.paxton;

import com.irb.paxton.core.jobs.JobService;
import com.irb.paxton.core.jobs.resolver.JobMutationResolver;
import com.irb.paxton.core.organization.OrganizationRepository;
import com.netflix.graphql.dgs.DgsQueryExecutor;
import com.netflix.graphql.dgs.autoconfig.DgsAutoConfiguration;
import com.netflix.graphql.dgs.autoconfig.DgsExtendedScalarsAutoConfiguration;
import graphql.ExecutionResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = {DgsAutoConfiguration.class, JobMutationResolver.class, DgsExtendedScalarsAutoConfiguration.class})
class JobMutationTest {

    @Autowired
    private DgsQueryExecutor dgsQueryExecutor;

    @MockBean
    private JobService jobService;

    @MockBean
    private OrganizationRepository organizationRepository;

    @Test
    void testJobCreation() {
        ExecutionResult result = dgsQueryExecutor.execute("""
                mutation {\s
                  publishJob(JobInput: {
                    name: "aa",
                    description: "aa"
                  }) { name, description }\s
                }""");
        assertThat(result.getErrors()).isNotEmpty();
    }
}
