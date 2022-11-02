import { useQuery, UseQueryOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("http://localhost:8080/graphql", {
    method: "POST",
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
};

export type ActivitySector = {
  __typename?: 'ActivitySector';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Application = {
  __typename?: 'Application';
  dateOfApplication: Scalars['Date'];
  id: Scalars['ID'];
};

export enum ContractType {
  FreeProfessional = 'FREE_PROFESSIONAL',
  FullTime = 'FULL_TIME',
  Internship = 'INTERNSHIP',
  PartTime = 'PART_TIME',
  Pupil = 'PUPIL',
  Seasonal = 'SEASONAL',
  TemporaryEmployee = 'TEMPORARY_EMPLOYEE'
}

export enum Domain {
  Arts = 'ARTS',
  ComputerScience = 'COMPUTER_SCIENCE',
  Mathematics = 'MATHEMATICS',
  Psychology = 'PSYCHOLOGY'
}

export type Experience = {
  __typename?: 'Experience';
  activitySector: ActivitySector;
  contractType: ContractType;
  description: Scalars['String'];
  endDate?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  location?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  startDate: Scalars['Date'];
  title: Scalars['String'];
  userProfile: UserProfile;
};

export type Job = {
  __typename?: 'Job';
  description: Scalars['String'];
  id: Scalars['ID'];
  jobListings?: Maybe<Array<Maybe<JobListing>>>;
  name: Scalars['String'];
};

export type JobCategory = {
  __typename?: 'JobCategory';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type JobInput = {
  description: Scalars['String'];
  name: Scalars['String'];
};

export type JobListing = {
  __typename?: 'JobListing';
  applications?: Maybe<Array<Maybe<Application>>>;
  availableFrom: Scalars['Date'];
  availableTo: Scalars['Date'];
  category?: Maybe<JobCategory>;
  contractType: ContractType;
  description: Scalars['String'];
  id: Scalars['ID'];
  isActive?: Maybe<Scalars['Boolean']>;
  job: Job;
  location: Scalars['String'];
  numberOfVacancies: Scalars['Int'];
  organization: Organization;
  title: Scalars['String'];
};

export type JobListingInput = {
  availableFrom: Scalars['Date'];
  availableTo: Scalars['Date'];
  categoryId: Scalars['ID'];
  contractType: ContractType;
  description: Scalars['String'];
  jobId: Scalars['ID'];
  location: Scalars['String'];
  numberOfVacancies: Scalars['Int'];
  organizationId: Scalars['ID'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  healthCheckPost?: Maybe<Scalars['String']>;
  publishJob?: Maybe<Job>;
  publishJobListing?: Maybe<JobListing>;
};


export type MutationPublishJobArgs = {
  JobInput?: InputMaybe<JobInput>;
};


export type MutationPublishJobListingArgs = {
  JobListingInput?: InputMaybe<JobListingInput>;
};

export type Organization = {
  __typename?: 'Organization';
  id: Scalars['ID'];
  industry: Scalars['String'];
  jobs?: Maybe<Array<Maybe<JobListing>>>;
  location: Scalars['String'];
  name: Scalars['String'];
  photography?: Maybe<Scalars['String']>;
};

export type Privilege = {
  __typename?: 'Privilege';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type Process = {
  __typename?: 'Process';
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  processSteps?: Maybe<Array<Maybe<ProcessSteps>>>;
};

export type ProcessSteps = {
  __typename?: 'ProcessSteps';
  id: Scalars['ID'];
  order: Scalars['Int'];
  process: Process;
  status: Status;
  step: Step;
};

export type ProfileStudies = {
  __typename?: 'ProfileStudies';
  description?: Maybe<Scalars['String']>;
  diploma?: Maybe<Scalars['String']>;
  domain?: Maybe<Domain>;
  endDate?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  profile?: Maybe<UserProfile>;
  startDate: Scalars['Date'];
  study?: Maybe<Study>;
};

export type Query = {
  __typename?: 'Query';
  getAllActivitySectors?: Maybe<Array<Maybe<ActivitySector>>>;
  getAllJobCategories?: Maybe<Array<Maybe<JobCategory>>>;
  getAllJobListings?: Maybe<Array<Maybe<JobListing>>>;
  getAllJobs?: Maybe<Array<Maybe<Job>>>;
  getAllOrganizations?: Maybe<Array<Maybe<Organization>>>;
  getAllProcesses?: Maybe<Array<Maybe<Process>>>;
  getAllSteps?: Maybe<Array<Maybe<Step>>>;
  getAllUsers?: Maybe<Array<Maybe<User>>>;
  getStepsByProcess?: Maybe<Array<Maybe<Step>>>;
  healthCheck?: Maybe<Scalars['String']>;
};


export type QueryGetStepsByProcessArgs = {
  processId: Scalars['Int'];
};

export type Recruiter = {
  __typename?: 'Recruiter';
  id: Scalars['ID'];
  user: User;
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['ID'];
  name: Scalars['String'];
  privileges?: Maybe<Array<Maybe<Privilege>>>;
};

export enum Status {
  Draft = 'DRAFT',
  Finished = 'FINISHED',
  InProgress = 'IN_PROGRESS',
  Started = 'STARTED'
}

export type Step = {
  __typename?: 'Step';
  id: Scalars['ID'];
  processSteps?: Maybe<Array<Maybe<ProcessSteps>>>;
  title: Scalars['String'];
};

export type Study = {
  __typename?: 'Study';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  profiles?: Maybe<Array<Maybe<ProfileStudies>>>;
};

export type User = {
  __typename?: 'User';
  birthDate?: Maybe<Scalars['Date']>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  isEmailConfirmed?: Maybe<Scalars['Boolean']>;
  lastName: Scalars['String'];
  roles?: Maybe<Array<Maybe<Role>>>;
  username: Scalars['String'];
};

export type UserProfile = {
  __typename?: 'UserProfile';
  description?: Maybe<Scalars['String']>;
  experiences?: Maybe<Array<Maybe<Experience>>>;
  id: Scalars['ID'];
  photography?: Maybe<Scalars['String']>;
  profileSlugUrl: Scalars['String'];
  profileTitle: Scalars['String'];
  user: User;
};

export type GetAllJobListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllJobListingsQuery = { __typename?: 'Query', getAllJobListings?: Array<{ __typename?: 'JobListing', title: string, description: string, availableFrom: any, availableTo: any, location: string, isActive?: boolean | null, numberOfVacancies: number, contractType: ContractType, job: { __typename?: 'Job', name: string, description: string }, organization: { __typename?: 'Organization', name: string, industry: string, location: string, photography?: string | null } } | null> | null };


export const GetAllJobListingsDocument = `
    query GetAllJobListings {
  getAllJobListings {
    title
    description
    availableFrom
    availableTo
    location
    isActive
    location
    numberOfVacancies
    job {
      name
      description
    }
    contractType
    organization {
      name
      industry
      location
      photography
    }
  }
}
    `;
export const useGetAllJobListingsQuery = <
      TData = GetAllJobListingsQuery,
      TError = unknown
    >(
      variables?: GetAllJobListingsQueryVariables,
      options?: UseQueryOptions<GetAllJobListingsQuery, TError, TData>
    ) =>
    useQuery<GetAllJobListingsQuery, TError, TData>(
      variables === undefined ? ['GetAllJobListings'] : ['GetAllJobListings', variables],
      fetcher<GetAllJobListingsQuery, GetAllJobListingsQueryVariables>(GetAllJobListingsDocument, variables),
      options
    );