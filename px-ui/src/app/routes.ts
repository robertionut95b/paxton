import {
  hashValues,
  number,
  route,
  string,
} from "react-router-typesafe-routes/dom";

export const Routes = {
  CurrentPage: route("#"),
  Home: route(""),
  Login: route("login"),
  SignUp: route("signup"),
  ForgotPass: route("forgot-password"),
  ForgotPassRequest: route("forgot-password/request"),
  ForgotPassReset: route("forgot-password/reset"),
  SignupConfirmation: route("signup/confirmation"),
  Feed: route("feed", { hash: hashValues() }),
  Jobs: route(
    "jobs",
    {
      hash: hashValues(),
    },
    {
      View: route(
        "view",
        {},
        {
          Details: route(
            ":jobId",
            {
              params: { jobId: number().defined() },
            },
            {
              RecruitmentApplicationDetails: route(
                "applications/:applicationId",
                {
                  params: {
                    applicationId: number().defined(),
                  },
                },
              ),
            },
          ),
        },
      ),
      Search: route("search", {
        searchParams: {
          q: string(),
          city: string(),
          currentJobId: number().defined(),
          jobId: string(),
          ct: string(),
          wt: string(),
          org: string(),
          ref: string(),
        },
      }),
      SavedJobs: route("saved-jobs"),
    },
  ),
  UserProfile: route(
    "user-profile/:profileSlug",
    {
      params: { profileSlug: string().defined() },
    },
    {
      UpdateBanner: route("update/banner"),
      UpdateAvatar: route("update/avatar"),
      UpdateIntro: route("update/intro"),
      ExperiencesNew: route("experiences/new"),
      StudiesNew: route("studies/new"),
    },
  ),
  Organizations: route(
    "organizations",
    {},
    {
      Details: route(
        ":organizationSlug",
        {
          params: { organizationSlug: string().defined() },
        },
        {
          Jobs: route(
            "jobs",
            {},
            {
              Publish: route("publish-listing"),
              Update: route(":jobListingId/update", {
                params: { jobListingId: string().defined() },
              }),
            },
          ),
          Recruitment: route(
            "recruitment",
            {},
            {
              Jobs: route(
                "jobs",
                {},
                {
                  Job: route(
                    ":jobId",
                    {
                      params: { jobId: string().defined() },
                    },
                    {
                      Applications: route(
                        "applications",
                        {},
                        {
                          Details: route(":applicationId", {
                            params: { applicationId: string().defined() },
                          }),
                        },
                      ),
                    },
                  ),
                },
              ),
            },
          ),
          About: route("about"),
          Settings: route(
            "settings",
            {},
            {
              Process: route("process"),
              Recruiters: route(
                "recruiters",
                {},
                {
                  Details: route(
                    ":recruiterId",
                    {
                      params: { recruiterId: string().defined() },
                    },
                    {
                      Jobs: route("jobs"),
                    },
                  ),
                },
              ),
            },
          ),
          Update: route("update"),
          People: route("people"),
        },
      ),
    },
  ),
  MyOrganization: route("my-organization"),
  Notifications: route("notifications"),
  ChatInbox: route(
    "chats/inbox",
    {},
    {
      NewChat: route("new", { searchParams: { chatUser: number().defined() } }),
      Chat: route(
        "chat",
        {},
        {
          Details: route(
            ":chatId",
            { params: { chatId: string().defined() } },
            {
              Message: route(
                "message",
                {},
                {
                  Details: route(":messageId", {
                    params: { messageId: string().defined() },
                  }),
                },
              ),
            },
          ),
        },
      ),
    },
  ),
  People: route(
    "people",
    {},
    {
      Search: route("search", {
        searchParams: {
          q: string(),
          cn: string(),
        },
      }),
    },
  ),
  Notices: route("notices"),
  More: route("more"),
  Admin: route(
    "admin",
    {},
    {
      Jobs: route(
        "jobs",
        {},
        {
          New: route("new"),
          Update: route(":jobId/update", {
            params: { jobId: string().defined() },
          }),
        },
      ),
      JobListings: route("job-listings"),
      Organizations: route(
        "organizations",
        {},
        {
          Details: route(
            ":organizationId",
            {
              params: { organizationId: string().defined() },
            },
            {
              Update: route("update"),
              Publish: route("publish"),
              Recruiters: route("recruiters"),
            },
          ),
          New: route("new"),
        },
      ),
    },
  ),
  AboutUs: route("about-us"),
  Support: route("support"),
  Search: route("search"),
  TermsAndServices: route("terms-and-services"),
  Publicity: route("publicity"),
  Network: route(
    "network",
    {},
    {
      MyContacts: route("my-contacts"),
    },
  ),
  All: route("*"),
};
