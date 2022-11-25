import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { RequestInit } from "graphql-request/dist/types.dom";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};

function fetcher<TData, TVariables>(
  client: GraphQLClient,
  query: string,
  variables?: TVariables,
  headers?: RequestInit["headers"]
) {
  return async (): Promise<TData> =>
    // @ts-ignore
    client.request<TData, TVariables>(query, variables, headers);
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type ActivitySector = {
  __typename?: "ActivitySector";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type Application = {
  __typename?: "Application";
  dateOfApplication: Scalars["Date"];
  id: Scalars["ID"];
};

export type Certification = {
  __typename?: "Certification";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type CertificationInput = {
  name: Scalars["String"];
};

export type City = {
  __typename?: "City";
  country: Country;
  id: Scalars["ID"];
  name: Scalars["String"];
};

export enum ContractType {
  FreeProfessional = "FREE_PROFESSIONAL",
  FullTime = "FULL_TIME",
  Internship = "INTERNSHIP",
  PartTime = "PART_TIME",
  Pupil = "PUPIL",
  Seasonal = "SEASONAL",
  TemporaryEmployee = "TEMPORARY_EMPLOYEE",
}

export type Country = {
  __typename?: "Country";
  cities?: Maybe<Array<Maybe<City>>>;
  code: Scalars["String"];
  name: Scalars["String"];
};

export type Domain = {
  __typename?: "Domain";
  id: Scalars["ID"];
  name: Scalars["String"];
  studies?: Maybe<Array<Maybe<Study>>>;
};

export type DomainInput = {
  name: Scalars["String"];
};

export type Experience = {
  __typename?: "Experience";
  activitySector: ActivitySector;
  city?: Maybe<City>;
  contractType: ContractType;
  description: Scalars["String"];
  endDate?: Maybe<Scalars["Date"]>;
  id: Scalars["ID"];
  organization?: Maybe<Organization>;
  startDate: Scalars["Date"];
  title: Scalars["String"];
  userProfile: UserProfile;
};

export type ExperienceInput = {
  activitySectorId: Scalars["ID"];
  city?: InputMaybe<Scalars["String"]>;
  contractType: ContractType;
  description: Scalars["String"];
  endDate?: InputMaybe<Scalars["Date"]>;
  id?: InputMaybe<Scalars["ID"]>;
  organizationId: Scalars["ID"];
  startDate: Scalars["Date"];
  title: Scalars["String"];
  userProfileSlugUrl: Scalars["String"];
};

export type FiltersInput = {
  field_type: Scalars["String"];
  key: Scalars["String"];
  operator: Scalars["String"];
  value: Scalars["String"];
};

export type Institution = {
  __typename?: "Institution";
  description?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  photography?: Maybe<Scalars["String"]>;
  studies?: Maybe<Array<Maybe<Study>>>;
};

export type InstitutionInput = {
  description?: InputMaybe<Scalars["String"]>;
  name: Scalars["String"];
  photography?: InputMaybe<Scalars["String"]>;
};

export type Job = {
  __typename?: "Job";
  description: Scalars["String"];
  id: Scalars["ID"];
  jobListings?: Maybe<Array<Maybe<JobListing>>>;
  name: Scalars["String"];
};

export type JobCategory = {
  __typename?: "JobCategory";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type JobInput = {
  description: Scalars["String"];
  name: Scalars["String"];
};

export type JobListing = {
  __typename?: "JobListing";
  applications?: Maybe<Array<Maybe<Application>>>;
  availableFrom: Scalars["Date"];
  availableTo: Scalars["Date"];
  category?: Maybe<JobCategory>;
  city: City;
  contractType: ContractType;
  description: Scalars["String"];
  id: Scalars["ID"];
  isActive?: Maybe<Scalars["Boolean"]>;
  job: Job;
  numberOfVacancies: Scalars["Int"];
  organization: Organization;
  title: Scalars["String"];
};

export type JobListingInput = {
  availableFrom: Scalars["Date"];
  availableTo: Scalars["Date"];
  categoryId: Scalars["ID"];
  contractType: ContractType;
  description: Scalars["String"];
  jobId: Scalars["ID"];
  location: Scalars["String"];
  numberOfVacancies: Scalars["Int"];
  organizationId: Scalars["ID"];
  title: Scalars["String"];
};

export type JobListingPage = {
  __typename?: "JobListingPage";
  list?: Maybe<Array<Maybe<JobListing>>>;
  page: Scalars["Int"];
  totalElements: Scalars["Int"];
  totalPages: Scalars["Int"];
};

export type Mutation = {
  __typename?: "Mutation";
  addCertification?: Maybe<Certification>;
  addDomain?: Maybe<Domain>;
  addInstitution?: Maybe<Institution>;
  addUserProfileExperience?: Maybe<UserProfile>;
  addUserProfileStudy?: Maybe<UserProfile>;
  healthCheckPost?: Maybe<Scalars["String"]>;
  publishJob?: Maybe<Job>;
  publishJobListing?: Maybe<JobListing>;
  updateUserProfile?: Maybe<UserProfile>;
  updateUserProfileExperience?: Maybe<UserProfile>;
  updateUserProfileStudy?: Maybe<UserProfile>;
};

export type MutationAddCertificationArgs = {
  CertificationInput: CertificationInput;
};

export type MutationAddDomainArgs = {
  DomainInput: DomainInput;
};

export type MutationAddInstitutionArgs = {
  InstitutionInput: InstitutionInput;
};

export type MutationAddUserProfileExperienceArgs = {
  ExperienceInput: ExperienceInput;
};

export type MutationAddUserProfileStudyArgs = {
  StudyInput: StudyInput;
};

export type MutationPublishJobArgs = {
  JobInput: JobInput;
};

export type MutationPublishJobListingArgs = {
  JobListingInput: JobListingInput;
};

export type MutationUpdateUserProfileArgs = {
  UserProfileInput: UserProfileInput;
};

export type MutationUpdateUserProfileExperienceArgs = {
  ExperienceInput: ExperienceInput;
};

export type MutationUpdateUserProfileStudyArgs = {
  StudyInput: StudyInput;
};

export type Organization = {
  __typename?: "Organization";
  id: Scalars["ID"];
  industry: Scalars["String"];
  jobs?: Maybe<Array<Maybe<JobListing>>>;
  location: Scalars["String"];
  name: Scalars["String"];
  photography?: Maybe<Scalars["String"]>;
};

export type Photography = {
  __typename?: "Photography";
  id: Scalars["ID"];
  name: Scalars["String"];
  path: Scalars["String"];
  userProfile?: Maybe<UserProfile>;
};

export type Privilege = {
  __typename?: "Privilege";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
};

export type Process = {
  __typename?: "Process";
  description: Scalars["String"];
  id: Scalars["ID"];
  name: Scalars["String"];
  processSteps?: Maybe<Array<Maybe<ProcessSteps>>>;
};

export type ProcessSteps = {
  __typename?: "ProcessSteps";
  id: Scalars["ID"];
  order: Scalars["Int"];
  process: Process;
  status: Status;
  step: Step;
};

export type Query = {
  __typename?: "Query";
  getAllActivitySectors?: Maybe<Array<Maybe<ActivitySector>>>;
  getAllCertifications?: Maybe<Array<Maybe<Certification>>>;
  getAllDomains?: Maybe<Array<Maybe<Domain>>>;
  getAllInstitutions?: Maybe<Array<Maybe<Institution>>>;
  getAllJobCategories?: Maybe<Array<Maybe<JobCategory>>>;
  getAllJobListings?: Maybe<JobListingPage>;
  getAllJobs?: Maybe<Array<Maybe<Job>>>;
  getAllOrganizations?: Maybe<Array<Maybe<Organization>>>;
  getAllProcesses?: Maybe<Array<Maybe<Process>>>;
  getAllSteps?: Maybe<Array<Maybe<Step>>>;
  getAllUsers?: Maybe<Array<Maybe<User>>>;
  getCountriesCities?: Maybe<Array<Maybe<Country>>>;
  getCurrentUserProfile?: Maybe<UserProfile>;
  getStepsByProcess?: Maybe<Array<Maybe<Step>>>;
  getUserProfile?: Maybe<UserProfile>;
  healthCheck?: Maybe<Scalars["String"]>;
};

export type QueryGetAllJobListingsArgs = {
  searchQuery?: InputMaybe<SearchQueryInput>;
};

export type QueryGetStepsByProcessArgs = {
  processId: Scalars["Int"];
};

export type QueryGetUserProfileArgs = {
  profileSlugUrl?: InputMaybe<Scalars["String"]>;
};

export type Recruiter = {
  __typename?: "Recruiter";
  id: Scalars["ID"];
  user: User;
};

export type Role = {
  __typename?: "Role";
  id: Scalars["ID"];
  name: Scalars["String"];
  privileges?: Maybe<Array<Maybe<Privilege>>>;
};

export type SearchQueryInput = {
  filters?: InputMaybe<Array<InputMaybe<FiltersInput>>>;
  page?: InputMaybe<Scalars["Int"]>;
  size?: InputMaybe<Scalars["Int"]>;
  sorts?: InputMaybe<Array<InputMaybe<SortsInput>>>;
};

export enum SortDirection {
  Asc = "ASC",
  Desc = "DESC",
}

export type SortsInput = {
  direction: SortDirection;
  key: Scalars["String"];
};

export enum Status {
  Draft = "DRAFT",
  Finished = "FINISHED",
  InProgress = "IN_PROGRESS",
  Started = "STARTED",
}

export type Step = {
  __typename?: "Step";
  id: Scalars["ID"];
  processSteps?: Maybe<Array<Maybe<ProcessSteps>>>;
  title: Scalars["String"];
};

export type Study = {
  __typename?: "Study";
  certification?: Maybe<Certification>;
  degree?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  domainStudy?: Maybe<Domain>;
  endDate?: Maybe<Scalars["Date"]>;
  id: Scalars["ID"];
  institution: Institution;
  startDate: Scalars["Date"];
  userProfile: UserProfile;
};

export type StudyInput = {
  certification?: InputMaybe<Scalars["ID"]>;
  degree?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  domainStudy?: InputMaybe<Scalars["ID"]>;
  endDate?: InputMaybe<Scalars["Date"]>;
  id?: InputMaybe<Scalars["ID"]>;
  institution: Scalars["ID"];
  startDate: Scalars["Date"];
  userProfileSlugUrl: Scalars["String"];
};

export type User = {
  __typename?: "User";
  birthDate?: Maybe<Scalars["Date"]>;
  email: Scalars["String"];
  firstName: Scalars["String"];
  id: Scalars["ID"];
  isEmailConfirmed?: Maybe<Scalars["Boolean"]>;
  lastName: Scalars["String"];
  roles?: Maybe<Array<Maybe<Role>>>;
  username: Scalars["String"];
};

export type UserProfile = {
  __typename?: "UserProfile";
  city?: Maybe<City>;
  coverPhotography?: Maybe<Scalars["String"]>;
  description: Scalars["String"];
  experiences?: Maybe<Array<Maybe<Experience>>>;
  id: Scalars["ID"];
  photography?: Maybe<Scalars["String"]>;
  profileSlugUrl: Scalars["String"];
  profileTitle: Scalars["String"];
  studies?: Maybe<Array<Maybe<Study>>>;
  user: User;
};

export type UserProfileInput = {
  city: Scalars["String"];
  description: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  profileSlugUrl: Scalars["String"];
  profileTitle: Scalars["String"];
};

export type UpdateUserProfileMutationVariables = Exact<{
  UserProfileInput: UserProfileInput;
}>;

export type UpdateUserProfileMutation = {
  __typename?: "Mutation";
  updateUserProfile?: {
    __typename?: "UserProfile";
    description: string;
    profileTitle: string;
    profileSlugUrl: string;
    city?: { __typename?: "City"; id: string; name: string } | null;
  } | null;
};

export type AddUserProfileExperienceMutationVariables = Exact<{
  ExperienceInput: ExperienceInput;
}>;

export type AddUserProfileExperienceMutation = {
  __typename?: "Mutation";
  addUserProfileExperience?: {
    __typename?: "UserProfile";
    id: string;
    description: string;
    profileTitle: string;
    profileSlugUrl: string;
    city?: { __typename?: "City"; id: string; name: string } | null;
    experiences?: Array<{
      __typename?: "Experience";
      id: string;
    } | null> | null;
  } | null;
};

export type UpdateUserProfileExperienceMutationVariables = Exact<{
  ExperienceInput: ExperienceInput;
}>;

export type UpdateUserProfileExperienceMutation = {
  __typename?: "Mutation";
  updateUserProfileExperience?: {
    __typename?: "UserProfile";
    id: string;
    description: string;
    profileTitle: string;
    profileSlugUrl: string;
    city?: { __typename?: "City"; id: string; name: string } | null;
    experiences?: Array<{
      __typename?: "Experience";
      id: string;
    } | null> | null;
  } | null;
};

export type AddUserProfileStudyMutationVariables = Exact<{
  StudyInput: StudyInput;
}>;

export type AddUserProfileStudyMutation = {
  __typename?: "Mutation";
  addUserProfileStudy?: {
    __typename?: "UserProfile";
    id: string;
    description: string;
    profileSlugUrl: string;
    studies?: Array<{ __typename?: "Study"; id: string } | null> | null;
  } | null;
};

export type UpdateUserProfileStudyMutationVariables = Exact<{
  StudyInput: StudyInput;
}>;

export type UpdateUserProfileStudyMutation = {
  __typename?: "Mutation";
  updateUserProfileStudy?: {
    __typename?: "UserProfile";
    id: string;
    description: string;
    profileSlugUrl: string;
    studies?: Array<{ __typename?: "Study"; id: string } | null> | null;
  } | null;
};

export type AddInstitutionMutationVariables = Exact<{
  InstitutionInput: InstitutionInput;
}>;

export type AddInstitutionMutation = {
  __typename?: "Mutation";
  addInstitution?: {
    __typename?: "Institution";
    id: string;
    name: string;
    description?: string | null;
    photography?: string | null;
  } | null;
};

export type AddDomainMutationVariables = Exact<{
  DomainInput: DomainInput;
}>;

export type AddDomainMutation = {
  __typename?: "Mutation";
  addDomain?: { __typename?: "Domain"; id: string; name: string } | null;
};

export type AddCertificationMutationVariables = Exact<{
  CertificationInput: CertificationInput;
}>;

export type AddCertificationMutation = {
  __typename?: "Mutation";
  addCertification?: {
    __typename?: "Certification";
    id: string;
    name: string;
  } | null;
};

export type GetAllJobListingsQueryVariables = Exact<{
  searchQuery?: InputMaybe<SearchQueryInput>;
}>;

export type GetAllJobListingsQuery = {
  __typename?: "Query";
  getAllJobListings?: {
    __typename?: "JobListingPage";
    page: number;
    totalPages: number;
    totalElements: number;
    list?: Array<{
      __typename?: "JobListing";
      id: string;
      title: string;
      description: string;
      availableFrom: any;
      availableTo: any;
      isActive?: boolean | null;
      numberOfVacancies: number;
      contractType: ContractType;
      city: {
        __typename?: "City";
        id: string;
        name: string;
        country: { __typename?: "Country"; code: string; name: string };
      };
      job: {
        __typename?: "Job";
        id: string;
        name: string;
        description: string;
      };
      organization: {
        __typename?: "Organization";
        id: string;
        name: string;
        industry: string;
        location: string;
        photography?: string | null;
      };
    } | null> | null;
  } | null;
};

export type GetUserProfileQueryVariables = Exact<{
  profileSlugUrl?: InputMaybe<Scalars["String"]>;
}>;

export type GetUserProfileQuery = {
  __typename?: "Query";
  getUserProfile?: {
    __typename?: "UserProfile";
    photography?: string | null;
    coverPhotography?: string | null;
    description: string;
    profileSlugUrl: string;
    profileTitle: string;
    city?: {
      __typename?: "City";
      id: string;
      name: string;
      country: { __typename?: "Country"; code: string; name: string };
    } | null;
    experiences?: Array<{
      __typename?: "Experience";
      id: string;
      title: string;
      contractType: ContractType;
      startDate: any;
      endDate?: any | null;
      description: string;
      organization?: {
        __typename?: "Organization";
        id: string;
        name: string;
        industry: string;
        photography?: string | null;
      } | null;
      city?: {
        __typename?: "City";
        id: string;
        name: string;
        country: { __typename?: "Country"; code: string; name: string };
      } | null;
      activitySector: {
        __typename?: "ActivitySector";
        id: string;
        name: string;
      };
    } | null> | null;
    studies?: Array<{
      __typename?: "Study";
      id: string;
      degree?: string | null;
      description?: string | null;
      startDate: any;
      endDate?: any | null;
      institution: {
        __typename?: "Institution";
        id: string;
        name: string;
        description?: string | null;
        photography?: string | null;
      };
      domainStudy?: { __typename?: "Domain"; id: string; name: string } | null;
      certification?: {
        __typename?: "Certification";
        id: string;
        name: string;
      } | null;
    } | null> | null;
  } | null;
};

export type GetCountriesCitiesQueryVariables = Exact<{ [key: string]: never }>;

export type GetCountriesCitiesQuery = {
  __typename?: "Query";
  getCountriesCities?: Array<{
    __typename?: "Country";
    code: string;
    name: string;
    cities?: Array<{
      __typename?: "City";
      id: string;
      name: string;
    } | null> | null;
  } | null> | null;
};

export type GetAllOrganizationsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllOrganizationsQuery = {
  __typename?: "Query";
  getAllOrganizations?: Array<{
    __typename?: "Organization";
    id: string;
    name: string;
    industry: string;
    location: string;
    photography?: string | null;
  } | null> | null;
};

export type GetAllActivitySectorsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetAllActivitySectorsQuery = {
  __typename?: "Query";
  getAllActivitySectors?: Array<{
    __typename?: "ActivitySector";
    id: string;
    name: string;
  } | null> | null;
};

export type GetAllInstitutionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllInstitutionsQuery = {
  __typename?: "Query";
  getAllInstitutions?: Array<{
    __typename?: "Institution";
    id: string;
    name: string;
    description?: string | null;
    photography?: string | null;
  } | null> | null;
};

export type GetAllDomainsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllDomainsQuery = {
  __typename?: "Query";
  getAllDomains?: Array<{
    __typename?: "Domain";
    id: string;
    name: string;
  } | null> | null;
};

export type GetAllCertificationsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetAllCertificationsQuery = {
  __typename?: "Query";
  getAllCertifications?: Array<{
    __typename?: "Certification";
    id: string;
    name: string;
  } | null> | null;
};

export const UpdateUserProfileDocument = `
    mutation UpdateUserProfile($UserProfileInput: UserProfileInput!) {
  updateUserProfile(UserProfileInput: $UserProfileInput) {
    description
    city {
      id
      name
    }
    profileTitle
    profileSlugUrl
  }
}
    `;
export const useUpdateUserProfileMutation = <
  TError = unknown,
  TContext = unknown
>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    UpdateUserProfileMutation,
    TError,
    UpdateUserProfileMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<
    UpdateUserProfileMutation,
    TError,
    UpdateUserProfileMutationVariables,
    TContext
  >(
    ["UpdateUserProfile"],
    (variables?: UpdateUserProfileMutationVariables) =>
      fetcher<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(
        client,
        UpdateUserProfileDocument,
        variables,
        headers
      )(),
    options
  );
export const AddUserProfileExperienceDocument = `
    mutation AddUserProfileExperience($ExperienceInput: ExperienceInput!) {
  addUserProfileExperience(ExperienceInput: $ExperienceInput) {
    id
    description
    city {
      id
      name
    }
    profileTitle
    profileSlugUrl
    experiences {
      id
    }
  }
}
    `;
export const useAddUserProfileExperienceMutation = <
  TError = unknown,
  TContext = unknown
>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    AddUserProfileExperienceMutation,
    TError,
    AddUserProfileExperienceMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<
    AddUserProfileExperienceMutation,
    TError,
    AddUserProfileExperienceMutationVariables,
    TContext
  >(
    ["AddUserProfileExperience"],
    (variables?: AddUserProfileExperienceMutationVariables) =>
      fetcher<
        AddUserProfileExperienceMutation,
        AddUserProfileExperienceMutationVariables
      >(client, AddUserProfileExperienceDocument, variables, headers)(),
    options
  );
export const UpdateUserProfileExperienceDocument = `
    mutation UpdateUserProfileExperience($ExperienceInput: ExperienceInput!) {
  updateUserProfileExperience(ExperienceInput: $ExperienceInput) {
    id
    description
    city {
      id
      name
    }
    profileTitle
    profileSlugUrl
    experiences {
      id
    }
  }
}
    `;
export const useUpdateUserProfileExperienceMutation = <
  TError = unknown,
  TContext = unknown
>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    UpdateUserProfileExperienceMutation,
    TError,
    UpdateUserProfileExperienceMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<
    UpdateUserProfileExperienceMutation,
    TError,
    UpdateUserProfileExperienceMutationVariables,
    TContext
  >(
    ["UpdateUserProfileExperience"],
    (variables?: UpdateUserProfileExperienceMutationVariables) =>
      fetcher<
        UpdateUserProfileExperienceMutation,
        UpdateUserProfileExperienceMutationVariables
      >(client, UpdateUserProfileExperienceDocument, variables, headers)(),
    options
  );
export const AddUserProfileStudyDocument = `
    mutation AddUserProfileStudy($StudyInput: StudyInput!) {
  addUserProfileStudy(StudyInput: $StudyInput) {
    id
    description
    profileSlugUrl
    studies {
      id
    }
  }
}
    `;
export const useAddUserProfileStudyMutation = <
  TError = unknown,
  TContext = unknown
>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    AddUserProfileStudyMutation,
    TError,
    AddUserProfileStudyMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<
    AddUserProfileStudyMutation,
    TError,
    AddUserProfileStudyMutationVariables,
    TContext
  >(
    ["AddUserProfileStudy"],
    (variables?: AddUserProfileStudyMutationVariables) =>
      fetcher<
        AddUserProfileStudyMutation,
        AddUserProfileStudyMutationVariables
      >(client, AddUserProfileStudyDocument, variables, headers)(),
    options
  );
export const UpdateUserProfileStudyDocument = `
    mutation UpdateUserProfileStudy($StudyInput: StudyInput!) {
  updateUserProfileStudy(StudyInput: $StudyInput) {
    id
    description
    profileSlugUrl
    studies {
      id
    }
  }
}
    `;
export const useUpdateUserProfileStudyMutation = <
  TError = unknown,
  TContext = unknown
>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    UpdateUserProfileStudyMutation,
    TError,
    UpdateUserProfileStudyMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<
    UpdateUserProfileStudyMutation,
    TError,
    UpdateUserProfileStudyMutationVariables,
    TContext
  >(
    ["UpdateUserProfileStudy"],
    (variables?: UpdateUserProfileStudyMutationVariables) =>
      fetcher<
        UpdateUserProfileStudyMutation,
        UpdateUserProfileStudyMutationVariables
      >(client, UpdateUserProfileStudyDocument, variables, headers)(),
    options
  );
export const AddInstitutionDocument = `
    mutation AddInstitution($InstitutionInput: InstitutionInput!) {
  addInstitution(InstitutionInput: $InstitutionInput) {
    id
    name
    description
    photography
  }
}
    `;
export const useAddInstitutionMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    AddInstitutionMutation,
    TError,
    AddInstitutionMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<
    AddInstitutionMutation,
    TError,
    AddInstitutionMutationVariables,
    TContext
  >(
    ["AddInstitution"],
    (variables?: AddInstitutionMutationVariables) =>
      fetcher<AddInstitutionMutation, AddInstitutionMutationVariables>(
        client,
        AddInstitutionDocument,
        variables,
        headers
      )(),
    options
  );
export const AddDomainDocument = `
    mutation AddDomain($DomainInput: DomainInput!) {
  addDomain(DomainInput: $DomainInput) {
    id
    name
  }
}
    `;
export const useAddDomainMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    AddDomainMutation,
    TError,
    AddDomainMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<AddDomainMutation, TError, AddDomainMutationVariables, TContext>(
    ["AddDomain"],
    (variables?: AddDomainMutationVariables) =>
      fetcher<AddDomainMutation, AddDomainMutationVariables>(
        client,
        AddDomainDocument,
        variables,
        headers
      )(),
    options
  );
export const AddCertificationDocument = `
    mutation AddCertification($CertificationInput: CertificationInput!) {
  addCertification(CertificationInput: $CertificationInput) {
    id
    name
  }
}
    `;
export const useAddCertificationMutation = <
  TError = unknown,
  TContext = unknown
>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    AddCertificationMutation,
    TError,
    AddCertificationMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<
    AddCertificationMutation,
    TError,
    AddCertificationMutationVariables,
    TContext
  >(
    ["AddCertification"],
    (variables?: AddCertificationMutationVariables) =>
      fetcher<AddCertificationMutation, AddCertificationMutationVariables>(
        client,
        AddCertificationDocument,
        variables,
        headers
      )(),
    options
  );
export const GetAllJobListingsDocument = `
    query GetAllJobListings($searchQuery: SearchQueryInput) {
  getAllJobListings(searchQuery: $searchQuery) {
    list {
      id
      title
      description
      availableFrom
      availableTo
      city {
        id
        name
        country {
          code
          name
        }
      }
      isActive
      numberOfVacancies
      job {
        id
        name
        description
      }
      contractType
      organization {
        id
        name
        industry
        location
        photography
      }
    }
    page
    totalPages
    totalElements
  }
}
    `;
export const useGetAllJobListingsQuery = <
  TData = GetAllJobListingsQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables?: GetAllJobListingsQueryVariables,
  options?: UseQueryOptions<GetAllJobListingsQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<GetAllJobListingsQuery, TError, TData>(
    variables === undefined
      ? ["GetAllJobListings"]
      : ["GetAllJobListings", variables],
    fetcher<GetAllJobListingsQuery, GetAllJobListingsQueryVariables>(
      client,
      GetAllJobListingsDocument,
      variables,
      headers
    ),
    options
  );
export const GetUserProfileDocument = `
    query GetUserProfile($profileSlugUrl: String) {
  getUserProfile(profileSlugUrl: $profileSlugUrl) {
    photography
    coverPhotography
    description
    city {
      id
      name
      country {
        code
        name
      }
    }
    profileSlugUrl
    profileTitle
    experiences {
      id
      title
      contractType
      organization {
        id
        name
        industry
        photography
      }
      city {
        id
        name
        country {
          code
          name
        }
      }
      startDate
      endDate
      activitySector {
        id
        name
      }
      description
    }
    studies {
      id
      institution {
        id
        name
        description
        photography
      }
      domainStudy {
        id
        name
      }
      degree
      certification {
        id
        name
      }
      description
      startDate
      endDate
    }
  }
}
    `;
export const useGetUserProfileQuery = <
  TData = GetUserProfileQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables?: GetUserProfileQueryVariables,
  options?: UseQueryOptions<GetUserProfileQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<GetUserProfileQuery, TError, TData>(
    variables === undefined
      ? ["GetUserProfile"]
      : ["GetUserProfile", variables],
    fetcher<GetUserProfileQuery, GetUserProfileQueryVariables>(
      client,
      GetUserProfileDocument,
      variables,
      headers
    ),
    options
  );
export const GetCountriesCitiesDocument = `
    query GetCountriesCities {
  getCountriesCities {
    code
    name
    cities {
      id
      name
    }
  }
}
    `;
export const useGetCountriesCitiesQuery = <
  TData = GetCountriesCitiesQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables?: GetCountriesCitiesQueryVariables,
  options?: UseQueryOptions<GetCountriesCitiesQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<GetCountriesCitiesQuery, TError, TData>(
    variables === undefined
      ? ["GetCountriesCities"]
      : ["GetCountriesCities", variables],
    fetcher<GetCountriesCitiesQuery, GetCountriesCitiesQueryVariables>(
      client,
      GetCountriesCitiesDocument,
      variables,
      headers
    ),
    options
  );
export const GetAllOrganizationsDocument = `
    query getAllOrganizations {
  getAllOrganizations {
    id
    name
    industry
    location
    photography
  }
}
    `;
export const useGetAllOrganizationsQuery = <
  TData = GetAllOrganizationsQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables?: GetAllOrganizationsQueryVariables,
  options?: UseQueryOptions<GetAllOrganizationsQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<GetAllOrganizationsQuery, TError, TData>(
    variables === undefined
      ? ["getAllOrganizations"]
      : ["getAllOrganizations", variables],
    fetcher<GetAllOrganizationsQuery, GetAllOrganizationsQueryVariables>(
      client,
      GetAllOrganizationsDocument,
      variables,
      headers
    ),
    options
  );
export const GetAllActivitySectorsDocument = `
    query getAllActivitySectors {
  getAllActivitySectors {
    id
    name
  }
}
    `;
export const useGetAllActivitySectorsQuery = <
  TData = GetAllActivitySectorsQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables?: GetAllActivitySectorsQueryVariables,
  options?: UseQueryOptions<GetAllActivitySectorsQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<GetAllActivitySectorsQuery, TError, TData>(
    variables === undefined
      ? ["getAllActivitySectors"]
      : ["getAllActivitySectors", variables],
    fetcher<GetAllActivitySectorsQuery, GetAllActivitySectorsQueryVariables>(
      client,
      GetAllActivitySectorsDocument,
      variables,
      headers
    ),
    options
  );
export const GetAllInstitutionsDocument = `
    query getAllInstitutions {
  getAllInstitutions {
    id
    name
    description
    photography
  }
}
    `;
export const useGetAllInstitutionsQuery = <
  TData = GetAllInstitutionsQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables?: GetAllInstitutionsQueryVariables,
  options?: UseQueryOptions<GetAllInstitutionsQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<GetAllInstitutionsQuery, TError, TData>(
    variables === undefined
      ? ["getAllInstitutions"]
      : ["getAllInstitutions", variables],
    fetcher<GetAllInstitutionsQuery, GetAllInstitutionsQueryVariables>(
      client,
      GetAllInstitutionsDocument,
      variables,
      headers
    ),
    options
  );
export const GetAllDomainsDocument = `
    query getAllDomains {
  getAllDomains {
    id
    name
  }
}
    `;
export const useGetAllDomainsQuery = <
  TData = GetAllDomainsQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables?: GetAllDomainsQueryVariables,
  options?: UseQueryOptions<GetAllDomainsQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<GetAllDomainsQuery, TError, TData>(
    variables === undefined ? ["getAllDomains"] : ["getAllDomains", variables],
    fetcher<GetAllDomainsQuery, GetAllDomainsQueryVariables>(
      client,
      GetAllDomainsDocument,
      variables,
      headers
    ),
    options
  );
export const GetAllCertificationsDocument = `
    query getAllCertifications {
  getAllCertifications {
    id
    name
  }
}
    `;
export const useGetAllCertificationsQuery = <
  TData = GetAllCertificationsQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables?: GetAllCertificationsQueryVariables,
  options?: UseQueryOptions<GetAllCertificationsQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<GetAllCertificationsQuery, TError, TData>(
    variables === undefined
      ? ["getAllCertifications"]
      : ["getAllCertifications", variables],
    fetcher<GetAllCertificationsQuery, GetAllCertificationsQueryVariables>(
      client,
      GetAllCertificationsDocument,
      variables,
      headers
    ),
    options
  );
