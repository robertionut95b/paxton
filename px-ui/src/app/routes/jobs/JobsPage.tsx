import { Routes } from "@app/routes";
import PageFooter from "@components/ui/footer/PageFooter";
import { useAuth } from "@features/auth/hooks/useAuth";
import { useGetJobListings } from "@features/jobs/api/getJobListings";
import { useGetUserProfile } from "@features/jobs/api/getUserProfile";
import JobListingsList from "@features/jobs/components/JobListingsList";
import JobsPageAsideMenu from "@features/jobs/components/JobsPageAsideMenu";
import {
  Box,
  Button,
  Center,
  Divider,
  Grid,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useEffect } from "react";
import { Else, If, Then } from "react-if";
import { NavLink, useSearchParams } from "react-router-dom";

export const jobsPageLoader = () => {};

export default function JobsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const refPage = searchParams.get("ref");

  const { data: userProfile } = useGetUserProfile(user!.profileSlugUrl);

  const cityId =
    searchParams.get("city") ??
    (!refPage && userProfile?.getUserProfile?.city?.id);

  const { data } = useGetJobListings(cityId as string);

  useEffect(() => {
    if (refPage) return;
    if (userProfile?.getUserProfile?.city?.id) {
      const currentSearchParams = searchParams;
      currentSearchParams.set(
        "city",
        userProfile.getUserProfile.city.id.toString(),
      );
      setSearchParams(currentSearchParams);
    }
  }, [
    userProfile?.getUserProfile?.city?.id,
    searchParams,
    refPage,
    setSearchParams,
  ]);

  const jobs = data?.getAllJobListings?.list ?? [];

  return (
    <Grid className="px-jobs-page">
      <Grid.Col sm={3} span={12}>
        <JobsPageAsideMenu />
      </Grid.Col>
      <Grid.Col sm={6} span={12}>
        <Paper shadow="sm" p="md" className="px-jobs grid gap-8">
          <If condition={jobs.length > 0}>
            <Then>
              <Title mb={"xs"} order={4}>
                <If condition={!!userProfile?.getUserProfile?.city}>
                  <Then>
                    Jobs of interest in:{" "}
                    {`${userProfile?.getUserProfile?.city?.country.name}, ${userProfile?.getUserProfile?.city?.name}`}
                  </Then>
                  <Else>Recommended jobs</Else>
                </If>
              </Title>
              <JobListingsList jobs={jobs} />
              <Divider my="xs" />
              <Center>
                <Button
                  variant="light"
                  component={NavLink}
                  to={
                    cityId
                      ? Routes.Jobs.Search.buildSearch({
                          city: cityId.toString(),
                        })
                      : Routes.Jobs.Search.path
                  }
                >
                  See more jobs
                </Button>
              </Center>
            </Then>
            <Else>
              <Box>
                <Title mb={8} order={4}>
                  No suitable jobs found
                </Title>
                <Text size="sm" align="center">
                  Consider updating your profile to find better job matches or
                  refine the search for more results
                </Text>
              </Box>
            </Else>
          </If>
        </Paper>
      </Grid.Col>
      <Grid.Col sm={3} span={12}>
        <PageFooter />
      </Grid.Col>
    </Grid>
  );
}
