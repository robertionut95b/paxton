package com.irb.paxton;

import com.irb.paxton.core.jobs.resolver.JobMutationResolver;
import com.irb.paxton.core.jobs.resolver.JobQueryResolver;
import com.netflix.graphql.dgs.autoconfig.DgsAutoConfiguration;
import com.netflix.graphql.dgs.autoconfig.DgsExtendedScalarsAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = {DgsAutoConfiguration.class, JobQueryResolver.class,
        JobMutationResolver.class, DgsExtendedScalarsAutoConfiguration.class})
class JobMutationTest {

//    @Autowired
//    private DgsQueryExecutor dgsQueryExecutor;
//
//    @MockBean
//    private JobService jobService;
//
//    @MockBean
//    private OrganizationRepository organizationRepository;
//
//    @BeforeEach
//    void setupData() {
//        Mockito.when(jobService.findAllJobs()).thenAnswer(jobs -> List.of(new Job("Software Developer", "Lorem ipsum dolor impetus indoor.", null)));
//    }
//
//    @Test
//    void testGqlJobQueryingById() {
////        ExecutionResult result = dgsQueryExecutor.execute("""
////                {
////                  getAllJobs {
////                    name
////                    description
////                  }
////                }
////                """);
////        List<Job> jobs = result.getData();
////        assertThat(jobs).isNotEmpty();
//    }
//
//    @Test
//    void testGqlJobCreation() {
//        // expect mutation to fail with validation error
////        ExecutionResult result = dgsQueryExecutor.execute("""
////                mutation {\s
////                  publishJob(JobInput: {
////                    name: "aa",
////                    description: "aa"
////                  }) { name, description }\s
////                }""");
////        assertThat(result.getErrors()).isNotEmpty();
//    }
}
