import { z } from 'zod'
import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useMutation, useQuery, useInfiniteQuery, UseMutationOptions, UseQueryOptions, UseInfiniteQueryOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables extends { [key: string]: any }>(client: GraphQLClient, query: string, variables?: TVariables, requestHeaders?: RequestInit['headers']) {
  return async (): Promise<TData> => client.request({
    document: query,
    variables,
    requestHeaders
  });
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
  DateTime: Date;
  Long: number;
  Url: String;
};

export type ActivitySector = {
  __typename?: 'ActivitySector';
  id: Scalars['Long'];
  name: Scalars['String'];
};

export type Application = {
  __typename?: 'Application';
  applicantProfile: UserProfile;
  applicationDocuments?: Maybe<Array<Maybe<ApplicationDocument>>>;
  candidate: Candidate;
  chat: Chat;
  currentStep: ProcessSteps;
  dateOfApplication: Scalars['DateTime'];
  id: Scalars['Long'];
  jobListing: JobListing;
  processSteps?: Maybe<Array<Maybe<ApplicationProcessSteps>>>;
  status: ApplicationStatus;
};

export type ApplicationDocument = {
  __typename?: 'ApplicationDocument';
  document: Document;
  id: Scalars['Long'];
};

export type ApplicationInput = {
  applicantProfileId: Scalars['Long'];
  dateOfApplication?: InputMaybe<Scalars['DateTime']>;
  id?: InputMaybe<Scalars['Long']>;
  jobListingId: Scalars['Long'];
  processSteps?: InputMaybe<Array<InputMaybe<ApplicationProcessStepsInput>>>;
  status?: InputMaybe<ApplicationStatus>;
  userId: Scalars['Long'];
};

export type ApplicationPage = {
  __typename?: 'ApplicationPage';
  list?: Maybe<Array<Maybe<Application>>>;
  page: Scalars['Int'];
  totalElements: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type ApplicationProcessSteps = {
  __typename?: 'ApplicationProcessSteps';
  application: Application;
  id: Scalars['Long'];
  processStep: ProcessSteps;
  registeredAt: Scalars['DateTime'];
};

export type ApplicationProcessStepsInput = {
  applicationId: Scalars['Long'];
  id?: InputMaybe<Scalars['Long']>;
  processStepId: Scalars['Long'];
  registeredAt?: InputMaybe<Scalars['DateTime']>;
};

export enum ApplicationStatus {
  Canceled = 'CANCELED',
  Finished = 'FINISHED',
  InProgress = 'IN_PROGRESS'
}

export type ApplicationsCountByStep = {
  __typename?: 'ApplicationsCountByStep';
  applicationsCount: Scalars['Int'];
  stepTitle: Scalars['String'];
};

export type Candidate = {
  __typename?: 'Candidate';
  applications?: Maybe<Array<Maybe<Application>>>;
  id: Scalars['Long'];
  user: User;
};

export type CandidatePage = {
  __typename?: 'CandidatePage';
  list?: Maybe<Array<Maybe<Candidate>>>;
  page: Scalars['Int'];
  totalElements: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type Certification = {
  __typename?: 'Certification';
  id: Scalars['Long'];
  name: Scalars['String'];
};

export type CertificationInput = {
  name: Scalars['String'];
};

export type Chat = {
  __typename?: 'Chat';
  chatType?: Maybe<ChatType>;
  id: Scalars['Long'];
  latestMessage?: Maybe<Message>;
  messages?: Maybe<Array<Maybe<Message>>>;
  title?: Maybe<Scalars['String']>;
  unreadMessagesCount: Scalars['Int'];
  users?: Maybe<Array<Maybe<User>>>;
};

export type ChatInput = {
  chatType?: InputMaybe<ChatType>;
  id?: InputMaybe<Scalars['Long']>;
  messages?: InputMaybe<Array<InputMaybe<MessageInput>>>;
  users: Array<InputMaybe<Scalars['Long']>>;
};

export type ChatPage = {
  __typename?: 'ChatPage';
  list?: Maybe<Array<Maybe<Chat>>>;
  page: Scalars['Int'];
  totalElements: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export enum ChatType {
  ApplicationChat = 'APPLICATION_CHAT',
  GroupPrivateChat = 'GROUP_PRIVATE_CHAT',
  PrivateChat = 'PRIVATE_CHAT'
}

export type City = {
  __typename?: 'City';
  country: Country;
  id: Scalars['Long'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
};

export type Connection = {
  __typename?: 'Connection';
  addressed: User;
  connectionStatus: ConnectionStatus;
  id: Scalars['Long'];
  lastModified: Scalars['DateTime'];
  requester: User;
};

export type ConnectionCreateInput = {
  addressedId: Scalars['Long'];
  connectionStatus: ConnectionStatus;
  id?: InputMaybe<Scalars['Long']>;
  requesterId: Scalars['Long'];
};

export type ConnectionPage = {
  __typename?: 'ConnectionPage';
  list?: Maybe<Array<Maybe<Connection>>>;
  page: Scalars['Int'];
  totalElements: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export enum ConnectionStatus {
  Accepted = 'ACCEPTED',
  Blocked = 'BLOCKED',
  Declined = 'DECLINED',
  Requested = 'REQUESTED'
}

export type ConnectionUpdateInput = {
  addressedId: Scalars['Long'];
  connectionStatus: ConnectionStatus;
  id: Scalars['Long'];
  requesterId: Scalars['Long'];
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

export type Country = {
  __typename?: 'Country';
  cities?: Maybe<Array<Maybe<City>>>;
  code: Scalars['String'];
  name: Scalars['String'];
};

export type Document = {
  __typename?: 'Document';
  name: Scalars['String'];
};

export type Domain = {
  __typename?: 'Domain';
  id: Scalars['Long'];
  name: Scalars['String'];
  studies?: Maybe<Array<Maybe<Study>>>;
};

export type DomainInput = {
  name: Scalars['String'];
};

export type Experience = {
  __typename?: 'Experience';
  activitySector: ActivitySector;
  city?: Maybe<City>;
  contractType: ContractType;
  description: Scalars['String'];
  endDate?: Maybe<Scalars['Date']>;
  id: Scalars['Long'];
  organization?: Maybe<Organization>;
  startDate: Scalars['Date'];
  title: Scalars['String'];
  userProfile: UserProfile;
};

export type ExperienceInput = {
  activitySectorId: Scalars['Long'];
  city?: InputMaybe<Scalars['String']>;
  contractType: ContractType;
  description: Scalars['String'];
  endDate?: InputMaybe<Scalars['Date']>;
  id?: InputMaybe<Scalars['Long']>;
  organizationId: Scalars['Long'];
  startDate: Scalars['Date'];
  title: Scalars['String'];
  userProfileSlugUrl: Scalars['String'];
};

export enum FieldType {
  Boolean = 'BOOLEAN',
  Char = 'CHAR',
  Date = 'DATE',
  Datetime = 'DATETIME',
  Double = 'DOUBLE',
  Enum = 'ENUM',
  Integer = 'INTEGER',
  Long = 'LONG',
  String = 'STRING'
}

export type FiltersInput = {
  fieldType: FieldType;
  key: Scalars['String'];
  operator: Operator;
  value?: InputMaybe<Scalars['String']>;
  valueTo?: InputMaybe<Scalars['String']>;
  values?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Institution = {
  __typename?: 'Institution';
  description?: Maybe<Scalars['String']>;
  id: Scalars['Long'];
  name: Scalars['String'];
  photography?: Maybe<Scalars['String']>;
  studies?: Maybe<Array<Maybe<Study>>>;
};

export type InstitutionInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  photography?: InputMaybe<Scalars['String']>;
};

export type Job = {
  __typename?: 'Job';
  description: Scalars['String'];
  id: Scalars['Long'];
  jobListings?: Maybe<Array<Maybe<JobListing>>>;
  name: Scalars['String'];
};

export type JobCategory = {
  __typename?: 'JobCategory';
  id: Scalars['Long'];
  name: Scalars['String'];
};

export type JobCategoryInput = {
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
};

export type JobInput = {
  description: Scalars['String'];
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
};

export type JobListing = {
  __typename?: 'JobListing';
  applications?: Maybe<Array<Maybe<Application>>>;
  availableFrom: Scalars['Date'];
  availableTo: Scalars['Date'];
  category?: Maybe<JobCategory>;
  city: City;
  contractType: ContractType;
  description: Scalars['String'];
  formattedDescription: Scalars['String'];
  id: Scalars['Long'];
  isActive?: Maybe<Scalars['Boolean']>;
  job: Job;
  numberOfVacancies: Scalars['Int'];
  organization: Organization;
  recruiter?: Maybe<Recruiter>;
  title: Scalars['String'];
  workType: WorkType;
};

export type JobListingInput = {
  availableFrom: Scalars['Date'];
  availableTo: Scalars['Date'];
  categoryId: Scalars['Long'];
  contractType: ContractType;
  description: Scalars['String'];
  formattedDescription: Scalars['String'];
  id?: InputMaybe<Scalars['Long']>;
  jobId: Scalars['Long'];
  location: Scalars['String'];
  numberOfVacancies: Scalars['Int'];
  organizationId: Scalars['Long'];
  recruiterId: Scalars['Long'];
  title: Scalars['String'];
  workType: WorkType;
};

export type JobListingPage = {
  __typename?: 'JobListingPage';
  list?: Maybe<Array<Maybe<JobListing>>>;
  page: Scalars['Int'];
  totalElements: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type JobPage = {
  __typename?: 'JobPage';
  list?: Maybe<Array<Maybe<Job>>>;
  page: Scalars['Int'];
  totalElements: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type Message = {
  __typename?: 'Message';
  chat?: Maybe<Chat>;
  content: Scalars['String'];
  deliveredAt: Scalars['DateTime'];
  id: Scalars['Long'];
  seenAt?: Maybe<Scalars['DateTime']>;
  seenBy?: Maybe<Array<Maybe<MessageSeenBy>>>;
  sender: User;
};

export type MessageInput = {
  chatId: Scalars['Long'];
  content: Scalars['String'];
  id?: InputMaybe<Scalars['Long']>;
  senderUserId: Scalars['Long'];
};

export type MessagePage = {
  __typename?: 'MessagePage';
  list?: Maybe<Array<Maybe<Message>>>;
  page: Scalars['Int'];
  totalElements: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type MessageSeenBy = {
  __typename?: 'MessageSeenBy';
  message: Message;
  seenAt: Scalars['DateTime'];
  user: User;
};

export type MessageSeenInput = {
  id?: InputMaybe<Scalars['Long']>;
  userId?: InputMaybe<Scalars['Long']>;
};

export type MessageSlice = {
  __typename?: 'MessageSlice';
  hasNext?: Maybe<Scalars['Boolean']>;
  isFirst?: Maybe<Scalars['Boolean']>;
  isLast?: Maybe<Scalars['Boolean']>;
  list?: Maybe<Array<Maybe<Message>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCertification?: Maybe<Certification>;
  addDomain?: Maybe<Domain>;
  addInstitution?: Maybe<Institution>;
  addJobCategory?: Maybe<JobCategory>;
  addMessageToApplicationChat?: Maybe<Application>;
  addMessageToChat?: Maybe<Chat>;
  addUserProfileExperience?: Maybe<UserProfile>;
  addUserProfileStudy?: Maybe<UserProfile>;
  alterRecruitersInOrganization?: Maybe<Array<Maybe<Recruiter>>>;
  applyToJobListing?: Maybe<Application>;
  createChat?: Maybe<Chat>;
  createConnection?: Maybe<Connection>;
  createOrUpdateOrganization?: Maybe<Organization>;
  createProcess?: Maybe<Process>;
  createStep?: Maybe<Step>;
  healthCheckPost?: Maybe<Scalars['String']>;
  markAllMessagesAsSeen?: Maybe<Chat>;
  publishJob?: Maybe<Job>;
  publishJobListing?: Maybe<JobListing>;
  removeChat?: Maybe<Chat>;
  removeConnection?: Maybe<Connection>;
  removeUserProfileExperience?: Maybe<UserProfile>;
  removeUserProfileStudy?: Maybe<UserProfile>;
  updateApplication?: Maybe<Application>;
  updateChat?: Maybe<Chat>;
  updateConnection?: Maybe<Connection>;
  updateProcess?: Maybe<Process>;
  updateProcessForOrganizationId?: Maybe<Process>;
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


export type MutationAddJobCategoryArgs = {
  JobCategoryInput: JobCategoryInput;
};


export type MutationAddMessageToApplicationChatArgs = {
  MessageInput: MessageInput;
  applicationId: Scalars['Long'];
};


export type MutationAddMessageToChatArgs = {
  MessageInput: MessageInput;
};


export type MutationAddUserProfileExperienceArgs = {
  ExperienceInput: ExperienceInput;
};


export type MutationAddUserProfileStudyArgs = {
  StudyInput: StudyInput;
};


export type MutationAlterRecruitersInOrganizationArgs = {
  OrganizationId: Scalars['Long'];
  RecruiterInput: Array<InputMaybe<RecruiterInput>>;
};


export type MutationApplyToJobListingArgs = {
  ApplicationInput: ApplicationInput;
};


export type MutationCreateChatArgs = {
  ChatInput: ChatInput;
};


export type MutationCreateConnectionArgs = {
  connectionCreateInput: ConnectionCreateInput;
};


export type MutationCreateOrUpdateOrganizationArgs = {
  OrganizationInput: OrganizationInput;
};


export type MutationCreateProcessArgs = {
  ProcessInput: ProcessInput;
};


export type MutationCreateStepArgs = {
  stepInput: StepInput;
};


export type MutationMarkAllMessagesAsSeenArgs = {
  chatId: Scalars['Long'];
  userId: Scalars['Long'];
};


export type MutationPublishJobArgs = {
  JobInput: JobInput;
};


export type MutationPublishJobListingArgs = {
  JobListingInput: JobListingInput;
};


export type MutationRemoveChatArgs = {
  chatId: Scalars['Long'];
};


export type MutationRemoveConnectionArgs = {
  connectionId: Scalars['Long'];
};


export type MutationRemoveUserProfileExperienceArgs = {
  experienceId: Scalars['Long'];
};


export type MutationRemoveUserProfileStudyArgs = {
  studyId: Scalars['Long'];
};


export type MutationUpdateApplicationArgs = {
  ApplicationInput: ApplicationInput;
};


export type MutationUpdateChatArgs = {
  ChatInput: ChatInput;
};


export type MutationUpdateConnectionArgs = {
  connectionRequestInput: ConnectionUpdateInput;
};


export type MutationUpdateProcessArgs = {
  ProcessInput: ProcessInput;
};


export type MutationUpdateProcessForOrganizationIdArgs = {
  organizationId: Scalars['Long'];
  processInput: ProcessInputCreate;
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

export enum Operator {
  Between = 'BETWEEN',
  Equal = 'EQUAL',
  GreaterThan = 'GREATER_THAN',
  GreaterThanEqual = 'GREATER_THAN_EQUAL',
  In = 'IN',
  LessThan = 'LESS_THAN',
  LessThanEqual = 'LESS_THAN_EQUAL',
  Like = 'LIKE',
  NotEqual = 'NOT_EQUAL',
  NotIn = 'NOT_IN'
}

export type Organization = {
  __typename?: 'Organization';
  activitySector: ActivitySector;
  affiliates?: Maybe<Array<Maybe<Organization>>>;
  companySize: OrganizationSize;
  description: Scalars['String'];
  foundedAt: Scalars['Date'];
  headQuarters: City;
  id: Scalars['Long'];
  jobs?: Maybe<Array<Maybe<JobListing>>>;
  locations?: Maybe<Array<Maybe<City>>>;
  name: Scalars['String'];
  photography?: Maybe<Scalars['String']>;
  recruiters?: Maybe<Array<Maybe<Recruiter>>>;
  recruitmentProcess: Process;
  slogan: Scalars['String'];
  slugName: Scalars['String'];
  specializations?: Maybe<Array<Maybe<Specialization>>>;
  webSite?: Maybe<Scalars['Url']>;
};

export type OrganizationInput = {
  activitySectorId: Scalars['Long'];
  companySize?: InputMaybe<OrganizationSize>;
  description: Scalars['String'];
  foundedAt: Scalars['Date'];
  headQuartersId: Scalars['Long'];
  id?: InputMaybe<Scalars['Long']>;
  locations?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  name: Scalars['String'];
  photography?: InputMaybe<Scalars['String']>;
  slogan: Scalars['String'];
  specializations?: InputMaybe<Array<InputMaybe<Specialization>>>;
  webSite?: InputMaybe<Scalars['Url']>;
};

export enum OrganizationSize {
  Between_1_5 = 'BETWEEN_1_5',
  Between_5_30 = 'BETWEEN_5_30',
  Between_30_100 = 'BETWEEN_30_100',
  Between_100_500 = 'BETWEEN_100_500',
  Between_500_1000 = 'BETWEEN_500_1000',
  Between_1000_5000 = 'BETWEEN_1000_5000',
  Between_5000_10000 = 'BETWEEN_5000_10000',
  Over_10000 = 'OVER_10000'
}

export type Photography = {
  __typename?: 'Photography';
  id: Scalars['Long'];
  name: Scalars['String'];
  path: Scalars['String'];
  userProfile?: Maybe<UserProfile>;
};

export type Privilege = {
  __typename?: 'Privilege';
  id: Scalars['Long'];
  name?: Maybe<Scalars['String']>;
};

export type Process = {
  __typename?: 'Process';
  description: Scalars['String'];
  id: Scalars['Long'];
  name: Scalars['String'];
  organizations?: Maybe<Array<Maybe<Organization>>>;
  processSteps?: Maybe<Array<Maybe<ProcessSteps>>>;
};

export type ProcessInput = {
  description: Scalars['String'];
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
  organizationId: Scalars['Long'];
  processSteps?: InputMaybe<Array<InputMaybe<ProcessStepsInput>>>;
};

export type ProcessInputCreate = {
  description: Scalars['String'];
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
  organizationId: Scalars['Long'];
  processSteps?: InputMaybe<Array<InputMaybe<ProcessStepsInputCreate>>>;
};

export type ProcessPage = {
  __typename?: 'ProcessPage';
  list?: Maybe<Array<Maybe<Process>>>;
  page: Scalars['Int'];
  totalElements: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type ProcessSteps = {
  __typename?: 'ProcessSteps';
  id: Scalars['Long'];
  order: Scalars['Int'];
  process: Process;
  status: Status;
  step: Step;
};

export type ProcessStepsInput = {
  id?: InputMaybe<Scalars['Long']>;
  order: Scalars['Int'];
  processId: Scalars['Long'];
  status: Status;
  stepId: Scalars['Long'];
};

export type ProcessStepsInputCreate = {
  id?: InputMaybe<Scalars['Long']>;
  order: Scalars['Int'];
  status: Status;
  stepId: Scalars['Long'];
};

export type Query = {
  __typename?: 'Query';
  findRecruitersAdvSearch?: Maybe<RecruiterPage>;
  getAllActivitySectors?: Maybe<Array<Maybe<ActivitySector>>>;
  getAllApplications?: Maybe<ApplicationPage>;
  getAllCandidates?: Maybe<CandidatePage>;
  getAllCandidatesByJobListingId?: Maybe<CandidatePage>;
  getAllCertifications?: Maybe<Array<Maybe<Certification>>>;
  getAllDomains?: Maybe<Array<Maybe<Domain>>>;
  getAllInstitutions?: Maybe<Array<Maybe<Institution>>>;
  getAllJobCategories?: Maybe<Array<Maybe<JobCategory>>>;
  getAllJobListings?: Maybe<JobListingPage>;
  getAllJobs?: Maybe<Array<Maybe<Job>>>;
  getAllJobsPaginated?: Maybe<JobPage>;
  getAllOrganizations?: Maybe<Array<Maybe<Organization>>>;
  getAllProcesses?: Maybe<ProcessPage>;
  getAllRecruitersForOrganization?: Maybe<Array<Maybe<Recruiter>>>;
  getAllRecruitersForOrganizationBySlug?: Maybe<Array<Maybe<Recruiter>>>;
  getAllSteps?: Maybe<Array<Maybe<Step>>>;
  getAllUserConnectionSuggestions?: Maybe<UserPage>;
  getAllUsers?: Maybe<Array<Maybe<User>>>;
  getAllUsersPaged?: Maybe<UserPage>;
  getApplicationById?: Maybe<Application>;
  getApplicationsForJobIdCountBySteps?: Maybe<Array<Maybe<ApplicationsCountByStep>>>;
  getChatAdvSearch?: Maybe<ChatPage>;
  getChatWithUserId?: Maybe<Chat>;
  getChatsWithUsersIds?: Maybe<Array<Maybe<Chat>>>;
  getConnectionsForUser?: Maybe<UserConnectionPage>;
  getCountriesCities?: Maybe<Array<Maybe<Country>>>;
  getCurrentUser?: Maybe<User>;
  getCurrentUserProfile?: Maybe<UserProfile>;
  getMessagesPaginated?: Maybe<MessagePage>;
  getMessagesSliced?: Maybe<MessageSlice>;
  getMyApplicationForJobListing?: Maybe<Application>;
  getMyApplications?: Maybe<Array<Maybe<Application>>>;
  getNewConnectionForUser?: Maybe<ConnectionPage>;
  getOrganizationById?: Maybe<Organization>;
  getOrganizationBySlugName?: Maybe<Organization>;
  getPrivateChatById?: Maybe<Chat>;
  getRecruiterById?: Maybe<Recruiter>;
  getRelatedJobListings?: Maybe<Array<Maybe<JobListing>>>;
  getStepsByProcess?: Maybe<Array<Maybe<Step>>>;
  getUserProfile?: Maybe<UserProfile>;
  healthCheck?: Maybe<Scalars['String']>;
};


export type QueryFindRecruitersAdvSearchArgs = {
  searchQuery?: InputMaybe<SearchQueryInput>;
};


export type QueryGetAllApplicationsArgs = {
  searchQuery?: InputMaybe<SearchQueryInput>;
};


export type QueryGetAllCandidatesArgs = {
  searchQuery?: InputMaybe<SearchQueryInput>;
};


export type QueryGetAllCandidatesByJobListingIdArgs = {
  JobListingId: Scalars['Long'];
};


export type QueryGetAllJobListingsArgs = {
  searchQuery?: InputMaybe<SearchQueryInput>;
};


export type QueryGetAllJobsPaginatedArgs = {
  searchQuery?: InputMaybe<SearchQueryInput>;
};


export type QueryGetAllProcessesArgs = {
  searchQuery?: InputMaybe<SearchQueryInput>;
};


export type QueryGetAllRecruitersForOrganizationArgs = {
  organizationId: Scalars['Long'];
};


export type QueryGetAllRecruitersForOrganizationBySlugArgs = {
  organizationSlug: Scalars['String'];
};


export type QueryGetAllUserConnectionSuggestionsArgs = {
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
};


export type QueryGetAllUsersPagedArgs = {
  searchQuery?: InputMaybe<SearchQueryInput>;
};


export type QueryGetApplicationByIdArgs = {
  applicationId: Scalars['Long'];
};


export type QueryGetApplicationsForJobIdCountByStepsArgs = {
  jobId: Scalars['Long'];
};


export type QueryGetChatAdvSearchArgs = {
  searchQuery?: InputMaybe<SearchQueryInput>;
};


export type QueryGetChatWithUserIdArgs = {
  userId: Scalars['Long'];
};


export type QueryGetChatsWithUsersIdsArgs = {
  userIds: Array<InputMaybe<Scalars['Long']>>;
};


export type QueryGetConnectionsForUserArgs = {
  page?: InputMaybe<Scalars['Int']>;
  searchQuery?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<SortsInput>;
  userId: Scalars['Long'];
};


export type QueryGetMessagesPaginatedArgs = {
  searchQuery?: InputMaybe<SearchQueryInput>;
};


export type QueryGetMessagesSlicedArgs = {
  searchQuery?: InputMaybe<SearchQueryInput>;
};


export type QueryGetMyApplicationForJobListingArgs = {
  JobListingId: Scalars['Long'];
};


export type QueryGetMyApplicationsArgs = {
  userId: Scalars['Long'];
};


export type QueryGetNewConnectionForUserArgs = {
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
  userId: Scalars['Long'];
};


export type QueryGetOrganizationByIdArgs = {
  organizationId: Scalars['Long'];
};


export type QueryGetOrganizationBySlugNameArgs = {
  slugName: Scalars['String'];
};


export type QueryGetPrivateChatByIdArgs = {
  chatId: Scalars['Long'];
};


export type QueryGetRecruiterByIdArgs = {
  recruiterId: Scalars['Long'];
};


export type QueryGetRelatedJobListingsArgs = {
  jobName: Scalars['String'];
};


export type QueryGetStepsByProcessArgs = {
  processId: Scalars['Int'];
};


export type QueryGetUserProfileArgs = {
  profileSlugUrl?: InputMaybe<Scalars['String']>;
};

export type Recruiter = {
  __typename?: 'Recruiter';
  id: Scalars['Long'];
  isActive: Scalars['Boolean'];
  lastActive?: Maybe<Scalars['DateTime']>;
  organization: Organization;
  registeredAt: Scalars['DateTime'];
  user: User;
};

export type RecruiterInput = {
  id: Scalars['Long'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  lastActive?: InputMaybe<Scalars['DateTime']>;
  organizationId?: InputMaybe<Scalars['Long']>;
};

export type RecruiterPage = {
  __typename?: 'RecruiterPage';
  list?: Maybe<Array<Maybe<Recruiter>>>;
  page: Scalars['Int'];
  totalElements: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['Long'];
  name: Scalars['String'];
  privileges?: Maybe<Array<Maybe<Privilege>>>;
};

export type SearchQueryInput = {
  filters?: InputMaybe<Array<InputMaybe<FiltersInput>>>;
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<InputMaybe<SortsInput>>>;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type SortsInput = {
  direction: SortDirection;
  key: Scalars['String'];
};

export enum Specialization {
  Ai = 'AI',
  AugmentedReality = 'Augmented_Reality',
  Automotive = 'Automotive',
  Banking = 'Banking',
  Blockchain = 'Blockchain',
  CapitalMarkets = 'Capital_Markets',
  CashManagement = 'Cash_Management',
  CommercialBanking = 'Commercial_Banking',
  ConsumerLending = 'Consumer_Lending',
  CorporateAndInvestmentBanking = 'Corporate_and_Investment_Banking',
  Credit = 'Credit',
  CreditCards = 'Credit_Cards',
  DigitalTransformation = 'Digital_Transformation',
  Engineering = 'Engineering',
  Entrepreneurs = 'Entrepreneurs',
  EquitiesAndBrokerage = 'Equities_and_Brokerage',
  EquityAndFixedIncomeResearch = 'Equity_and_Fixed_Income_Research',
  ExchangeTradedFunds = 'Exchange_Traded_Funds',
  FinancialSoftwareDevelopment = 'Financial_Software_Development',
  FinancialServices = 'Financial_services',
  FintechDevelopment = 'Fintech_Development',
  ItAndSoftware = 'IT_and_Software',
  IndustrialAutomation = 'Industrial_Automation',
  InformationServices = 'Information_Services',
  InformationTechnologyAndServices = 'Information_Technology_and_Services',
  Insurance = 'Insurance',
  InsurtechDevelopment = 'Insurtech_Development',
  InternetOfThings = 'Internet_of_Things',
  Intrapreneurs = 'Intrapreneurs',
  InvestmentBanking = 'Investment_Banking',
  InvestmentFunds = 'Investment_Funds',
  MachineLearning = 'Machine_Learning',
  Mobility = 'Mobility',
  MultiAssetFunds = 'Multi_Asset_Funds',
  OffshoreBonds = 'Offshore_Bonds',
  PrivateBanking = 'Private_Banking',
  ProjectManagement = 'Project_Management',
  RetailBanking = 'Retail_banking',
  SecuritiesServices = 'Securities_Services',
  SoftwareDevelopment = 'Software_Development',
  SoftwareProductDesign = 'Software_Product_Design',
  TechnicalConsulting = 'Technical_Consulting',
  TechnologyInnovation = 'Technology_Innovation',
  TransactionServices = 'Transaction_Services',
  VirtualReality = 'Virtual_Reality',
  WealthManagement = 'Wealth_Management'
}

export enum Status {
  Active = 'ACTIVE',
  Draft = 'DRAFT',
  Removed = 'REMOVED'
}

export type Step = {
  __typename?: 'Step';
  description: Scalars['String'];
  id: Scalars['Long'];
  processSteps?: Maybe<Array<Maybe<ProcessSteps>>>;
  title: Scalars['String'];
};

export type StepInput = {
  description: Scalars['String'];
  title: Scalars['String'];
};

export type Study = {
  __typename?: 'Study';
  certification?: Maybe<Certification>;
  degree?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  domainStudy?: Maybe<Domain>;
  endDate?: Maybe<Scalars['Date']>;
  id: Scalars['Long'];
  institution: Institution;
  startDate: Scalars['Date'];
  userProfile: UserProfile;
};

export type StudyInput = {
  certification?: InputMaybe<Scalars['Long']>;
  degree?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  domainStudy?: InputMaybe<Scalars['Long']>;
  endDate?: InputMaybe<Scalars['Date']>;
  id?: InputMaybe<Scalars['Long']>;
  institution: Scalars['Long'];
  startDate: Scalars['Date'];
  userProfileSlugUrl: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  birthDate?: Maybe<Scalars['Date']>;
  displayName: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['Long'];
  isEmailConfirmed: Scalars['Boolean'];
  lastName: Scalars['String'];
  roles?: Maybe<Array<Maybe<Role>>>;
  userProfile: UserProfile;
  username: Scalars['String'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  connectedAt: Scalars['DateTime'];
  id: Scalars['Long'];
  user: User;
};

export type UserConnectionPage = {
  __typename?: 'UserConnectionPage';
  list?: Maybe<Array<Maybe<UserConnection>>>;
  page: Scalars['Int'];
  totalElements: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type UserPage = {
  __typename?: 'UserPage';
  list?: Maybe<Array<Maybe<User>>>;
  page: Scalars['Int'];
  totalElements: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type UserProfile = {
  __typename?: 'UserProfile';
  city?: Maybe<City>;
  coverPhotography?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  experiences?: Maybe<Array<Maybe<Experience>>>;
  id: Scalars['Long'];
  photography?: Maybe<Scalars['String']>;
  profileSlugUrl: Scalars['String'];
  profileTitle: Scalars['String'];
  studies?: Maybe<Array<Maybe<Study>>>;
  user: User;
};

export type UserProfileInput = {
  city: Scalars['String'];
  description: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['Long'];
  lastName: Scalars['String'];
  profileSlugUrl: Scalars['String'];
  profileTitle: Scalars['String'];
};

export enum WorkType {
  Hybrid = 'HYBRID',
  OnSite = 'ON_SITE',
  Remote = 'REMOTE'
}

export type UpdateUserProfileMutationVariables = Exact<{
  UserProfileInput: UserProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateUserProfile?: { __typename?: 'UserProfile', description?: string | null, profileTitle: string, profileSlugUrl: string, city?: { __typename?: 'City', id: number, name: string } | null } | null };

export type AddUserProfileExperienceMutationVariables = Exact<{
  ExperienceInput: ExperienceInput;
}>;


export type AddUserProfileExperienceMutation = { __typename?: 'Mutation', addUserProfileExperience?: { __typename?: 'UserProfile', id: number, description?: string | null, profileTitle: string, profileSlugUrl: string, city?: { __typename?: 'City', id: number, name: string } | null, experiences?: Array<{ __typename?: 'Experience', id: number } | null> | null } | null };

export type UpdateUserProfileExperienceMutationVariables = Exact<{
  ExperienceInput: ExperienceInput;
}>;


export type UpdateUserProfileExperienceMutation = { __typename?: 'Mutation', updateUserProfileExperience?: { __typename?: 'UserProfile', id: number, description?: string | null, profileTitle: string, profileSlugUrl: string, city?: { __typename?: 'City', id: number, name: string } | null, experiences?: Array<{ __typename?: 'Experience', id: number } | null> | null } | null };

export type AddUserProfileStudyMutationVariables = Exact<{
  StudyInput: StudyInput;
}>;


export type AddUserProfileStudyMutation = { __typename?: 'Mutation', addUserProfileStudy?: { __typename?: 'UserProfile', id: number, description?: string | null, profileSlugUrl: string, studies?: Array<{ __typename?: 'Study', id: number } | null> | null } | null };

export type UpdateUserProfileStudyMutationVariables = Exact<{
  StudyInput: StudyInput;
}>;


export type UpdateUserProfileStudyMutation = { __typename?: 'Mutation', updateUserProfileStudy?: { __typename?: 'UserProfile', id: number, description?: string | null, profileSlugUrl: string, studies?: Array<{ __typename?: 'Study', id: number } | null> | null } | null };

export type AddInstitutionMutationVariables = Exact<{
  InstitutionInput: InstitutionInput;
}>;


export type AddInstitutionMutation = { __typename?: 'Mutation', addInstitution?: { __typename?: 'Institution', id: number, name: string, description?: string | null, photography?: string | null } | null };

export type AddDomainMutationVariables = Exact<{
  DomainInput: DomainInput;
}>;


export type AddDomainMutation = { __typename?: 'Mutation', addDomain?: { __typename?: 'Domain', id: number, name: string } | null };

export type AddCertificationMutationVariables = Exact<{
  CertificationInput: CertificationInput;
}>;


export type AddCertificationMutation = { __typename?: 'Mutation', addCertification?: { __typename?: 'Certification', id: number, name: string } | null };

export type PublishJobListingMutationVariables = Exact<{
  JobListingInput: JobListingInput;
}>;


export type PublishJobListingMutation = { __typename?: 'Mutation', publishJobListing?: { __typename?: 'JobListing', id: number, title: string, description: string } | null };

export type AddJobCategoryMutationVariables = Exact<{
  JobCategoryInput: JobCategoryInput;
}>;


export type AddJobCategoryMutation = { __typename?: 'Mutation', addJobCategory?: { __typename?: 'JobCategory', id: number, name: string } | null };

export type ApplyToJobListingMutationVariables = Exact<{
  ApplicationInput: ApplicationInput;
}>;


export type ApplyToJobListingMutation = { __typename?: 'Mutation', applyToJobListing?: { __typename?: 'Application', id: number, dateOfApplication: Date } | null };

export type CreateOrUpdateOrganizationMutationVariables = Exact<{
  OrganizationInput: OrganizationInput;
}>;


export type CreateOrUpdateOrganizationMutation = { __typename?: 'Mutation', createOrUpdateOrganization?: { __typename?: 'Organization', name: string, description: string } | null };

export type AlterRecruitersInOrganizationMutationVariables = Exact<{
  RecruiterInput: Array<InputMaybe<RecruiterInput>> | InputMaybe<RecruiterInput>;
  OrganizationId: Scalars['Long'];
}>;


export type AlterRecruitersInOrganizationMutation = { __typename?: 'Mutation', alterRecruitersInOrganization?: Array<{ __typename?: 'Recruiter', id: number, user: { __typename?: 'User', firstName: string, lastName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null, profileTitle: string } } } | null> | null };

export type PublishJobMutationVariables = Exact<{
  JobInput: JobInput;
}>;


export type PublishJobMutation = { __typename?: 'Mutation', publishJob?: { __typename?: 'Job', name: string, description: string } | null };

export type UpdateApplicationMutationVariables = Exact<{
  ApplicationInput: ApplicationInput;
}>;


export type UpdateApplicationMutation = { __typename?: 'Mutation', updateApplication?: { __typename?: 'Application', id: number, processSteps?: Array<{ __typename?: 'ApplicationProcessSteps', id: number, registeredAt: Date, processStep: { __typename?: 'ProcessSteps', id: number, order: number, step: { __typename?: 'Step', title: string, description: string } } } | null> | null } | null };

export type AddMessageToApplicationChatMutationVariables = Exact<{
  MessageInput: MessageInput;
  applicationId: Scalars['Long'];
}>;


export type AddMessageToApplicationChatMutation = { __typename?: 'Mutation', addMessageToApplicationChat?: { __typename?: 'Application', id: number } | null };

export type CreateChatMutationVariables = Exact<{
  ChatInput: ChatInput;
}>;


export type CreateChatMutation = { __typename?: 'Mutation', createChat?: { __typename?: 'Chat', id: number, messages?: Array<{ __typename?: 'Message', id: number, content: string, deliveredAt: Date, sender: { __typename?: 'User', id: number, username: string, userProfile: { __typename?: 'UserProfile', photography?: string | null } } } | null> | null } | null };

export type AddMessageToChatMutationVariables = Exact<{
  MessageInput: MessageInput;
}>;


export type AddMessageToChatMutation = { __typename?: 'Mutation', addMessageToChat?: { __typename?: 'Chat', id: number, latestMessage?: { __typename?: 'Message', id: number, content: string, deliveredAt: Date, sender: { __typename?: 'User', id: number, username: string, userProfile: { __typename?: 'UserProfile', photography?: string | null } } } | null } | null };

export type MarkAllMessagesAsSeenMutationVariables = Exact<{
  chatId: Scalars['Long'];
  userId: Scalars['Long'];
}>;


export type MarkAllMessagesAsSeenMutation = { __typename?: 'Mutation', markAllMessagesAsSeen?: { __typename?: 'Chat', id: number, messages?: Array<{ __typename?: 'Message', id: number, deliveredAt: Date, seenBy?: Array<{ __typename?: 'MessageSeenBy', seenAt: Date, user: { __typename?: 'User', id: number } } | null> | null } | null> | null } | null };

export type UpdateChatMutationVariables = Exact<{
  ChatInput: ChatInput;
}>;


export type UpdateChatMutation = { __typename?: 'Mutation', updateChat?: { __typename?: 'Chat', id: number } | null };

export type UpdateProcessForOrganizationIdMutationVariables = Exact<{
  processInput: ProcessInputCreate;
  organizationId: Scalars['Long'];
}>;


export type UpdateProcessForOrganizationIdMutation = { __typename?: 'Mutation', updateProcessForOrganizationId?: { __typename?: 'Process', id: number, name: string, description: string, processSteps?: Array<{ __typename?: 'ProcessSteps', id: number, status: Status, order: number, step: { __typename?: 'Step', id: number, title: string, description: string } } | null> | null } | null };

export type CreateStepMutationVariables = Exact<{
  stepInput: StepInput;
}>;


export type CreateStepMutation = { __typename?: 'Mutation', createStep?: { __typename?: 'Step', id: number, title: string, description: string } | null };

export type CreateConnectionRequestMutationVariables = Exact<{
  connectionCreateInput: ConnectionCreateInput;
}>;


export type CreateConnectionRequestMutation = { __typename?: 'Mutation', createConnection?: { __typename?: 'Connection', id: number, connectionStatus: ConnectionStatus, requester: { __typename?: 'User', id: number, displayName: string, firstName: string, lastName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null, profileTitle: string } }, addressed: { __typename?: 'User', id: number } } | null };

export type UpdateConnectionMutationVariables = Exact<{
  connectionRequestInput: ConnectionUpdateInput;
}>;


export type UpdateConnectionMutation = { __typename?: 'Mutation', updateConnection?: { __typename?: 'Connection', id: number, connectionStatus: ConnectionStatus, requester: { __typename?: 'User', id: number, displayName: string, firstName: string, lastName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null, profileTitle: string } } } | null };

export type RemoveConnectionMutationVariables = Exact<{
  connectionId: Scalars['Long'];
}>;


export type RemoveConnectionMutation = { __typename?: 'Mutation', removeConnection?: { __typename?: 'Connection', id: number, connectionStatus: ConnectionStatus } | null };

export type RemoveChatMutationVariables = Exact<{
  chatId: Scalars['Long'];
}>;


export type RemoveChatMutation = { __typename?: 'Mutation', removeChat?: { __typename?: 'Chat', id: number } | null };

export type RemoveUserProfileStudyMutationVariables = Exact<{
  studyId: Scalars['Long'];
}>;


export type RemoveUserProfileStudyMutation = { __typename?: 'Mutation', removeUserProfileStudy?: { __typename?: 'UserProfile', id: number } | null };

export type RemoveUserProfileExperienceMutationVariables = Exact<{
  experienceId: Scalars['Long'];
}>;


export type RemoveUserProfileExperienceMutation = { __typename?: 'Mutation', removeUserProfileExperience?: { __typename?: 'UserProfile', id: number } | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', id: number, firstName: string, lastName: string, username: string } | null };

export type GetAllJobListingsQueryVariables = Exact<{
  searchQuery?: InputMaybe<SearchQueryInput>;
}>;


export type GetAllJobListingsQuery = { __typename?: 'Query', getAllJobListings?: { __typename?: 'JobListingPage', page: number, totalPages: number, totalElements: number, list?: Array<{ __typename?: 'JobListing', id: number, title: string, description: string, formattedDescription: string, availableFrom: Date, availableTo: Date, isActive?: boolean | null, numberOfVacancies: number, contractType: ContractType, workType: WorkType, city: { __typename?: 'City', id: number, name: string, country: { __typename?: 'Country', code: string, name: string } }, job: { __typename?: 'Job', id: number, name: string, description: string }, organization: { __typename?: 'Organization', id: number, name: string, slugName: string, photography?: string | null, description: string, activitySector: { __typename?: 'ActivitySector', id: number, name: string } }, category?: { __typename?: 'JobCategory', id: number, name: string } | null, applications?: Array<{ __typename?: 'Application', id: number, dateOfApplication: Date } | null> | null, recruiter?: { __typename?: 'Recruiter', id: number, user: { __typename?: 'User', id: number, firstName: string, lastName: string, username: string, userProfile: { __typename?: 'UserProfile', id: number, profileSlugUrl: string, photography?: string | null, profileTitle: string } } } | null } | null> | null } | null };

export type GetUserProfileQueryVariables = Exact<{
  profileSlugUrl?: InputMaybe<Scalars['String']>;
}>;


export type GetUserProfileQuery = { __typename?: 'Query', getUserProfile?: { __typename?: 'UserProfile', id: number, photography?: string | null, coverPhotography?: string | null, description?: string | null, profileSlugUrl: string, profileTitle: string, user: { __typename?: 'User', firstName: string, lastName: string, username: string }, city?: { __typename?: 'City', id: number, name: string, country: { __typename?: 'Country', code: string, name: string } } | null, experiences?: Array<{ __typename?: 'Experience', id: number, title: string, contractType: ContractType, startDate: Date, endDate?: Date | null, description: string, organization?: { __typename?: 'Organization', id: number, name: string, photography?: string | null, activitySector: { __typename?: 'ActivitySector', id: number, name: string } } | null, city?: { __typename?: 'City', id: number, name: string, country: { __typename?: 'Country', code: string, name: string } } | null, activitySector: { __typename?: 'ActivitySector', id: number, name: string } } | null> | null, studies?: Array<{ __typename?: 'Study', id: number, degree?: string | null, description?: string | null, startDate: Date, endDate?: Date | null, institution: { __typename?: 'Institution', id: number, name: string, description?: string | null, photography?: string | null }, domainStudy?: { __typename?: 'Domain', id: number, name: string } | null, certification?: { __typename?: 'Certification', id: number, name: string } | null } | null> | null } | null };

export type GetCountriesCitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCountriesCitiesQuery = { __typename?: 'Query', getCountriesCities?: Array<{ __typename?: 'Country', code: string, name: string, cities?: Array<{ __typename?: 'City', id: number, name: string } | null> | null } | null> | null };

export type GetAllOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllOrganizationsQuery = { __typename?: 'Query', getAllOrganizations?: Array<{ __typename?: 'Organization', id: number, name: string, slugName: string, description: string, companySize: OrganizationSize, foundedAt: Date, slogan: string, photography?: string | null, webSite?: String | null, headQuarters: { __typename?: 'City', id: number, name: string, country: { __typename?: 'Country', code: string, name: string } }, activitySector: { __typename?: 'ActivitySector', id: number, name: string }, recruitmentProcess: { __typename?: 'Process', id: number }, locations?: Array<{ __typename?: 'City', id: number, name: string, country: { __typename?: 'Country', code: string, name: string } } | null> | null } | null> | null };

export type GetAllActivitySectorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllActivitySectorsQuery = { __typename?: 'Query', getAllActivitySectors?: Array<{ __typename?: 'ActivitySector', id: number, name: string } | null> | null };

export type GetAllInstitutionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllInstitutionsQuery = { __typename?: 'Query', getAllInstitutions?: Array<{ __typename?: 'Institution', id: number, name: string, description?: string | null, photography?: string | null } | null> | null };

export type GetAllDomainsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllDomainsQuery = { __typename?: 'Query', getAllDomains?: Array<{ __typename?: 'Domain', id: number, name: string } | null> | null };

export type GetAllCertificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCertificationsQuery = { __typename?: 'Query', getAllCertifications?: Array<{ __typename?: 'Certification', id: number, name: string } | null> | null };

export type GetAllJobCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllJobCategoriesQuery = { __typename?: 'Query', getAllJobCategories?: Array<{ __typename?: 'JobCategory', id: number, name: string } | null> | null };

export type GetAllJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllJobsQuery = { __typename?: 'Query', getAllJobs?: Array<{ __typename?: 'Job', id: number, name: string, description: string } | null> | null };

export type GetOrganizationByIdQueryVariables = Exact<{
  organizationId: Scalars['Long'];
}>;


export type GetOrganizationByIdQuery = { __typename?: 'Query', getOrganizationById?: { __typename?: 'Organization', id: number, name: string, slugName: string, companySize: OrganizationSize, foundedAt: Date, slogan: string, description: string, photography?: string | null, headQuarters: { __typename?: 'City', id: number, name: string, country: { __typename?: 'Country', code: string, name: string } }, activitySector: { __typename?: 'ActivitySector', id: number, name: string }, recruitmentProcess: { __typename?: 'Process', id: number } } | null };

export type GetOrganizationBySlugNameQueryVariables = Exact<{
  slugName: Scalars['String'];
}>;


export type GetOrganizationBySlugNameQuery = { __typename?: 'Query', getOrganizationBySlugName?: { __typename?: 'Organization', id: number, name: string, slugName: string, companySize: OrganizationSize, foundedAt: Date, slogan: string, description: string, photography?: string | null, webSite?: String | null, specializations?: Array<Specialization | null> | null, headQuarters: { __typename?: 'City', id: number, name: string, country: { __typename?: 'Country', code: string, name: string } }, activitySector: { __typename?: 'ActivitySector', id: number, name: string }, recruitmentProcess: { __typename?: 'Process', id: number }, locations?: Array<{ __typename?: 'City', id: number, name: string, longitude?: number | null, latitude?: number | null, country: { __typename?: 'Country', code: string, name: string } } | null> | null, recruiters?: Array<{ __typename?: 'Recruiter', id: number, user: { __typename?: 'User', firstName: string, lastName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null, profileTitle: string } } } | null> | null } | null };

export type GetRelatedJobListingsQueryVariables = Exact<{
  jobName: Scalars['String'];
}>;


export type GetRelatedJobListingsQuery = { __typename?: 'Query', getRelatedJobListings?: Array<{ __typename?: 'JobListing', id: number, title: string, availableFrom: Date, availableTo: Date, city: { __typename?: 'City', id: number, name: string, country: { __typename?: 'Country', code: string, name: string } }, organization: { __typename?: 'Organization', id: number, name: string, photography?: string | null }, applications?: Array<{ __typename?: 'Application', id: number, dateOfApplication: Date } | null> | null } | null> | null };

export type GetMyApplicationForJobListingQueryVariables = Exact<{
  JobListingId: Scalars['Long'];
}>;


export type GetMyApplicationForJobListingQuery = { __typename?: 'Query', getMyApplicationForJobListing?: { __typename?: 'Application', id: number, dateOfApplication: Date, processSteps?: Array<{ __typename?: 'ApplicationProcessSteps', id: number, registeredAt: Date, processStep: { __typename?: 'ProcessSteps', order: number, step: { __typename?: 'Step', title: string, description: string } } } | null> | null, jobListing: { __typename?: 'JobListing', id: number } } | null };

export type GetApplicationByIdQueryVariables = Exact<{
  applicationId: Scalars['Long'];
}>;


export type GetApplicationByIdQuery = { __typename?: 'Query', getApplicationById?: { __typename?: 'Application', id: number, status: ApplicationStatus, dateOfApplication: Date, applicantProfile: { __typename?: 'UserProfile', id: number, profileSlugUrl: string, profileTitle: string, photography?: string | null }, candidate: { __typename?: 'Candidate', user: { __typename?: 'User', id: number, firstName: string, lastName: string, username: string, birthDate?: Date | null, email: string } }, processSteps?: Array<{ __typename?: 'ApplicationProcessSteps', id: number, registeredAt: Date, processStep: { __typename?: 'ProcessSteps', id: number, order: number, step: { __typename?: 'Step', title: string, description: string } } } | null> | null, jobListing: { __typename?: 'JobListing', id: number, organization: { __typename?: 'Organization', id: number, slugName: string } }, applicationDocuments?: Array<{ __typename?: 'ApplicationDocument', id: number, document: { __typename?: 'Document', name: string } } | null> | null, chat: { __typename?: 'Chat', id: number } } | null };

export type GetAllApplicationsQueryVariables = Exact<{
  searchQuery?: InputMaybe<SearchQueryInput>;
}>;


export type GetAllApplicationsQuery = { __typename?: 'Query', getAllApplications?: { __typename?: 'ApplicationPage', page: number, totalPages: number, totalElements: number, list?: Array<{ __typename?: 'Application', id: number, dateOfApplication: Date, status: ApplicationStatus, applicantProfile: { __typename?: 'UserProfile', id: number, profileSlugUrl: string, profileTitle: string, photography?: string | null }, candidate: { __typename?: 'Candidate', user: { __typename?: 'User', firstName: string, lastName: string, username: string, birthDate?: Date | null, email: string } }, processSteps?: Array<{ __typename?: 'ApplicationProcessSteps', registeredAt: Date, processStep: { __typename?: 'ProcessSteps', id: number, step: { __typename?: 'Step', id: number, title: string } } } | null> | null } | null> | null } | null };

export type GetAllProcessesQueryVariables = Exact<{
  searchQuery?: InputMaybe<SearchQueryInput>;
}>;


export type GetAllProcessesQuery = { __typename?: 'Query', getAllProcesses?: { __typename?: 'ProcessPage', page: number, totalPages: number, totalElements: number, list?: Array<{ __typename?: 'Process', id: number, name: string, description: string, processSteps?: Array<{ __typename?: 'ProcessSteps', id: number, status: Status, order: number, step: { __typename?: 'Step', id: number, title: string, description: string } } | null> | null } | null> | null } | null };

export type GetAllRecruitersForOrganizationBySlugQueryVariables = Exact<{
  organizationSlug: Scalars['String'];
}>;


export type GetAllRecruitersForOrganizationBySlugQuery = { __typename?: 'Query', getAllRecruitersForOrganizationBySlug?: Array<{ __typename?: 'Recruiter', id: number, user: { __typename?: 'User', firstName: string, lastName: string, username: string, userProfile: { __typename?: 'UserProfile', photography?: string | null, profileTitle: string } } } | null> | null };

export type GetRecruiterByIdQueryVariables = Exact<{
  recruiterId: Scalars['Long'];
}>;


export type GetRecruiterByIdQuery = { __typename?: 'Query', getRecruiterById?: { __typename?: 'Recruiter', id: number, registeredAt: Date, user: { __typename?: 'User', firstName: string, lastName: string, email: string, username: string, birthDate?: Date | null, userProfile: { __typename?: 'UserProfile', photography?: string | null, coverPhotography?: string | null, profileTitle: string, description?: string | null, city?: { __typename?: 'City', name: string, country: { __typename?: 'Country', name: string } } | null } }, organization: { __typename?: 'Organization', id: number, name: string, slugName: string, photography?: string | null, description: string, activitySector: { __typename?: 'ActivitySector', id: number, name: string } } } | null };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers?: Array<{ __typename?: 'User', id: number, firstName: string, lastName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null, profileTitle: string } } | null> | null };

export type GetAllUsersPagedQueryVariables = Exact<{
  searchQuery?: InputMaybe<SearchQueryInput>;
}>;


export type GetAllUsersPagedQuery = { __typename?: 'Query', getAllUsersPaged?: { __typename?: 'UserPage', page: number, totalPages: number, totalElements: number, list?: Array<{ __typename?: 'User', id: number, firstName: string, lastName: string, displayName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null, profileTitle: string, profileSlugUrl: string } } | null> | null } | null };

export type GetAllJobsPaginatedQueryVariables = Exact<{
  searchQuery?: InputMaybe<SearchQueryInput>;
}>;


export type GetAllJobsPaginatedQuery = { __typename?: 'Query', getAllJobsPaginated?: { __typename?: 'JobPage', page: number, totalPages: number, totalElements: number, list?: Array<{ __typename?: 'Job', id: number, name: string, description: string } | null> | null } | null };

export type GetMyApplicationsQueryVariables = Exact<{
  userId: Scalars['Long'];
}>;


export type GetMyApplicationsQuery = { __typename?: 'Query', getMyApplications?: Array<{ __typename?: 'Application', id: number, dateOfApplication: Date, jobListing: { __typename?: 'JobListing', id: number, title: string, organization: { __typename?: 'Organization', id: number, name: string, photography?: string | null, slugName: string }, city: { __typename?: 'City', name: string, country: { __typename?: 'Country', name: string } } }, processSteps?: Array<{ __typename?: 'ApplicationProcessSteps', id: number } | null> | null } | null> | null };

export type GetApplicationsForJobIdCountByStepsQueryVariables = Exact<{
  jobId: Scalars['Long'];
}>;


export type GetApplicationsForJobIdCountByStepsQuery = { __typename?: 'Query', getApplicationsForJobIdCountBySteps?: Array<{ __typename?: 'ApplicationsCountByStep', applicationsCount: number, stepTitle: string } | null> | null };

export type GetPrivateChatByIdQueryVariables = Exact<{
  chatId: Scalars['Long'];
}>;


export type GetPrivateChatByIdQuery = { __typename?: 'Query', getPrivateChatById?: { __typename?: 'Chat', id: number, title?: string | null, unreadMessagesCount: number, users?: Array<{ __typename?: 'User', id: number, username: string, firstName: string, lastName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null, profileTitle: string } } | null> | null, latestMessage?: { __typename?: 'Message', id: number, content: string, deliveredAt: Date } | null } | null };

export type GetChatAdvSearchQueryVariables = Exact<{
  searchQuery: SearchQueryInput;
}>;


export type GetChatAdvSearchQuery = { __typename?: 'Query', getChatAdvSearch?: { __typename?: 'ChatPage', page: number, totalPages: number, totalElements: number, list?: Array<{ __typename?: 'Chat', id: number, unreadMessagesCount: number, title?: string | null, messages?: Array<{ __typename?: 'Message', id: number, content: string, deliveredAt: Date, sender: { __typename?: 'User', id: number, username: string, firstName: string, lastName: string, displayName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null } } } | null> | null, users?: Array<{ __typename?: 'User', id: number, username: string, firstName: string, lastName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null } } | null> | null, latestMessage?: { __typename?: 'Message', id: number, content: string, deliveredAt: Date, sender: { __typename?: 'User', firstName: string, lastName: string } } | null } | null> | null } | null };

export type GetChatsWithUsersIdsQueryVariables = Exact<{
  userIds: Array<InputMaybe<Scalars['Long']>> | InputMaybe<Scalars['Long']>;
}>;


export type GetChatsWithUsersIdsQuery = { __typename?: 'Query', getChatsWithUsersIds?: Array<{ __typename?: 'Chat', id: number, unreadMessagesCount: number, title?: string | null, messages?: Array<{ __typename?: 'Message', id: number, content: string, deliveredAt: Date, sender: { __typename?: 'User', id: number, username: string, firstName: string, lastName: string, displayName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null } } } | null> | null, users?: Array<{ __typename?: 'User', id: number, username: string, firstName: string, lastName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null } } | null> | null, latestMessage?: { __typename?: 'Message', id: number, content: string, deliveredAt: Date, sender: { __typename?: 'User', firstName: string, lastName: string } } | null } | null> | null };

export type GetChatLinesAdvSearchQueryVariables = Exact<{
  searchQuery: SearchQueryInput;
}>;


export type GetChatLinesAdvSearchQuery = { __typename?: 'Query', getChatAdvSearch?: { __typename?: 'ChatPage', page: number, totalPages: number, totalElements: number, list?: Array<{ __typename?: 'Chat', id: number, unreadMessagesCount: number, title?: string | null, users?: Array<{ __typename?: 'User', id: number, username: string, firstName: string, lastName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null } } | null> | null, latestMessage?: { __typename?: 'Message', id: number, content: string, deliveredAt: Date, sender: { __typename?: 'User', firstName: string, lastName: string } } | null } | null> | null } | null };

export type GetMessagesPaginatedQueryVariables = Exact<{
  searchQuery?: InputMaybe<SearchQueryInput>;
}>;


export type GetMessagesPaginatedQuery = { __typename?: 'Query', getMessagesPaginated?: { __typename?: 'MessagePage', page: number, totalPages: number, totalElements: number, list?: Array<{ __typename?: 'Message', id: number, content: string, deliveredAt: Date, seenAt?: Date | null, sender: { __typename?: 'User', id: number, username: string, firstName: string, lastName: string, displayName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null } } } | null> | null } | null };

export type GetAllStepsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStepsQuery = { __typename?: 'Query', getAllSteps?: Array<{ __typename?: 'Step', id: number, title: string, description: string } | null> | null };

export type FindRecruitersAdvSearchQueryVariables = Exact<{
  searchQuery?: InputMaybe<SearchQueryInput>;
}>;


export type FindRecruitersAdvSearchQuery = { __typename?: 'Query', findRecruitersAdvSearch?: { __typename?: 'RecruiterPage', page: number, totalPages: number, totalElements: number, list?: Array<{ __typename?: 'Recruiter', id: number, registeredAt: Date, user: { __typename?: 'User', id: number, firstName: string, lastName: string, displayName: string, birthDate?: Date | null, userProfile: { __typename?: 'UserProfile', photography?: string | null, profileTitle: string } } } | null> | null } | null };

export type GetConnectionInvitationsForUserQueryVariables = Exact<{
  userId: Scalars['Long'];
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
}>;


export type GetConnectionInvitationsForUserQuery = { __typename?: 'Query', getNewConnectionForUser?: { __typename?: 'ConnectionPage', page: number, totalPages: number, totalElements: number, list?: Array<{ __typename?: 'Connection', id: number, connectionStatus: ConnectionStatus, lastModified: Date, requester: { __typename?: 'User', id: number, displayName: string, firstName: string, lastName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null, profileTitle: string } } } | null> | null } | null };

export type GetConnectionsForUserQueryVariables = Exact<{
  userId: Scalars['Long'];
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
  searchQuery?: InputMaybe<Scalars['String']>;
  sortBy?: InputMaybe<SortsInput>;
}>;


export type GetConnectionsForUserQuery = { __typename?: 'Query', getConnectionsForUser?: { __typename?: 'UserConnectionPage', page: number, totalPages: number, totalElements: number, list?: Array<{ __typename?: 'UserConnection', id: number, connectedAt: Date, user: { __typename?: 'User', id: number, displayName: string, firstName: string, lastName: string, userProfile: { __typename?: 'UserProfile', photography?: string | null, profileTitle: string, profileSlugUrl: string } } } | null> | null } | null };

export type GetAllUserConnectionSuggestionsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
}>;


export type GetAllUserConnectionSuggestionsQuery = { __typename?: 'Query', getAllUserConnectionSuggestions?: { __typename?: 'UserPage', page: number, totalPages: number, totalElements: number, list?: Array<{ __typename?: 'User', id: number, displayName: string, firstName: string, lastName: string, userProfile: { __typename?: 'UserProfile', coverPhotography?: string | null, photography?: string | null, profileTitle: string, profileSlugUrl: string } } | null> | null } | null };

export type GetChatWithUserIdQueryVariables = Exact<{
  userId: Scalars['Long'];
}>;


export type GetChatWithUserIdQuery = { __typename?: 'Query', getChatWithUserId?: { __typename?: 'Chat', id: number, title?: string | null, unreadMessagesCount: number, latestMessage?: { __typename?: 'Message', content: string } | null } | null };


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
      options?: UseMutationOptions<UpdateUserProfileMutation, TError, UpdateUserProfileMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<UpdateUserProfileMutation, TError, UpdateUserProfileMutationVariables, TContext>(
      ['UpdateUserProfile'],
      (variables?: UpdateUserProfileMutationVariables) => fetcher<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(client, UpdateUserProfileDocument, variables, headers)(),
      options
    );
useUpdateUserProfileMutation.getKey = () => ['UpdateUserProfile'];

useUpdateUserProfileMutation.fetcher = (client: GraphQLClient, variables: UpdateUserProfileMutationVariables, headers?: RequestInit['headers']) => fetcher<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(client, UpdateUserProfileDocument, variables, headers);
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
      options?: UseMutationOptions<AddUserProfileExperienceMutation, TError, AddUserProfileExperienceMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<AddUserProfileExperienceMutation, TError, AddUserProfileExperienceMutationVariables, TContext>(
      ['AddUserProfileExperience'],
      (variables?: AddUserProfileExperienceMutationVariables) => fetcher<AddUserProfileExperienceMutation, AddUserProfileExperienceMutationVariables>(client, AddUserProfileExperienceDocument, variables, headers)(),
      options
    );
useAddUserProfileExperienceMutation.getKey = () => ['AddUserProfileExperience'];

useAddUserProfileExperienceMutation.fetcher = (client: GraphQLClient, variables: AddUserProfileExperienceMutationVariables, headers?: RequestInit['headers']) => fetcher<AddUserProfileExperienceMutation, AddUserProfileExperienceMutationVariables>(client, AddUserProfileExperienceDocument, variables, headers);
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
      options?: UseMutationOptions<UpdateUserProfileExperienceMutation, TError, UpdateUserProfileExperienceMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<UpdateUserProfileExperienceMutation, TError, UpdateUserProfileExperienceMutationVariables, TContext>(
      ['UpdateUserProfileExperience'],
      (variables?: UpdateUserProfileExperienceMutationVariables) => fetcher<UpdateUserProfileExperienceMutation, UpdateUserProfileExperienceMutationVariables>(client, UpdateUserProfileExperienceDocument, variables, headers)(),
      options
    );
useUpdateUserProfileExperienceMutation.getKey = () => ['UpdateUserProfileExperience'];

useUpdateUserProfileExperienceMutation.fetcher = (client: GraphQLClient, variables: UpdateUserProfileExperienceMutationVariables, headers?: RequestInit['headers']) => fetcher<UpdateUserProfileExperienceMutation, UpdateUserProfileExperienceMutationVariables>(client, UpdateUserProfileExperienceDocument, variables, headers);
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
      options?: UseMutationOptions<AddUserProfileStudyMutation, TError, AddUserProfileStudyMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<AddUserProfileStudyMutation, TError, AddUserProfileStudyMutationVariables, TContext>(
      ['AddUserProfileStudy'],
      (variables?: AddUserProfileStudyMutationVariables) => fetcher<AddUserProfileStudyMutation, AddUserProfileStudyMutationVariables>(client, AddUserProfileStudyDocument, variables, headers)(),
      options
    );
useAddUserProfileStudyMutation.getKey = () => ['AddUserProfileStudy'];

useAddUserProfileStudyMutation.fetcher = (client: GraphQLClient, variables: AddUserProfileStudyMutationVariables, headers?: RequestInit['headers']) => fetcher<AddUserProfileStudyMutation, AddUserProfileStudyMutationVariables>(client, AddUserProfileStudyDocument, variables, headers);
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
      options?: UseMutationOptions<UpdateUserProfileStudyMutation, TError, UpdateUserProfileStudyMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<UpdateUserProfileStudyMutation, TError, UpdateUserProfileStudyMutationVariables, TContext>(
      ['UpdateUserProfileStudy'],
      (variables?: UpdateUserProfileStudyMutationVariables) => fetcher<UpdateUserProfileStudyMutation, UpdateUserProfileStudyMutationVariables>(client, UpdateUserProfileStudyDocument, variables, headers)(),
      options
    );
useUpdateUserProfileStudyMutation.getKey = () => ['UpdateUserProfileStudy'];

useUpdateUserProfileStudyMutation.fetcher = (client: GraphQLClient, variables: UpdateUserProfileStudyMutationVariables, headers?: RequestInit['headers']) => fetcher<UpdateUserProfileStudyMutation, UpdateUserProfileStudyMutationVariables>(client, UpdateUserProfileStudyDocument, variables, headers);
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
export const useAddInstitutionMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<AddInstitutionMutation, TError, AddInstitutionMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<AddInstitutionMutation, TError, AddInstitutionMutationVariables, TContext>(
      ['AddInstitution'],
      (variables?: AddInstitutionMutationVariables) => fetcher<AddInstitutionMutation, AddInstitutionMutationVariables>(client, AddInstitutionDocument, variables, headers)(),
      options
    );
useAddInstitutionMutation.getKey = () => ['AddInstitution'];

useAddInstitutionMutation.fetcher = (client: GraphQLClient, variables: AddInstitutionMutationVariables, headers?: RequestInit['headers']) => fetcher<AddInstitutionMutation, AddInstitutionMutationVariables>(client, AddInstitutionDocument, variables, headers);
export const AddDomainDocument = `
    mutation AddDomain($DomainInput: DomainInput!) {
  addDomain(DomainInput: $DomainInput) {
    id
    name
  }
}
    `;
export const useAddDomainMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<AddDomainMutation, TError, AddDomainMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<AddDomainMutation, TError, AddDomainMutationVariables, TContext>(
      ['AddDomain'],
      (variables?: AddDomainMutationVariables) => fetcher<AddDomainMutation, AddDomainMutationVariables>(client, AddDomainDocument, variables, headers)(),
      options
    );
useAddDomainMutation.getKey = () => ['AddDomain'];

useAddDomainMutation.fetcher = (client: GraphQLClient, variables: AddDomainMutationVariables, headers?: RequestInit['headers']) => fetcher<AddDomainMutation, AddDomainMutationVariables>(client, AddDomainDocument, variables, headers);
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
      options?: UseMutationOptions<AddCertificationMutation, TError, AddCertificationMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<AddCertificationMutation, TError, AddCertificationMutationVariables, TContext>(
      ['AddCertification'],
      (variables?: AddCertificationMutationVariables) => fetcher<AddCertificationMutation, AddCertificationMutationVariables>(client, AddCertificationDocument, variables, headers)(),
      options
    );
useAddCertificationMutation.getKey = () => ['AddCertification'];

useAddCertificationMutation.fetcher = (client: GraphQLClient, variables: AddCertificationMutationVariables, headers?: RequestInit['headers']) => fetcher<AddCertificationMutation, AddCertificationMutationVariables>(client, AddCertificationDocument, variables, headers);
export const PublishJobListingDocument = `
    mutation PublishJobListing($JobListingInput: JobListingInput!) {
  publishJobListing(JobListingInput: $JobListingInput) {
    id
    title
    description
  }
}
    `;
export const usePublishJobListingMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<PublishJobListingMutation, TError, PublishJobListingMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<PublishJobListingMutation, TError, PublishJobListingMutationVariables, TContext>(
      ['PublishJobListing'],
      (variables?: PublishJobListingMutationVariables) => fetcher<PublishJobListingMutation, PublishJobListingMutationVariables>(client, PublishJobListingDocument, variables, headers)(),
      options
    );
usePublishJobListingMutation.getKey = () => ['PublishJobListing'];

usePublishJobListingMutation.fetcher = (client: GraphQLClient, variables: PublishJobListingMutationVariables, headers?: RequestInit['headers']) => fetcher<PublishJobListingMutation, PublishJobListingMutationVariables>(client, PublishJobListingDocument, variables, headers);
export const AddJobCategoryDocument = `
    mutation AddJobCategory($JobCategoryInput: JobCategoryInput!) {
  addJobCategory(JobCategoryInput: $JobCategoryInput) {
    id
    name
  }
}
    `;
export const useAddJobCategoryMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<AddJobCategoryMutation, TError, AddJobCategoryMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<AddJobCategoryMutation, TError, AddJobCategoryMutationVariables, TContext>(
      ['AddJobCategory'],
      (variables?: AddJobCategoryMutationVariables) => fetcher<AddJobCategoryMutation, AddJobCategoryMutationVariables>(client, AddJobCategoryDocument, variables, headers)(),
      options
    );
useAddJobCategoryMutation.getKey = () => ['AddJobCategory'];

useAddJobCategoryMutation.fetcher = (client: GraphQLClient, variables: AddJobCategoryMutationVariables, headers?: RequestInit['headers']) => fetcher<AddJobCategoryMutation, AddJobCategoryMutationVariables>(client, AddJobCategoryDocument, variables, headers);
export const ApplyToJobListingDocument = `
    mutation ApplyToJobListing($ApplicationInput: ApplicationInput!) {
  applyToJobListing(ApplicationInput: $ApplicationInput) {
    id
    dateOfApplication
  }
}
    `;
export const useApplyToJobListingMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<ApplyToJobListingMutation, TError, ApplyToJobListingMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<ApplyToJobListingMutation, TError, ApplyToJobListingMutationVariables, TContext>(
      ['ApplyToJobListing'],
      (variables?: ApplyToJobListingMutationVariables) => fetcher<ApplyToJobListingMutation, ApplyToJobListingMutationVariables>(client, ApplyToJobListingDocument, variables, headers)(),
      options
    );
useApplyToJobListingMutation.getKey = () => ['ApplyToJobListing'];

useApplyToJobListingMutation.fetcher = (client: GraphQLClient, variables: ApplyToJobListingMutationVariables, headers?: RequestInit['headers']) => fetcher<ApplyToJobListingMutation, ApplyToJobListingMutationVariables>(client, ApplyToJobListingDocument, variables, headers);
export const CreateOrUpdateOrganizationDocument = `
    mutation CreateOrUpdateOrganization($OrganizationInput: OrganizationInput!) {
  createOrUpdateOrganization(OrganizationInput: $OrganizationInput) {
    name
    description
  }
}
    `;
export const useCreateOrUpdateOrganizationMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<CreateOrUpdateOrganizationMutation, TError, CreateOrUpdateOrganizationMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<CreateOrUpdateOrganizationMutation, TError, CreateOrUpdateOrganizationMutationVariables, TContext>(
      ['CreateOrUpdateOrganization'],
      (variables?: CreateOrUpdateOrganizationMutationVariables) => fetcher<CreateOrUpdateOrganizationMutation, CreateOrUpdateOrganizationMutationVariables>(client, CreateOrUpdateOrganizationDocument, variables, headers)(),
      options
    );
useCreateOrUpdateOrganizationMutation.getKey = () => ['CreateOrUpdateOrganization'];

useCreateOrUpdateOrganizationMutation.fetcher = (client: GraphQLClient, variables: CreateOrUpdateOrganizationMutationVariables, headers?: RequestInit['headers']) => fetcher<CreateOrUpdateOrganizationMutation, CreateOrUpdateOrganizationMutationVariables>(client, CreateOrUpdateOrganizationDocument, variables, headers);
export const AlterRecruitersInOrganizationDocument = `
    mutation AlterRecruitersInOrganization($RecruiterInput: [RecruiterInput]!, $OrganizationId: Long!) {
  alterRecruitersInOrganization(
    RecruiterInput: $RecruiterInput
    OrganizationId: $OrganizationId
  ) {
    id
    user {
      firstName
      lastName
      userProfile {
        photography
        profileTitle
      }
    }
  }
}
    `;
export const useAlterRecruitersInOrganizationMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<AlterRecruitersInOrganizationMutation, TError, AlterRecruitersInOrganizationMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<AlterRecruitersInOrganizationMutation, TError, AlterRecruitersInOrganizationMutationVariables, TContext>(
      ['AlterRecruitersInOrganization'],
      (variables?: AlterRecruitersInOrganizationMutationVariables) => fetcher<AlterRecruitersInOrganizationMutation, AlterRecruitersInOrganizationMutationVariables>(client, AlterRecruitersInOrganizationDocument, variables, headers)(),
      options
    );
useAlterRecruitersInOrganizationMutation.getKey = () => ['AlterRecruitersInOrganization'];

useAlterRecruitersInOrganizationMutation.fetcher = (client: GraphQLClient, variables: AlterRecruitersInOrganizationMutationVariables, headers?: RequestInit['headers']) => fetcher<AlterRecruitersInOrganizationMutation, AlterRecruitersInOrganizationMutationVariables>(client, AlterRecruitersInOrganizationDocument, variables, headers);
export const PublishJobDocument = `
    mutation PublishJob($JobInput: JobInput!) {
  publishJob(JobInput: $JobInput) {
    name
    description
  }
}
    `;
export const usePublishJobMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<PublishJobMutation, TError, PublishJobMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<PublishJobMutation, TError, PublishJobMutationVariables, TContext>(
      ['PublishJob'],
      (variables?: PublishJobMutationVariables) => fetcher<PublishJobMutation, PublishJobMutationVariables>(client, PublishJobDocument, variables, headers)(),
      options
    );
usePublishJobMutation.getKey = () => ['PublishJob'];

usePublishJobMutation.fetcher = (client: GraphQLClient, variables: PublishJobMutationVariables, headers?: RequestInit['headers']) => fetcher<PublishJobMutation, PublishJobMutationVariables>(client, PublishJobDocument, variables, headers);
export const UpdateApplicationDocument = `
    mutation updateApplication($ApplicationInput: ApplicationInput!) {
  updateApplication(ApplicationInput: $ApplicationInput) {
    id
    processSteps {
      id
      processStep {
        id
        order
        step {
          title
          description
        }
      }
      registeredAt
    }
  }
}
    `;
export const useUpdateApplicationMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<UpdateApplicationMutation, TError, UpdateApplicationMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<UpdateApplicationMutation, TError, UpdateApplicationMutationVariables, TContext>(
      ['updateApplication'],
      (variables?: UpdateApplicationMutationVariables) => fetcher<UpdateApplicationMutation, UpdateApplicationMutationVariables>(client, UpdateApplicationDocument, variables, headers)(),
      options
    );
useUpdateApplicationMutation.getKey = () => ['updateApplication'];

useUpdateApplicationMutation.fetcher = (client: GraphQLClient, variables: UpdateApplicationMutationVariables, headers?: RequestInit['headers']) => fetcher<UpdateApplicationMutation, UpdateApplicationMutationVariables>(client, UpdateApplicationDocument, variables, headers);
export const AddMessageToApplicationChatDocument = `
    mutation AddMessageToApplicationChat($MessageInput: MessageInput!, $applicationId: Long!) {
  addMessageToApplicationChat(
    MessageInput: $MessageInput
    applicationId: $applicationId
  ) {
    id
  }
}
    `;
export const useAddMessageToApplicationChatMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<AddMessageToApplicationChatMutation, TError, AddMessageToApplicationChatMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<AddMessageToApplicationChatMutation, TError, AddMessageToApplicationChatMutationVariables, TContext>(
      ['AddMessageToApplicationChat'],
      (variables?: AddMessageToApplicationChatMutationVariables) => fetcher<AddMessageToApplicationChatMutation, AddMessageToApplicationChatMutationVariables>(client, AddMessageToApplicationChatDocument, variables, headers)(),
      options
    );
useAddMessageToApplicationChatMutation.getKey = () => ['AddMessageToApplicationChat'];

useAddMessageToApplicationChatMutation.fetcher = (client: GraphQLClient, variables: AddMessageToApplicationChatMutationVariables, headers?: RequestInit['headers']) => fetcher<AddMessageToApplicationChatMutation, AddMessageToApplicationChatMutationVariables>(client, AddMessageToApplicationChatDocument, variables, headers);
export const CreateChatDocument = `
    mutation CreateChat($ChatInput: ChatInput!) {
  createChat(ChatInput: $ChatInput) {
    id
    messages {
      id
      content
      sender {
        id
        username
        userProfile {
          photography
        }
      }
      deliveredAt
    }
  }
}
    `;
export const useCreateChatMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<CreateChatMutation, TError, CreateChatMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<CreateChatMutation, TError, CreateChatMutationVariables, TContext>(
      ['CreateChat'],
      (variables?: CreateChatMutationVariables) => fetcher<CreateChatMutation, CreateChatMutationVariables>(client, CreateChatDocument, variables, headers)(),
      options
    );
useCreateChatMutation.getKey = () => ['CreateChat'];

useCreateChatMutation.fetcher = (client: GraphQLClient, variables: CreateChatMutationVariables, headers?: RequestInit['headers']) => fetcher<CreateChatMutation, CreateChatMutationVariables>(client, CreateChatDocument, variables, headers);
export const AddMessageToChatDocument = `
    mutation AddMessageToChat($MessageInput: MessageInput!) {
  addMessageToChat(MessageInput: $MessageInput) {
    id
    latestMessage {
      id
      content
      sender {
        id
        username
        userProfile {
          photography
        }
      }
      deliveredAt
    }
  }
}
    `;
export const useAddMessageToChatMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<AddMessageToChatMutation, TError, AddMessageToChatMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<AddMessageToChatMutation, TError, AddMessageToChatMutationVariables, TContext>(
      ['AddMessageToChat'],
      (variables?: AddMessageToChatMutationVariables) => fetcher<AddMessageToChatMutation, AddMessageToChatMutationVariables>(client, AddMessageToChatDocument, variables, headers)(),
      options
    );
useAddMessageToChatMutation.getKey = () => ['AddMessageToChat'];

useAddMessageToChatMutation.fetcher = (client: GraphQLClient, variables: AddMessageToChatMutationVariables, headers?: RequestInit['headers']) => fetcher<AddMessageToChatMutation, AddMessageToChatMutationVariables>(client, AddMessageToChatDocument, variables, headers);
export const MarkAllMessagesAsSeenDocument = `
    mutation MarkAllMessagesAsSeen($chatId: Long!, $userId: Long!) {
  markAllMessagesAsSeen(chatId: $chatId, userId: $userId) {
    id
    messages {
      id
      deliveredAt
      seenBy {
        user {
          id
        }
        seenAt
      }
    }
  }
}
    `;
export const useMarkAllMessagesAsSeenMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<MarkAllMessagesAsSeenMutation, TError, MarkAllMessagesAsSeenMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<MarkAllMessagesAsSeenMutation, TError, MarkAllMessagesAsSeenMutationVariables, TContext>(
      ['MarkAllMessagesAsSeen'],
      (variables?: MarkAllMessagesAsSeenMutationVariables) => fetcher<MarkAllMessagesAsSeenMutation, MarkAllMessagesAsSeenMutationVariables>(client, MarkAllMessagesAsSeenDocument, variables, headers)(),
      options
    );
useMarkAllMessagesAsSeenMutation.getKey = () => ['MarkAllMessagesAsSeen'];

useMarkAllMessagesAsSeenMutation.fetcher = (client: GraphQLClient, variables: MarkAllMessagesAsSeenMutationVariables, headers?: RequestInit['headers']) => fetcher<MarkAllMessagesAsSeenMutation, MarkAllMessagesAsSeenMutationVariables>(client, MarkAllMessagesAsSeenDocument, variables, headers);
export const UpdateChatDocument = `
    mutation UpdateChat($ChatInput: ChatInput!) {
  updateChat(ChatInput: $ChatInput) {
    id
  }
}
    `;
export const useUpdateChatMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<UpdateChatMutation, TError, UpdateChatMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<UpdateChatMutation, TError, UpdateChatMutationVariables, TContext>(
      ['UpdateChat'],
      (variables?: UpdateChatMutationVariables) => fetcher<UpdateChatMutation, UpdateChatMutationVariables>(client, UpdateChatDocument, variables, headers)(),
      options
    );
useUpdateChatMutation.getKey = () => ['UpdateChat'];

useUpdateChatMutation.fetcher = (client: GraphQLClient, variables: UpdateChatMutationVariables, headers?: RequestInit['headers']) => fetcher<UpdateChatMutation, UpdateChatMutationVariables>(client, UpdateChatDocument, variables, headers);
export const UpdateProcessForOrganizationIdDocument = `
    mutation UpdateProcessForOrganizationId($processInput: ProcessInputCreate!, $organizationId: Long!) {
  updateProcessForOrganizationId(
    processInput: $processInput
    organizationId: $organizationId
  ) {
    id
    name
    description
    processSteps {
      id
      step {
        id
        title
        description
      }
      status
      order
    }
  }
}
    `;
export const useUpdateProcessForOrganizationIdMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<UpdateProcessForOrganizationIdMutation, TError, UpdateProcessForOrganizationIdMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<UpdateProcessForOrganizationIdMutation, TError, UpdateProcessForOrganizationIdMutationVariables, TContext>(
      ['UpdateProcessForOrganizationId'],
      (variables?: UpdateProcessForOrganizationIdMutationVariables) => fetcher<UpdateProcessForOrganizationIdMutation, UpdateProcessForOrganizationIdMutationVariables>(client, UpdateProcessForOrganizationIdDocument, variables, headers)(),
      options
    );
useUpdateProcessForOrganizationIdMutation.getKey = () => ['UpdateProcessForOrganizationId'];

useUpdateProcessForOrganizationIdMutation.fetcher = (client: GraphQLClient, variables: UpdateProcessForOrganizationIdMutationVariables, headers?: RequestInit['headers']) => fetcher<UpdateProcessForOrganizationIdMutation, UpdateProcessForOrganizationIdMutationVariables>(client, UpdateProcessForOrganizationIdDocument, variables, headers);
export const CreateStepDocument = `
    mutation createStep($stepInput: StepInput!) {
  createStep(stepInput: $stepInput) {
    id
    title
    description
  }
}
    `;
export const useCreateStepMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<CreateStepMutation, TError, CreateStepMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<CreateStepMutation, TError, CreateStepMutationVariables, TContext>(
      ['createStep'],
      (variables?: CreateStepMutationVariables) => fetcher<CreateStepMutation, CreateStepMutationVariables>(client, CreateStepDocument, variables, headers)(),
      options
    );
useCreateStepMutation.getKey = () => ['createStep'];

useCreateStepMutation.fetcher = (client: GraphQLClient, variables: CreateStepMutationVariables, headers?: RequestInit['headers']) => fetcher<CreateStepMutation, CreateStepMutationVariables>(client, CreateStepDocument, variables, headers);
export const CreateConnectionRequestDocument = `
    mutation CreateConnectionRequest($connectionCreateInput: ConnectionCreateInput!) {
  createConnection(connectionCreateInput: $connectionCreateInput) {
    id
    requester {
      id
      displayName
      firstName
      lastName
      userProfile {
        photography
        profileTitle
      }
    }
    addressed {
      id
    }
    connectionStatus
  }
}
    `;
export const useCreateConnectionRequestMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<CreateConnectionRequestMutation, TError, CreateConnectionRequestMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<CreateConnectionRequestMutation, TError, CreateConnectionRequestMutationVariables, TContext>(
      ['CreateConnectionRequest'],
      (variables?: CreateConnectionRequestMutationVariables) => fetcher<CreateConnectionRequestMutation, CreateConnectionRequestMutationVariables>(client, CreateConnectionRequestDocument, variables, headers)(),
      options
    );
useCreateConnectionRequestMutation.getKey = () => ['CreateConnectionRequest'];

useCreateConnectionRequestMutation.fetcher = (client: GraphQLClient, variables: CreateConnectionRequestMutationVariables, headers?: RequestInit['headers']) => fetcher<CreateConnectionRequestMutation, CreateConnectionRequestMutationVariables>(client, CreateConnectionRequestDocument, variables, headers);
export const UpdateConnectionDocument = `
    mutation UpdateConnection($connectionRequestInput: ConnectionUpdateInput!) {
  updateConnection(connectionRequestInput: $connectionRequestInput) {
    id
    requester {
      id
      displayName
      firstName
      lastName
      userProfile {
        photography
        profileTitle
      }
    }
    connectionStatus
  }
}
    `;
export const useUpdateConnectionMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<UpdateConnectionMutation, TError, UpdateConnectionMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<UpdateConnectionMutation, TError, UpdateConnectionMutationVariables, TContext>(
      ['UpdateConnection'],
      (variables?: UpdateConnectionMutationVariables) => fetcher<UpdateConnectionMutation, UpdateConnectionMutationVariables>(client, UpdateConnectionDocument, variables, headers)(),
      options
    );
useUpdateConnectionMutation.getKey = () => ['UpdateConnection'];

useUpdateConnectionMutation.fetcher = (client: GraphQLClient, variables: UpdateConnectionMutationVariables, headers?: RequestInit['headers']) => fetcher<UpdateConnectionMutation, UpdateConnectionMutationVariables>(client, UpdateConnectionDocument, variables, headers);
export const RemoveConnectionDocument = `
    mutation RemoveConnection($connectionId: Long!) {
  removeConnection(connectionId: $connectionId) {
    id
    connectionStatus
  }
}
    `;
export const useRemoveConnectionMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<RemoveConnectionMutation, TError, RemoveConnectionMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<RemoveConnectionMutation, TError, RemoveConnectionMutationVariables, TContext>(
      ['RemoveConnection'],
      (variables?: RemoveConnectionMutationVariables) => fetcher<RemoveConnectionMutation, RemoveConnectionMutationVariables>(client, RemoveConnectionDocument, variables, headers)(),
      options
    );
useRemoveConnectionMutation.getKey = () => ['RemoveConnection'];

useRemoveConnectionMutation.fetcher = (client: GraphQLClient, variables: RemoveConnectionMutationVariables, headers?: RequestInit['headers']) => fetcher<RemoveConnectionMutation, RemoveConnectionMutationVariables>(client, RemoveConnectionDocument, variables, headers);
export const RemoveChatDocument = `
    mutation RemoveChat($chatId: Long!) {
  removeChat(chatId: $chatId) {
    id
  }
}
    `;
export const useRemoveChatMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<RemoveChatMutation, TError, RemoveChatMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<RemoveChatMutation, TError, RemoveChatMutationVariables, TContext>(
      ['RemoveChat'],
      (variables?: RemoveChatMutationVariables) => fetcher<RemoveChatMutation, RemoveChatMutationVariables>(client, RemoveChatDocument, variables, headers)(),
      options
    );
useRemoveChatMutation.getKey = () => ['RemoveChat'];

useRemoveChatMutation.fetcher = (client: GraphQLClient, variables: RemoveChatMutationVariables, headers?: RequestInit['headers']) => fetcher<RemoveChatMutation, RemoveChatMutationVariables>(client, RemoveChatDocument, variables, headers);
export const RemoveUserProfileStudyDocument = `
    mutation RemoveUserProfileStudy($studyId: Long!) {
  removeUserProfileStudy(studyId: $studyId) {
    id
  }
}
    `;
export const useRemoveUserProfileStudyMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<RemoveUserProfileStudyMutation, TError, RemoveUserProfileStudyMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<RemoveUserProfileStudyMutation, TError, RemoveUserProfileStudyMutationVariables, TContext>(
      ['RemoveUserProfileStudy'],
      (variables?: RemoveUserProfileStudyMutationVariables) => fetcher<RemoveUserProfileStudyMutation, RemoveUserProfileStudyMutationVariables>(client, RemoveUserProfileStudyDocument, variables, headers)(),
      options
    );
useRemoveUserProfileStudyMutation.getKey = () => ['RemoveUserProfileStudy'];

useRemoveUserProfileStudyMutation.fetcher = (client: GraphQLClient, variables: RemoveUserProfileStudyMutationVariables, headers?: RequestInit['headers']) => fetcher<RemoveUserProfileStudyMutation, RemoveUserProfileStudyMutationVariables>(client, RemoveUserProfileStudyDocument, variables, headers);
export const RemoveUserProfileExperienceDocument = `
    mutation RemoveUserProfileExperience($experienceId: Long!) {
  removeUserProfileExperience(experienceId: $experienceId) {
    id
  }
}
    `;
export const useRemoveUserProfileExperienceMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient,
      options?: UseMutationOptions<RemoveUserProfileExperienceMutation, TError, RemoveUserProfileExperienceMutationVariables, TContext>,
      headers?: RequestInit['headers']
    ) =>
    useMutation<RemoveUserProfileExperienceMutation, TError, RemoveUserProfileExperienceMutationVariables, TContext>(
      ['RemoveUserProfileExperience'],
      (variables?: RemoveUserProfileExperienceMutationVariables) => fetcher<RemoveUserProfileExperienceMutation, RemoveUserProfileExperienceMutationVariables>(client, RemoveUserProfileExperienceDocument, variables, headers)(),
      options
    );
useRemoveUserProfileExperienceMutation.getKey = () => ['RemoveUserProfileExperience'];

useRemoveUserProfileExperienceMutation.fetcher = (client: GraphQLClient, variables: RemoveUserProfileExperienceMutationVariables, headers?: RequestInit['headers']) => fetcher<RemoveUserProfileExperienceMutation, RemoveUserProfileExperienceMutationVariables>(client, RemoveUserProfileExperienceDocument, variables, headers);
export const GetCurrentUserDocument = `
    query GetCurrentUser {
  getCurrentUser {
    id
    firstName
    lastName
    username
  }
}
    `;
export const useGetCurrentUserQuery = <
      TData = GetCurrentUserQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetCurrentUserQueryVariables,
      options?: UseQueryOptions<GetCurrentUserQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetCurrentUserQuery, TError, TData>(
      variables === undefined ? ['GetCurrentUser'] : ['GetCurrentUser', variables],
      fetcher<GetCurrentUserQuery, GetCurrentUserQueryVariables>(client, GetCurrentUserDocument, variables, headers),
      options
    );
useGetCurrentUserQuery.document = GetCurrentUserDocument;


useGetCurrentUserQuery.getKey = (variables?: GetCurrentUserQueryVariables) => variables === undefined ? ['GetCurrentUser'] : ['GetCurrentUser', variables];
;

export const useInfiniteGetCurrentUserQuery = <
      TData = GetCurrentUserQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetCurrentUserQueryVariables,
      client: GraphQLClient,
      variables?: GetCurrentUserQueryVariables,
      options?: UseInfiniteQueryOptions<GetCurrentUserQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetCurrentUserQuery, TError, TData>(
      variables === undefined ? ['GetCurrentUser.infinite'] : ['GetCurrentUser.infinite', variables],
      (metaData) => fetcher<GetCurrentUserQuery, GetCurrentUserQueryVariables>(client, GetCurrentUserDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetCurrentUserQuery.getKey = (variables?: GetCurrentUserQueryVariables) => variables === undefined ? ['GetCurrentUser.infinite'] : ['GetCurrentUser.infinite', variables];
;

useGetCurrentUserQuery.fetcher = (client: GraphQLClient, variables?: GetCurrentUserQueryVariables, headers?: RequestInit['headers']) => fetcher<GetCurrentUserQuery, GetCurrentUserQueryVariables>(client, GetCurrentUserDocument, variables, headers);
export const GetAllJobListingsDocument = `
    query GetAllJobListings($searchQuery: SearchQueryInput) {
  getAllJobListings(searchQuery: $searchQuery) {
    list {
      id
      title
      description
      formattedDescription
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
        slugName
        activitySector {
          id
          name
        }
        photography
        description
      }
      category {
        id
        name
      }
      applications {
        id
        dateOfApplication
      }
      recruiter {
        id
        user {
          id
          firstName
          lastName
          username
          userProfile {
            id
            profileSlugUrl
            photography
            profileTitle
          }
        }
      }
      workType
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
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllJobListingsQuery, TError, TData>(
      variables === undefined ? ['GetAllJobListings'] : ['GetAllJobListings', variables],
      fetcher<GetAllJobListingsQuery, GetAllJobListingsQueryVariables>(client, GetAllJobListingsDocument, variables, headers),
      options
    );
useGetAllJobListingsQuery.document = GetAllJobListingsDocument;


useGetAllJobListingsQuery.getKey = (variables?: GetAllJobListingsQueryVariables) => variables === undefined ? ['GetAllJobListings'] : ['GetAllJobListings', variables];
;

export const useInfiniteGetAllJobListingsQuery = <
      TData = GetAllJobListingsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllJobListingsQueryVariables,
      client: GraphQLClient,
      variables?: GetAllJobListingsQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllJobListingsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllJobListingsQuery, TError, TData>(
      variables === undefined ? ['GetAllJobListings.infinite'] : ['GetAllJobListings.infinite', variables],
      (metaData) => fetcher<GetAllJobListingsQuery, GetAllJobListingsQueryVariables>(client, GetAllJobListingsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllJobListingsQuery.getKey = (variables?: GetAllJobListingsQueryVariables) => variables === undefined ? ['GetAllJobListings.infinite'] : ['GetAllJobListings.infinite', variables];
;

useGetAllJobListingsQuery.fetcher = (client: GraphQLClient, variables?: GetAllJobListingsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllJobListingsQuery, GetAllJobListingsQueryVariables>(client, GetAllJobListingsDocument, variables, headers);
export const GetUserProfileDocument = `
    query GetUserProfile($profileSlugUrl: String) {
  getUserProfile(profileSlugUrl: $profileSlugUrl) {
    id
    user {
      firstName
      lastName
      username
    }
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
        activitySector {
          id
          name
        }
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
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetUserProfileQuery, TError, TData>(
      variables === undefined ? ['GetUserProfile'] : ['GetUserProfile', variables],
      fetcher<GetUserProfileQuery, GetUserProfileQueryVariables>(client, GetUserProfileDocument, variables, headers),
      options
    );
useGetUserProfileQuery.document = GetUserProfileDocument;


useGetUserProfileQuery.getKey = (variables?: GetUserProfileQueryVariables) => variables === undefined ? ['GetUserProfile'] : ['GetUserProfile', variables];
;

export const useInfiniteGetUserProfileQuery = <
      TData = GetUserProfileQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetUserProfileQueryVariables,
      client: GraphQLClient,
      variables?: GetUserProfileQueryVariables,
      options?: UseInfiniteQueryOptions<GetUserProfileQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetUserProfileQuery, TError, TData>(
      variables === undefined ? ['GetUserProfile.infinite'] : ['GetUserProfile.infinite', variables],
      (metaData) => fetcher<GetUserProfileQuery, GetUserProfileQueryVariables>(client, GetUserProfileDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetUserProfileQuery.getKey = (variables?: GetUserProfileQueryVariables) => variables === undefined ? ['GetUserProfile.infinite'] : ['GetUserProfile.infinite', variables];
;

useGetUserProfileQuery.fetcher = (client: GraphQLClient, variables?: GetUserProfileQueryVariables, headers?: RequestInit['headers']) => fetcher<GetUserProfileQuery, GetUserProfileQueryVariables>(client, GetUserProfileDocument, variables, headers);
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
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetCountriesCitiesQuery, TError, TData>(
      variables === undefined ? ['GetCountriesCities'] : ['GetCountriesCities', variables],
      fetcher<GetCountriesCitiesQuery, GetCountriesCitiesQueryVariables>(client, GetCountriesCitiesDocument, variables, headers),
      options
    );
useGetCountriesCitiesQuery.document = GetCountriesCitiesDocument;


useGetCountriesCitiesQuery.getKey = (variables?: GetCountriesCitiesQueryVariables) => variables === undefined ? ['GetCountriesCities'] : ['GetCountriesCities', variables];
;

export const useInfiniteGetCountriesCitiesQuery = <
      TData = GetCountriesCitiesQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetCountriesCitiesQueryVariables,
      client: GraphQLClient,
      variables?: GetCountriesCitiesQueryVariables,
      options?: UseInfiniteQueryOptions<GetCountriesCitiesQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetCountriesCitiesQuery, TError, TData>(
      variables === undefined ? ['GetCountriesCities.infinite'] : ['GetCountriesCities.infinite', variables],
      (metaData) => fetcher<GetCountriesCitiesQuery, GetCountriesCitiesQueryVariables>(client, GetCountriesCitiesDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetCountriesCitiesQuery.getKey = (variables?: GetCountriesCitiesQueryVariables) => variables === undefined ? ['GetCountriesCities.infinite'] : ['GetCountriesCities.infinite', variables];
;

useGetCountriesCitiesQuery.fetcher = (client: GraphQLClient, variables?: GetCountriesCitiesQueryVariables, headers?: RequestInit['headers']) => fetcher<GetCountriesCitiesQuery, GetCountriesCitiesQueryVariables>(client, GetCountriesCitiesDocument, variables, headers);
export const GetAllOrganizationsDocument = `
    query getAllOrganizations {
  getAllOrganizations {
    id
    name
    slugName
    description
    companySize
    foundedAt
    headQuarters {
      id
      name
      country {
        code
        name
      }
    }
    slogan
    activitySector {
      id
      name
    }
    photography
    recruitmentProcess {
      id
    }
    locations {
      id
      name
      country {
        code
        name
      }
    }
    webSite
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
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllOrganizationsQuery, TError, TData>(
      variables === undefined ? ['getAllOrganizations'] : ['getAllOrganizations', variables],
      fetcher<GetAllOrganizationsQuery, GetAllOrganizationsQueryVariables>(client, GetAllOrganizationsDocument, variables, headers),
      options
    );
useGetAllOrganizationsQuery.document = GetAllOrganizationsDocument;


useGetAllOrganizationsQuery.getKey = (variables?: GetAllOrganizationsQueryVariables) => variables === undefined ? ['getAllOrganizations'] : ['getAllOrganizations', variables];
;

export const useInfiniteGetAllOrganizationsQuery = <
      TData = GetAllOrganizationsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllOrganizationsQueryVariables,
      client: GraphQLClient,
      variables?: GetAllOrganizationsQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllOrganizationsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllOrganizationsQuery, TError, TData>(
      variables === undefined ? ['getAllOrganizations.infinite'] : ['getAllOrganizations.infinite', variables],
      (metaData) => fetcher<GetAllOrganizationsQuery, GetAllOrganizationsQueryVariables>(client, GetAllOrganizationsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllOrganizationsQuery.getKey = (variables?: GetAllOrganizationsQueryVariables) => variables === undefined ? ['getAllOrganizations.infinite'] : ['getAllOrganizations.infinite', variables];
;

useGetAllOrganizationsQuery.fetcher = (client: GraphQLClient, variables?: GetAllOrganizationsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllOrganizationsQuery, GetAllOrganizationsQueryVariables>(client, GetAllOrganizationsDocument, variables, headers);
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
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllActivitySectorsQuery, TError, TData>(
      variables === undefined ? ['getAllActivitySectors'] : ['getAllActivitySectors', variables],
      fetcher<GetAllActivitySectorsQuery, GetAllActivitySectorsQueryVariables>(client, GetAllActivitySectorsDocument, variables, headers),
      options
    );
useGetAllActivitySectorsQuery.document = GetAllActivitySectorsDocument;


useGetAllActivitySectorsQuery.getKey = (variables?: GetAllActivitySectorsQueryVariables) => variables === undefined ? ['getAllActivitySectors'] : ['getAllActivitySectors', variables];
;

export const useInfiniteGetAllActivitySectorsQuery = <
      TData = GetAllActivitySectorsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllActivitySectorsQueryVariables,
      client: GraphQLClient,
      variables?: GetAllActivitySectorsQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllActivitySectorsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllActivitySectorsQuery, TError, TData>(
      variables === undefined ? ['getAllActivitySectors.infinite'] : ['getAllActivitySectors.infinite', variables],
      (metaData) => fetcher<GetAllActivitySectorsQuery, GetAllActivitySectorsQueryVariables>(client, GetAllActivitySectorsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllActivitySectorsQuery.getKey = (variables?: GetAllActivitySectorsQueryVariables) => variables === undefined ? ['getAllActivitySectors.infinite'] : ['getAllActivitySectors.infinite', variables];
;

useGetAllActivitySectorsQuery.fetcher = (client: GraphQLClient, variables?: GetAllActivitySectorsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllActivitySectorsQuery, GetAllActivitySectorsQueryVariables>(client, GetAllActivitySectorsDocument, variables, headers);
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
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllInstitutionsQuery, TError, TData>(
      variables === undefined ? ['getAllInstitutions'] : ['getAllInstitutions', variables],
      fetcher<GetAllInstitutionsQuery, GetAllInstitutionsQueryVariables>(client, GetAllInstitutionsDocument, variables, headers),
      options
    );
useGetAllInstitutionsQuery.document = GetAllInstitutionsDocument;


useGetAllInstitutionsQuery.getKey = (variables?: GetAllInstitutionsQueryVariables) => variables === undefined ? ['getAllInstitutions'] : ['getAllInstitutions', variables];
;

export const useInfiniteGetAllInstitutionsQuery = <
      TData = GetAllInstitutionsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllInstitutionsQueryVariables,
      client: GraphQLClient,
      variables?: GetAllInstitutionsQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllInstitutionsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllInstitutionsQuery, TError, TData>(
      variables === undefined ? ['getAllInstitutions.infinite'] : ['getAllInstitutions.infinite', variables],
      (metaData) => fetcher<GetAllInstitutionsQuery, GetAllInstitutionsQueryVariables>(client, GetAllInstitutionsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllInstitutionsQuery.getKey = (variables?: GetAllInstitutionsQueryVariables) => variables === undefined ? ['getAllInstitutions.infinite'] : ['getAllInstitutions.infinite', variables];
;

useGetAllInstitutionsQuery.fetcher = (client: GraphQLClient, variables?: GetAllInstitutionsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllInstitutionsQuery, GetAllInstitutionsQueryVariables>(client, GetAllInstitutionsDocument, variables, headers);
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
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllDomainsQuery, TError, TData>(
      variables === undefined ? ['getAllDomains'] : ['getAllDomains', variables],
      fetcher<GetAllDomainsQuery, GetAllDomainsQueryVariables>(client, GetAllDomainsDocument, variables, headers),
      options
    );
useGetAllDomainsQuery.document = GetAllDomainsDocument;


useGetAllDomainsQuery.getKey = (variables?: GetAllDomainsQueryVariables) => variables === undefined ? ['getAllDomains'] : ['getAllDomains', variables];
;

export const useInfiniteGetAllDomainsQuery = <
      TData = GetAllDomainsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllDomainsQueryVariables,
      client: GraphQLClient,
      variables?: GetAllDomainsQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllDomainsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllDomainsQuery, TError, TData>(
      variables === undefined ? ['getAllDomains.infinite'] : ['getAllDomains.infinite', variables],
      (metaData) => fetcher<GetAllDomainsQuery, GetAllDomainsQueryVariables>(client, GetAllDomainsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllDomainsQuery.getKey = (variables?: GetAllDomainsQueryVariables) => variables === undefined ? ['getAllDomains.infinite'] : ['getAllDomains.infinite', variables];
;

useGetAllDomainsQuery.fetcher = (client: GraphQLClient, variables?: GetAllDomainsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllDomainsQuery, GetAllDomainsQueryVariables>(client, GetAllDomainsDocument, variables, headers);
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
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllCertificationsQuery, TError, TData>(
      variables === undefined ? ['getAllCertifications'] : ['getAllCertifications', variables],
      fetcher<GetAllCertificationsQuery, GetAllCertificationsQueryVariables>(client, GetAllCertificationsDocument, variables, headers),
      options
    );
useGetAllCertificationsQuery.document = GetAllCertificationsDocument;


useGetAllCertificationsQuery.getKey = (variables?: GetAllCertificationsQueryVariables) => variables === undefined ? ['getAllCertifications'] : ['getAllCertifications', variables];
;

export const useInfiniteGetAllCertificationsQuery = <
      TData = GetAllCertificationsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllCertificationsQueryVariables,
      client: GraphQLClient,
      variables?: GetAllCertificationsQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllCertificationsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllCertificationsQuery, TError, TData>(
      variables === undefined ? ['getAllCertifications.infinite'] : ['getAllCertifications.infinite', variables],
      (metaData) => fetcher<GetAllCertificationsQuery, GetAllCertificationsQueryVariables>(client, GetAllCertificationsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllCertificationsQuery.getKey = (variables?: GetAllCertificationsQueryVariables) => variables === undefined ? ['getAllCertifications.infinite'] : ['getAllCertifications.infinite', variables];
;

useGetAllCertificationsQuery.fetcher = (client: GraphQLClient, variables?: GetAllCertificationsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllCertificationsQuery, GetAllCertificationsQueryVariables>(client, GetAllCertificationsDocument, variables, headers);
export const GetAllJobCategoriesDocument = `
    query getAllJobCategories {
  getAllJobCategories {
    id
    name
  }
}
    `;
export const useGetAllJobCategoriesQuery = <
      TData = GetAllJobCategoriesQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetAllJobCategoriesQueryVariables,
      options?: UseQueryOptions<GetAllJobCategoriesQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllJobCategoriesQuery, TError, TData>(
      variables === undefined ? ['getAllJobCategories'] : ['getAllJobCategories', variables],
      fetcher<GetAllJobCategoriesQuery, GetAllJobCategoriesQueryVariables>(client, GetAllJobCategoriesDocument, variables, headers),
      options
    );
useGetAllJobCategoriesQuery.document = GetAllJobCategoriesDocument;


useGetAllJobCategoriesQuery.getKey = (variables?: GetAllJobCategoriesQueryVariables) => variables === undefined ? ['getAllJobCategories'] : ['getAllJobCategories', variables];
;

export const useInfiniteGetAllJobCategoriesQuery = <
      TData = GetAllJobCategoriesQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllJobCategoriesQueryVariables,
      client: GraphQLClient,
      variables?: GetAllJobCategoriesQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllJobCategoriesQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllJobCategoriesQuery, TError, TData>(
      variables === undefined ? ['getAllJobCategories.infinite'] : ['getAllJobCategories.infinite', variables],
      (metaData) => fetcher<GetAllJobCategoriesQuery, GetAllJobCategoriesQueryVariables>(client, GetAllJobCategoriesDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllJobCategoriesQuery.getKey = (variables?: GetAllJobCategoriesQueryVariables) => variables === undefined ? ['getAllJobCategories.infinite'] : ['getAllJobCategories.infinite', variables];
;

useGetAllJobCategoriesQuery.fetcher = (client: GraphQLClient, variables?: GetAllJobCategoriesQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllJobCategoriesQuery, GetAllJobCategoriesQueryVariables>(client, GetAllJobCategoriesDocument, variables, headers);
export const GetAllJobsDocument = `
    query getAllJobs {
  getAllJobs {
    id
    name
    description
  }
}
    `;
export const useGetAllJobsQuery = <
      TData = GetAllJobsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetAllJobsQueryVariables,
      options?: UseQueryOptions<GetAllJobsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllJobsQuery, TError, TData>(
      variables === undefined ? ['getAllJobs'] : ['getAllJobs', variables],
      fetcher<GetAllJobsQuery, GetAllJobsQueryVariables>(client, GetAllJobsDocument, variables, headers),
      options
    );
useGetAllJobsQuery.document = GetAllJobsDocument;


useGetAllJobsQuery.getKey = (variables?: GetAllJobsQueryVariables) => variables === undefined ? ['getAllJobs'] : ['getAllJobs', variables];
;

export const useInfiniteGetAllJobsQuery = <
      TData = GetAllJobsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllJobsQueryVariables,
      client: GraphQLClient,
      variables?: GetAllJobsQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllJobsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllJobsQuery, TError, TData>(
      variables === undefined ? ['getAllJobs.infinite'] : ['getAllJobs.infinite', variables],
      (metaData) => fetcher<GetAllJobsQuery, GetAllJobsQueryVariables>(client, GetAllJobsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllJobsQuery.getKey = (variables?: GetAllJobsQueryVariables) => variables === undefined ? ['getAllJobs.infinite'] : ['getAllJobs.infinite', variables];
;

useGetAllJobsQuery.fetcher = (client: GraphQLClient, variables?: GetAllJobsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllJobsQuery, GetAllJobsQueryVariables>(client, GetAllJobsDocument, variables, headers);
export const GetOrganizationByIdDocument = `
    query GetOrganizationById($organizationId: Long!) {
  getOrganizationById(organizationId: $organizationId) {
    id
    name
    slugName
    companySize
    foundedAt
    headQuarters {
      id
      name
      country {
        code
        name
      }
    }
    slogan
    description
    activitySector {
      id
      name
    }
    photography
    description
    recruitmentProcess {
      id
    }
  }
}
    `;
export const useGetOrganizationByIdQuery = <
      TData = GetOrganizationByIdQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetOrganizationByIdQueryVariables,
      options?: UseQueryOptions<GetOrganizationByIdQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetOrganizationByIdQuery, TError, TData>(
      ['GetOrganizationById', variables],
      fetcher<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>(client, GetOrganizationByIdDocument, variables, headers),
      options
    );
useGetOrganizationByIdQuery.document = GetOrganizationByIdDocument;


useGetOrganizationByIdQuery.getKey = (variables: GetOrganizationByIdQueryVariables) => ['GetOrganizationById', variables];
;

export const useInfiniteGetOrganizationByIdQuery = <
      TData = GetOrganizationByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetOrganizationByIdQueryVariables,
      client: GraphQLClient,
      variables: GetOrganizationByIdQueryVariables,
      options?: UseInfiniteQueryOptions<GetOrganizationByIdQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetOrganizationByIdQuery, TError, TData>(
      ['GetOrganizationById.infinite', variables],
      (metaData) => fetcher<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>(client, GetOrganizationByIdDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetOrganizationByIdQuery.getKey = (variables: GetOrganizationByIdQueryVariables) => ['GetOrganizationById.infinite', variables];
;

useGetOrganizationByIdQuery.fetcher = (client: GraphQLClient, variables: GetOrganizationByIdQueryVariables, headers?: RequestInit['headers']) => fetcher<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>(client, GetOrganizationByIdDocument, variables, headers);
export const GetOrganizationBySlugNameDocument = `
    query GetOrganizationBySlugName($slugName: String!) {
  getOrganizationBySlugName(slugName: $slugName) {
    id
    name
    slugName
    companySize
    foundedAt
    headQuarters {
      id
      name
      country {
        code
        name
      }
    }
    slogan
    description
    activitySector {
      id
      name
    }
    photography
    description
    recruitmentProcess {
      id
    }
    webSite
    specializations
    locations {
      id
      name
      country {
        code
        name
      }
      longitude
      latitude
    }
    recruiters {
      id
      user {
        firstName
        lastName
        userProfile {
          photography
          profileTitle
        }
      }
    }
  }
}
    `;
export const useGetOrganizationBySlugNameQuery = <
      TData = GetOrganizationBySlugNameQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetOrganizationBySlugNameQueryVariables,
      options?: UseQueryOptions<GetOrganizationBySlugNameQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetOrganizationBySlugNameQuery, TError, TData>(
      ['GetOrganizationBySlugName', variables],
      fetcher<GetOrganizationBySlugNameQuery, GetOrganizationBySlugNameQueryVariables>(client, GetOrganizationBySlugNameDocument, variables, headers),
      options
    );
useGetOrganizationBySlugNameQuery.document = GetOrganizationBySlugNameDocument;


useGetOrganizationBySlugNameQuery.getKey = (variables: GetOrganizationBySlugNameQueryVariables) => ['GetOrganizationBySlugName', variables];
;

export const useInfiniteGetOrganizationBySlugNameQuery = <
      TData = GetOrganizationBySlugNameQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetOrganizationBySlugNameQueryVariables,
      client: GraphQLClient,
      variables: GetOrganizationBySlugNameQueryVariables,
      options?: UseInfiniteQueryOptions<GetOrganizationBySlugNameQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetOrganizationBySlugNameQuery, TError, TData>(
      ['GetOrganizationBySlugName.infinite', variables],
      (metaData) => fetcher<GetOrganizationBySlugNameQuery, GetOrganizationBySlugNameQueryVariables>(client, GetOrganizationBySlugNameDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetOrganizationBySlugNameQuery.getKey = (variables: GetOrganizationBySlugNameQueryVariables) => ['GetOrganizationBySlugName.infinite', variables];
;

useGetOrganizationBySlugNameQuery.fetcher = (client: GraphQLClient, variables: GetOrganizationBySlugNameQueryVariables, headers?: RequestInit['headers']) => fetcher<GetOrganizationBySlugNameQuery, GetOrganizationBySlugNameQueryVariables>(client, GetOrganizationBySlugNameDocument, variables, headers);
export const GetRelatedJobListingsDocument = `
    query GetRelatedJobListings($jobName: String!) {
  getRelatedJobListings(jobName: $jobName) {
    id
    title
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
    organization {
      id
      name
      photography
    }
    applications {
      id
      dateOfApplication
    }
  }
}
    `;
export const useGetRelatedJobListingsQuery = <
      TData = GetRelatedJobListingsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetRelatedJobListingsQueryVariables,
      options?: UseQueryOptions<GetRelatedJobListingsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetRelatedJobListingsQuery, TError, TData>(
      ['GetRelatedJobListings', variables],
      fetcher<GetRelatedJobListingsQuery, GetRelatedJobListingsQueryVariables>(client, GetRelatedJobListingsDocument, variables, headers),
      options
    );
useGetRelatedJobListingsQuery.document = GetRelatedJobListingsDocument;


useGetRelatedJobListingsQuery.getKey = (variables: GetRelatedJobListingsQueryVariables) => ['GetRelatedJobListings', variables];
;

export const useInfiniteGetRelatedJobListingsQuery = <
      TData = GetRelatedJobListingsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetRelatedJobListingsQueryVariables,
      client: GraphQLClient,
      variables: GetRelatedJobListingsQueryVariables,
      options?: UseInfiniteQueryOptions<GetRelatedJobListingsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetRelatedJobListingsQuery, TError, TData>(
      ['GetRelatedJobListings.infinite', variables],
      (metaData) => fetcher<GetRelatedJobListingsQuery, GetRelatedJobListingsQueryVariables>(client, GetRelatedJobListingsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetRelatedJobListingsQuery.getKey = (variables: GetRelatedJobListingsQueryVariables) => ['GetRelatedJobListings.infinite', variables];
;

useGetRelatedJobListingsQuery.fetcher = (client: GraphQLClient, variables: GetRelatedJobListingsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetRelatedJobListingsQuery, GetRelatedJobListingsQueryVariables>(client, GetRelatedJobListingsDocument, variables, headers);
export const GetMyApplicationForJobListingDocument = `
    query GetMyApplicationForJobListing($JobListingId: Long!) {
  getMyApplicationForJobListing(JobListingId: $JobListingId) {
    id
    dateOfApplication
    processSteps {
      id
      processStep {
        order
        step {
          title
          description
        }
      }
      registeredAt
    }
    jobListing {
      id
    }
  }
}
    `;
export const useGetMyApplicationForJobListingQuery = <
      TData = GetMyApplicationForJobListingQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetMyApplicationForJobListingQueryVariables,
      options?: UseQueryOptions<GetMyApplicationForJobListingQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetMyApplicationForJobListingQuery, TError, TData>(
      ['GetMyApplicationForJobListing', variables],
      fetcher<GetMyApplicationForJobListingQuery, GetMyApplicationForJobListingQueryVariables>(client, GetMyApplicationForJobListingDocument, variables, headers),
      options
    );
useGetMyApplicationForJobListingQuery.document = GetMyApplicationForJobListingDocument;


useGetMyApplicationForJobListingQuery.getKey = (variables: GetMyApplicationForJobListingQueryVariables) => ['GetMyApplicationForJobListing', variables];
;

export const useInfiniteGetMyApplicationForJobListingQuery = <
      TData = GetMyApplicationForJobListingQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetMyApplicationForJobListingQueryVariables,
      client: GraphQLClient,
      variables: GetMyApplicationForJobListingQueryVariables,
      options?: UseInfiniteQueryOptions<GetMyApplicationForJobListingQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetMyApplicationForJobListingQuery, TError, TData>(
      ['GetMyApplicationForJobListing.infinite', variables],
      (metaData) => fetcher<GetMyApplicationForJobListingQuery, GetMyApplicationForJobListingQueryVariables>(client, GetMyApplicationForJobListingDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetMyApplicationForJobListingQuery.getKey = (variables: GetMyApplicationForJobListingQueryVariables) => ['GetMyApplicationForJobListing.infinite', variables];
;

useGetMyApplicationForJobListingQuery.fetcher = (client: GraphQLClient, variables: GetMyApplicationForJobListingQueryVariables, headers?: RequestInit['headers']) => fetcher<GetMyApplicationForJobListingQuery, GetMyApplicationForJobListingQueryVariables>(client, GetMyApplicationForJobListingDocument, variables, headers);
export const GetApplicationByIdDocument = `
    query GetApplicationById($applicationId: Long!) {
  getApplicationById(applicationId: $applicationId) {
    id
    status
    dateOfApplication
    applicantProfile {
      id
      profileSlugUrl
      profileTitle
      photography
    }
    candidate {
      user {
        id
        firstName
        lastName
        username
        birthDate
        email
      }
    }
    processSteps {
      id
      processStep {
        id
        order
        step {
          title
          description
        }
      }
      registeredAt
    }
    jobListing {
      id
      organization {
        id
        slugName
      }
    }
    applicationDocuments {
      id
      document {
        name
      }
    }
    chat {
      id
    }
  }
}
    `;
export const useGetApplicationByIdQuery = <
      TData = GetApplicationByIdQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetApplicationByIdQueryVariables,
      options?: UseQueryOptions<GetApplicationByIdQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetApplicationByIdQuery, TError, TData>(
      ['GetApplicationById', variables],
      fetcher<GetApplicationByIdQuery, GetApplicationByIdQueryVariables>(client, GetApplicationByIdDocument, variables, headers),
      options
    );
useGetApplicationByIdQuery.document = GetApplicationByIdDocument;


useGetApplicationByIdQuery.getKey = (variables: GetApplicationByIdQueryVariables) => ['GetApplicationById', variables];
;

export const useInfiniteGetApplicationByIdQuery = <
      TData = GetApplicationByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetApplicationByIdQueryVariables,
      client: GraphQLClient,
      variables: GetApplicationByIdQueryVariables,
      options?: UseInfiniteQueryOptions<GetApplicationByIdQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetApplicationByIdQuery, TError, TData>(
      ['GetApplicationById.infinite', variables],
      (metaData) => fetcher<GetApplicationByIdQuery, GetApplicationByIdQueryVariables>(client, GetApplicationByIdDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetApplicationByIdQuery.getKey = (variables: GetApplicationByIdQueryVariables) => ['GetApplicationById.infinite', variables];
;

useGetApplicationByIdQuery.fetcher = (client: GraphQLClient, variables: GetApplicationByIdQueryVariables, headers?: RequestInit['headers']) => fetcher<GetApplicationByIdQuery, GetApplicationByIdQueryVariables>(client, GetApplicationByIdDocument, variables, headers);
export const GetAllApplicationsDocument = `
    query GetAllApplications($searchQuery: SearchQueryInput) {
  getAllApplications(searchQuery: $searchQuery) {
    list {
      id
      dateOfApplication
      status
      applicantProfile {
        id
        profileSlugUrl
        profileTitle
        photography
      }
      candidate {
        user {
          firstName
          lastName
          username
          birthDate
          email
        }
      }
      processSteps {
        processStep {
          id
          step {
            id
            title
          }
        }
        registeredAt
      }
    }
    page
    totalPages
    totalElements
  }
}
    `;
export const useGetAllApplicationsQuery = <
      TData = GetAllApplicationsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetAllApplicationsQueryVariables,
      options?: UseQueryOptions<GetAllApplicationsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllApplicationsQuery, TError, TData>(
      variables === undefined ? ['GetAllApplications'] : ['GetAllApplications', variables],
      fetcher<GetAllApplicationsQuery, GetAllApplicationsQueryVariables>(client, GetAllApplicationsDocument, variables, headers),
      options
    );
useGetAllApplicationsQuery.document = GetAllApplicationsDocument;


useGetAllApplicationsQuery.getKey = (variables?: GetAllApplicationsQueryVariables) => variables === undefined ? ['GetAllApplications'] : ['GetAllApplications', variables];
;

export const useInfiniteGetAllApplicationsQuery = <
      TData = GetAllApplicationsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllApplicationsQueryVariables,
      client: GraphQLClient,
      variables?: GetAllApplicationsQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllApplicationsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllApplicationsQuery, TError, TData>(
      variables === undefined ? ['GetAllApplications.infinite'] : ['GetAllApplications.infinite', variables],
      (metaData) => fetcher<GetAllApplicationsQuery, GetAllApplicationsQueryVariables>(client, GetAllApplicationsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllApplicationsQuery.getKey = (variables?: GetAllApplicationsQueryVariables) => variables === undefined ? ['GetAllApplications.infinite'] : ['GetAllApplications.infinite', variables];
;

useGetAllApplicationsQuery.fetcher = (client: GraphQLClient, variables?: GetAllApplicationsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllApplicationsQuery, GetAllApplicationsQueryVariables>(client, GetAllApplicationsDocument, variables, headers);
export const GetAllProcessesDocument = `
    query GetAllProcesses($searchQuery: SearchQueryInput) {
  getAllProcesses(searchQuery: $searchQuery) {
    list {
      id
      name
      description
      processSteps {
        id
        status
        step {
          id
          title
          description
        }
        order
      }
    }
    page
    totalPages
    totalElements
  }
}
    `;
export const useGetAllProcessesQuery = <
      TData = GetAllProcessesQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetAllProcessesQueryVariables,
      options?: UseQueryOptions<GetAllProcessesQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllProcessesQuery, TError, TData>(
      variables === undefined ? ['GetAllProcesses'] : ['GetAllProcesses', variables],
      fetcher<GetAllProcessesQuery, GetAllProcessesQueryVariables>(client, GetAllProcessesDocument, variables, headers),
      options
    );
useGetAllProcessesQuery.document = GetAllProcessesDocument;


useGetAllProcessesQuery.getKey = (variables?: GetAllProcessesQueryVariables) => variables === undefined ? ['GetAllProcesses'] : ['GetAllProcesses', variables];
;

export const useInfiniteGetAllProcessesQuery = <
      TData = GetAllProcessesQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllProcessesQueryVariables,
      client: GraphQLClient,
      variables?: GetAllProcessesQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllProcessesQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllProcessesQuery, TError, TData>(
      variables === undefined ? ['GetAllProcesses.infinite'] : ['GetAllProcesses.infinite', variables],
      (metaData) => fetcher<GetAllProcessesQuery, GetAllProcessesQueryVariables>(client, GetAllProcessesDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllProcessesQuery.getKey = (variables?: GetAllProcessesQueryVariables) => variables === undefined ? ['GetAllProcesses.infinite'] : ['GetAllProcesses.infinite', variables];
;

useGetAllProcessesQuery.fetcher = (client: GraphQLClient, variables?: GetAllProcessesQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllProcessesQuery, GetAllProcessesQueryVariables>(client, GetAllProcessesDocument, variables, headers);
export const GetAllRecruitersForOrganizationBySlugDocument = `
    query GetAllRecruitersForOrganizationBySlug($organizationSlug: String!) {
  getAllRecruitersForOrganizationBySlug(organizationSlug: $organizationSlug) {
    id
    user {
      firstName
      lastName
      username
      userProfile {
        photography
        profileTitle
      }
    }
  }
}
    `;
export const useGetAllRecruitersForOrganizationBySlugQuery = <
      TData = GetAllRecruitersForOrganizationBySlugQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetAllRecruitersForOrganizationBySlugQueryVariables,
      options?: UseQueryOptions<GetAllRecruitersForOrganizationBySlugQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllRecruitersForOrganizationBySlugQuery, TError, TData>(
      ['GetAllRecruitersForOrganizationBySlug', variables],
      fetcher<GetAllRecruitersForOrganizationBySlugQuery, GetAllRecruitersForOrganizationBySlugQueryVariables>(client, GetAllRecruitersForOrganizationBySlugDocument, variables, headers),
      options
    );
useGetAllRecruitersForOrganizationBySlugQuery.document = GetAllRecruitersForOrganizationBySlugDocument;


useGetAllRecruitersForOrganizationBySlugQuery.getKey = (variables: GetAllRecruitersForOrganizationBySlugQueryVariables) => ['GetAllRecruitersForOrganizationBySlug', variables];
;

export const useInfiniteGetAllRecruitersForOrganizationBySlugQuery = <
      TData = GetAllRecruitersForOrganizationBySlugQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllRecruitersForOrganizationBySlugQueryVariables,
      client: GraphQLClient,
      variables: GetAllRecruitersForOrganizationBySlugQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllRecruitersForOrganizationBySlugQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllRecruitersForOrganizationBySlugQuery, TError, TData>(
      ['GetAllRecruitersForOrganizationBySlug.infinite', variables],
      (metaData) => fetcher<GetAllRecruitersForOrganizationBySlugQuery, GetAllRecruitersForOrganizationBySlugQueryVariables>(client, GetAllRecruitersForOrganizationBySlugDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllRecruitersForOrganizationBySlugQuery.getKey = (variables: GetAllRecruitersForOrganizationBySlugQueryVariables) => ['GetAllRecruitersForOrganizationBySlug.infinite', variables];
;

useGetAllRecruitersForOrganizationBySlugQuery.fetcher = (client: GraphQLClient, variables: GetAllRecruitersForOrganizationBySlugQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllRecruitersForOrganizationBySlugQuery, GetAllRecruitersForOrganizationBySlugQueryVariables>(client, GetAllRecruitersForOrganizationBySlugDocument, variables, headers);
export const GetRecruiterByIdDocument = `
    query GetRecruiterById($recruiterId: Long!) {
  getRecruiterById(recruiterId: $recruiterId) {
    id
    user {
      firstName
      lastName
      email
      username
      birthDate
      userProfile {
        photography
        coverPhotography
        profileTitle
        description
        city {
          name
          country {
            name
          }
        }
      }
    }
    registeredAt
    organization {
      id
      name
      slugName
      activitySector {
        id
        name
      }
      photography
      description
    }
  }
}
    `;
export const useGetRecruiterByIdQuery = <
      TData = GetRecruiterByIdQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetRecruiterByIdQueryVariables,
      options?: UseQueryOptions<GetRecruiterByIdQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetRecruiterByIdQuery, TError, TData>(
      ['GetRecruiterById', variables],
      fetcher<GetRecruiterByIdQuery, GetRecruiterByIdQueryVariables>(client, GetRecruiterByIdDocument, variables, headers),
      options
    );
useGetRecruiterByIdQuery.document = GetRecruiterByIdDocument;


useGetRecruiterByIdQuery.getKey = (variables: GetRecruiterByIdQueryVariables) => ['GetRecruiterById', variables];
;

export const useInfiniteGetRecruiterByIdQuery = <
      TData = GetRecruiterByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetRecruiterByIdQueryVariables,
      client: GraphQLClient,
      variables: GetRecruiterByIdQueryVariables,
      options?: UseInfiniteQueryOptions<GetRecruiterByIdQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetRecruiterByIdQuery, TError, TData>(
      ['GetRecruiterById.infinite', variables],
      (metaData) => fetcher<GetRecruiterByIdQuery, GetRecruiterByIdQueryVariables>(client, GetRecruiterByIdDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetRecruiterByIdQuery.getKey = (variables: GetRecruiterByIdQueryVariables) => ['GetRecruiterById.infinite', variables];
;

useGetRecruiterByIdQuery.fetcher = (client: GraphQLClient, variables: GetRecruiterByIdQueryVariables, headers?: RequestInit['headers']) => fetcher<GetRecruiterByIdQuery, GetRecruiterByIdQueryVariables>(client, GetRecruiterByIdDocument, variables, headers);
export const GetAllUsersDocument = `
    query GetAllUsers {
  getAllUsers {
    id
    firstName
    lastName
    userProfile {
      photography
      profileTitle
    }
  }
}
    `;
export const useGetAllUsersQuery = <
      TData = GetAllUsersQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetAllUsersQueryVariables,
      options?: UseQueryOptions<GetAllUsersQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllUsersQuery, TError, TData>(
      variables === undefined ? ['GetAllUsers'] : ['GetAllUsers', variables],
      fetcher<GetAllUsersQuery, GetAllUsersQueryVariables>(client, GetAllUsersDocument, variables, headers),
      options
    );
useGetAllUsersQuery.document = GetAllUsersDocument;


useGetAllUsersQuery.getKey = (variables?: GetAllUsersQueryVariables) => variables === undefined ? ['GetAllUsers'] : ['GetAllUsers', variables];
;

export const useInfiniteGetAllUsersQuery = <
      TData = GetAllUsersQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllUsersQueryVariables,
      client: GraphQLClient,
      variables?: GetAllUsersQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllUsersQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllUsersQuery, TError, TData>(
      variables === undefined ? ['GetAllUsers.infinite'] : ['GetAllUsers.infinite', variables],
      (metaData) => fetcher<GetAllUsersQuery, GetAllUsersQueryVariables>(client, GetAllUsersDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllUsersQuery.getKey = (variables?: GetAllUsersQueryVariables) => variables === undefined ? ['GetAllUsers.infinite'] : ['GetAllUsers.infinite', variables];
;

useGetAllUsersQuery.fetcher = (client: GraphQLClient, variables?: GetAllUsersQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllUsersQuery, GetAllUsersQueryVariables>(client, GetAllUsersDocument, variables, headers);
export const GetAllUsersPagedDocument = `
    query GetAllUsersPaged($searchQuery: SearchQueryInput) {
  getAllUsersPaged(searchQuery: $searchQuery) {
    list {
      id
      firstName
      lastName
      displayName
      userProfile {
        photography
        profileTitle
        profileSlugUrl
      }
    }
    page
    totalPages
    totalElements
  }
}
    `;
export const useGetAllUsersPagedQuery = <
      TData = GetAllUsersPagedQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetAllUsersPagedQueryVariables,
      options?: UseQueryOptions<GetAllUsersPagedQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllUsersPagedQuery, TError, TData>(
      variables === undefined ? ['GetAllUsersPaged'] : ['GetAllUsersPaged', variables],
      fetcher<GetAllUsersPagedQuery, GetAllUsersPagedQueryVariables>(client, GetAllUsersPagedDocument, variables, headers),
      options
    );
useGetAllUsersPagedQuery.document = GetAllUsersPagedDocument;


useGetAllUsersPagedQuery.getKey = (variables?: GetAllUsersPagedQueryVariables) => variables === undefined ? ['GetAllUsersPaged'] : ['GetAllUsersPaged', variables];
;

export const useInfiniteGetAllUsersPagedQuery = <
      TData = GetAllUsersPagedQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllUsersPagedQueryVariables,
      client: GraphQLClient,
      variables?: GetAllUsersPagedQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllUsersPagedQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllUsersPagedQuery, TError, TData>(
      variables === undefined ? ['GetAllUsersPaged.infinite'] : ['GetAllUsersPaged.infinite', variables],
      (metaData) => fetcher<GetAllUsersPagedQuery, GetAllUsersPagedQueryVariables>(client, GetAllUsersPagedDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllUsersPagedQuery.getKey = (variables?: GetAllUsersPagedQueryVariables) => variables === undefined ? ['GetAllUsersPaged.infinite'] : ['GetAllUsersPaged.infinite', variables];
;

useGetAllUsersPagedQuery.fetcher = (client: GraphQLClient, variables?: GetAllUsersPagedQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllUsersPagedQuery, GetAllUsersPagedQueryVariables>(client, GetAllUsersPagedDocument, variables, headers);
export const GetAllJobsPaginatedDocument = `
    query GetAllJobsPaginated($searchQuery: SearchQueryInput) {
  getAllJobsPaginated(searchQuery: $searchQuery) {
    list {
      id
      name
      description
    }
    page
    totalPages
    totalElements
  }
}
    `;
export const useGetAllJobsPaginatedQuery = <
      TData = GetAllJobsPaginatedQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetAllJobsPaginatedQueryVariables,
      options?: UseQueryOptions<GetAllJobsPaginatedQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllJobsPaginatedQuery, TError, TData>(
      variables === undefined ? ['GetAllJobsPaginated'] : ['GetAllJobsPaginated', variables],
      fetcher<GetAllJobsPaginatedQuery, GetAllJobsPaginatedQueryVariables>(client, GetAllJobsPaginatedDocument, variables, headers),
      options
    );
useGetAllJobsPaginatedQuery.document = GetAllJobsPaginatedDocument;


useGetAllJobsPaginatedQuery.getKey = (variables?: GetAllJobsPaginatedQueryVariables) => variables === undefined ? ['GetAllJobsPaginated'] : ['GetAllJobsPaginated', variables];
;

export const useInfiniteGetAllJobsPaginatedQuery = <
      TData = GetAllJobsPaginatedQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllJobsPaginatedQueryVariables,
      client: GraphQLClient,
      variables?: GetAllJobsPaginatedQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllJobsPaginatedQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllJobsPaginatedQuery, TError, TData>(
      variables === undefined ? ['GetAllJobsPaginated.infinite'] : ['GetAllJobsPaginated.infinite', variables],
      (metaData) => fetcher<GetAllJobsPaginatedQuery, GetAllJobsPaginatedQueryVariables>(client, GetAllJobsPaginatedDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllJobsPaginatedQuery.getKey = (variables?: GetAllJobsPaginatedQueryVariables) => variables === undefined ? ['GetAllJobsPaginated.infinite'] : ['GetAllJobsPaginated.infinite', variables];
;

useGetAllJobsPaginatedQuery.fetcher = (client: GraphQLClient, variables?: GetAllJobsPaginatedQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllJobsPaginatedQuery, GetAllJobsPaginatedQueryVariables>(client, GetAllJobsPaginatedDocument, variables, headers);
export const GetMyApplicationsDocument = `
    query GetMyApplications($userId: Long!) {
  getMyApplications(userId: $userId) {
    id
    dateOfApplication
    jobListing {
      id
      title
      organization {
        id
        name
        photography
        slugName
      }
      city {
        name
        country {
          name
        }
      }
    }
    processSteps {
      id
    }
  }
}
    `;
export const useGetMyApplicationsQuery = <
      TData = GetMyApplicationsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetMyApplicationsQueryVariables,
      options?: UseQueryOptions<GetMyApplicationsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetMyApplicationsQuery, TError, TData>(
      ['GetMyApplications', variables],
      fetcher<GetMyApplicationsQuery, GetMyApplicationsQueryVariables>(client, GetMyApplicationsDocument, variables, headers),
      options
    );
useGetMyApplicationsQuery.document = GetMyApplicationsDocument;


useGetMyApplicationsQuery.getKey = (variables: GetMyApplicationsQueryVariables) => ['GetMyApplications', variables];
;

export const useInfiniteGetMyApplicationsQuery = <
      TData = GetMyApplicationsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetMyApplicationsQueryVariables,
      client: GraphQLClient,
      variables: GetMyApplicationsQueryVariables,
      options?: UseInfiniteQueryOptions<GetMyApplicationsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetMyApplicationsQuery, TError, TData>(
      ['GetMyApplications.infinite', variables],
      (metaData) => fetcher<GetMyApplicationsQuery, GetMyApplicationsQueryVariables>(client, GetMyApplicationsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetMyApplicationsQuery.getKey = (variables: GetMyApplicationsQueryVariables) => ['GetMyApplications.infinite', variables];
;

useGetMyApplicationsQuery.fetcher = (client: GraphQLClient, variables: GetMyApplicationsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetMyApplicationsQuery, GetMyApplicationsQueryVariables>(client, GetMyApplicationsDocument, variables, headers);
export const GetApplicationsForJobIdCountByStepsDocument = `
    query GetApplicationsForJobIdCountBySteps($jobId: Long!) {
  getApplicationsForJobIdCountBySteps(jobId: $jobId) {
    applicationsCount
    stepTitle
  }
}
    `;
export const useGetApplicationsForJobIdCountByStepsQuery = <
      TData = GetApplicationsForJobIdCountByStepsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetApplicationsForJobIdCountByStepsQueryVariables,
      options?: UseQueryOptions<GetApplicationsForJobIdCountByStepsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetApplicationsForJobIdCountByStepsQuery, TError, TData>(
      ['GetApplicationsForJobIdCountBySteps', variables],
      fetcher<GetApplicationsForJobIdCountByStepsQuery, GetApplicationsForJobIdCountByStepsQueryVariables>(client, GetApplicationsForJobIdCountByStepsDocument, variables, headers),
      options
    );
useGetApplicationsForJobIdCountByStepsQuery.document = GetApplicationsForJobIdCountByStepsDocument;


useGetApplicationsForJobIdCountByStepsQuery.getKey = (variables: GetApplicationsForJobIdCountByStepsQueryVariables) => ['GetApplicationsForJobIdCountBySteps', variables];
;

export const useInfiniteGetApplicationsForJobIdCountByStepsQuery = <
      TData = GetApplicationsForJobIdCountByStepsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetApplicationsForJobIdCountByStepsQueryVariables,
      client: GraphQLClient,
      variables: GetApplicationsForJobIdCountByStepsQueryVariables,
      options?: UseInfiniteQueryOptions<GetApplicationsForJobIdCountByStepsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetApplicationsForJobIdCountByStepsQuery, TError, TData>(
      ['GetApplicationsForJobIdCountBySteps.infinite', variables],
      (metaData) => fetcher<GetApplicationsForJobIdCountByStepsQuery, GetApplicationsForJobIdCountByStepsQueryVariables>(client, GetApplicationsForJobIdCountByStepsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetApplicationsForJobIdCountByStepsQuery.getKey = (variables: GetApplicationsForJobIdCountByStepsQueryVariables) => ['GetApplicationsForJobIdCountBySteps.infinite', variables];
;

useGetApplicationsForJobIdCountByStepsQuery.fetcher = (client: GraphQLClient, variables: GetApplicationsForJobIdCountByStepsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetApplicationsForJobIdCountByStepsQuery, GetApplicationsForJobIdCountByStepsQueryVariables>(client, GetApplicationsForJobIdCountByStepsDocument, variables, headers);
export const GetPrivateChatByIdDocument = `
    query GetPrivateChatById($chatId: Long!) {
  getPrivateChatById(chatId: $chatId) {
    id
    title
    unreadMessagesCount
    users {
      id
      username
      firstName
      lastName
      userProfile {
        photography
        profileTitle
      }
    }
    latestMessage {
      id
      content
      deliveredAt
    }
  }
}
    `;
export const useGetPrivateChatByIdQuery = <
      TData = GetPrivateChatByIdQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetPrivateChatByIdQueryVariables,
      options?: UseQueryOptions<GetPrivateChatByIdQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetPrivateChatByIdQuery, TError, TData>(
      ['GetPrivateChatById', variables],
      fetcher<GetPrivateChatByIdQuery, GetPrivateChatByIdQueryVariables>(client, GetPrivateChatByIdDocument, variables, headers),
      options
    );
useGetPrivateChatByIdQuery.document = GetPrivateChatByIdDocument;


useGetPrivateChatByIdQuery.getKey = (variables: GetPrivateChatByIdQueryVariables) => ['GetPrivateChatById', variables];
;

export const useInfiniteGetPrivateChatByIdQuery = <
      TData = GetPrivateChatByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetPrivateChatByIdQueryVariables,
      client: GraphQLClient,
      variables: GetPrivateChatByIdQueryVariables,
      options?: UseInfiniteQueryOptions<GetPrivateChatByIdQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetPrivateChatByIdQuery, TError, TData>(
      ['GetPrivateChatById.infinite', variables],
      (metaData) => fetcher<GetPrivateChatByIdQuery, GetPrivateChatByIdQueryVariables>(client, GetPrivateChatByIdDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetPrivateChatByIdQuery.getKey = (variables: GetPrivateChatByIdQueryVariables) => ['GetPrivateChatById.infinite', variables];
;

useGetPrivateChatByIdQuery.fetcher = (client: GraphQLClient, variables: GetPrivateChatByIdQueryVariables, headers?: RequestInit['headers']) => fetcher<GetPrivateChatByIdQuery, GetPrivateChatByIdQueryVariables>(client, GetPrivateChatByIdDocument, variables, headers);
export const GetChatAdvSearchDocument = `
    query GetChatAdvSearch($searchQuery: SearchQueryInput!) {
  getChatAdvSearch(searchQuery: $searchQuery) {
    list {
      id
      unreadMessagesCount
      title
      messages {
        id
        content
        sender {
          id
          username
          firstName
          lastName
          displayName
          userProfile {
            photography
          }
        }
        deliveredAt
      }
      users {
        id
        username
        firstName
        lastName
        userProfile {
          photography
        }
      }
      latestMessage {
        id
        content
        deliveredAt
        sender {
          firstName
          lastName
        }
      }
    }
    page
    totalPages
    totalElements
  }
}
    `;
export const useGetChatAdvSearchQuery = <
      TData = GetChatAdvSearchQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetChatAdvSearchQueryVariables,
      options?: UseQueryOptions<GetChatAdvSearchQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetChatAdvSearchQuery, TError, TData>(
      ['GetChatAdvSearch', variables],
      fetcher<GetChatAdvSearchQuery, GetChatAdvSearchQueryVariables>(client, GetChatAdvSearchDocument, variables, headers),
      options
    );
useGetChatAdvSearchQuery.document = GetChatAdvSearchDocument;


useGetChatAdvSearchQuery.getKey = (variables: GetChatAdvSearchQueryVariables) => ['GetChatAdvSearch', variables];
;

export const useInfiniteGetChatAdvSearchQuery = <
      TData = GetChatAdvSearchQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetChatAdvSearchQueryVariables,
      client: GraphQLClient,
      variables: GetChatAdvSearchQueryVariables,
      options?: UseInfiniteQueryOptions<GetChatAdvSearchQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetChatAdvSearchQuery, TError, TData>(
      ['GetChatAdvSearch.infinite', variables],
      (metaData) => fetcher<GetChatAdvSearchQuery, GetChatAdvSearchQueryVariables>(client, GetChatAdvSearchDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetChatAdvSearchQuery.getKey = (variables: GetChatAdvSearchQueryVariables) => ['GetChatAdvSearch.infinite', variables];
;

useGetChatAdvSearchQuery.fetcher = (client: GraphQLClient, variables: GetChatAdvSearchQueryVariables, headers?: RequestInit['headers']) => fetcher<GetChatAdvSearchQuery, GetChatAdvSearchQueryVariables>(client, GetChatAdvSearchDocument, variables, headers);
export const GetChatsWithUsersIdsDocument = `
    query GetChatsWithUsersIds($userIds: [Long]!) {
  getChatsWithUsersIds(userIds: $userIds) {
    id
    unreadMessagesCount
    title
    messages {
      id
      content
      sender {
        id
        username
        firstName
        lastName
        displayName
        userProfile {
          photography
        }
      }
      deliveredAt
    }
    users {
      id
      username
      firstName
      lastName
      userProfile {
        photography
      }
    }
    latestMessage {
      id
      content
      deliveredAt
      sender {
        firstName
        lastName
      }
    }
  }
}
    `;
export const useGetChatsWithUsersIdsQuery = <
      TData = GetChatsWithUsersIdsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetChatsWithUsersIdsQueryVariables,
      options?: UseQueryOptions<GetChatsWithUsersIdsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetChatsWithUsersIdsQuery, TError, TData>(
      ['GetChatsWithUsersIds', variables],
      fetcher<GetChatsWithUsersIdsQuery, GetChatsWithUsersIdsQueryVariables>(client, GetChatsWithUsersIdsDocument, variables, headers),
      options
    );
useGetChatsWithUsersIdsQuery.document = GetChatsWithUsersIdsDocument;


useGetChatsWithUsersIdsQuery.getKey = (variables: GetChatsWithUsersIdsQueryVariables) => ['GetChatsWithUsersIds', variables];
;

export const useInfiniteGetChatsWithUsersIdsQuery = <
      TData = GetChatsWithUsersIdsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetChatsWithUsersIdsQueryVariables,
      client: GraphQLClient,
      variables: GetChatsWithUsersIdsQueryVariables,
      options?: UseInfiniteQueryOptions<GetChatsWithUsersIdsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetChatsWithUsersIdsQuery, TError, TData>(
      ['GetChatsWithUsersIds.infinite', variables],
      (metaData) => fetcher<GetChatsWithUsersIdsQuery, GetChatsWithUsersIdsQueryVariables>(client, GetChatsWithUsersIdsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetChatsWithUsersIdsQuery.getKey = (variables: GetChatsWithUsersIdsQueryVariables) => ['GetChatsWithUsersIds.infinite', variables];
;

useGetChatsWithUsersIdsQuery.fetcher = (client: GraphQLClient, variables: GetChatsWithUsersIdsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetChatsWithUsersIdsQuery, GetChatsWithUsersIdsQueryVariables>(client, GetChatsWithUsersIdsDocument, variables, headers);
export const GetChatLinesAdvSearchDocument = `
    query GetChatLinesAdvSearch($searchQuery: SearchQueryInput!) {
  getChatAdvSearch(searchQuery: $searchQuery) {
    list {
      id
      unreadMessagesCount
      title
      users {
        id
        username
        firstName
        lastName
        userProfile {
          photography
        }
      }
      latestMessage {
        id
        content
        deliveredAt
        sender {
          firstName
          lastName
        }
      }
    }
    page
    totalPages
    totalElements
  }
}
    `;
export const useGetChatLinesAdvSearchQuery = <
      TData = GetChatLinesAdvSearchQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetChatLinesAdvSearchQueryVariables,
      options?: UseQueryOptions<GetChatLinesAdvSearchQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetChatLinesAdvSearchQuery, TError, TData>(
      ['GetChatLinesAdvSearch', variables],
      fetcher<GetChatLinesAdvSearchQuery, GetChatLinesAdvSearchQueryVariables>(client, GetChatLinesAdvSearchDocument, variables, headers),
      options
    );
useGetChatLinesAdvSearchQuery.document = GetChatLinesAdvSearchDocument;


useGetChatLinesAdvSearchQuery.getKey = (variables: GetChatLinesAdvSearchQueryVariables) => ['GetChatLinesAdvSearch', variables];
;

export const useInfiniteGetChatLinesAdvSearchQuery = <
      TData = GetChatLinesAdvSearchQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetChatLinesAdvSearchQueryVariables,
      client: GraphQLClient,
      variables: GetChatLinesAdvSearchQueryVariables,
      options?: UseInfiniteQueryOptions<GetChatLinesAdvSearchQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetChatLinesAdvSearchQuery, TError, TData>(
      ['GetChatLinesAdvSearch.infinite', variables],
      (metaData) => fetcher<GetChatLinesAdvSearchQuery, GetChatLinesAdvSearchQueryVariables>(client, GetChatLinesAdvSearchDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetChatLinesAdvSearchQuery.getKey = (variables: GetChatLinesAdvSearchQueryVariables) => ['GetChatLinesAdvSearch.infinite', variables];
;

useGetChatLinesAdvSearchQuery.fetcher = (client: GraphQLClient, variables: GetChatLinesAdvSearchQueryVariables, headers?: RequestInit['headers']) => fetcher<GetChatLinesAdvSearchQuery, GetChatLinesAdvSearchQueryVariables>(client, GetChatLinesAdvSearchDocument, variables, headers);
export const GetMessagesPaginatedDocument = `
    query GetMessagesPaginated($searchQuery: SearchQueryInput) {
  getMessagesPaginated(searchQuery: $searchQuery) {
    list {
      id
      content
      sender {
        id
        username
        firstName
        lastName
        displayName
        userProfile {
          photography
        }
      }
      deliveredAt
      seenAt
    }
    page
    totalPages
    totalElements
  }
}
    `;
export const useGetMessagesPaginatedQuery = <
      TData = GetMessagesPaginatedQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetMessagesPaginatedQueryVariables,
      options?: UseQueryOptions<GetMessagesPaginatedQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetMessagesPaginatedQuery, TError, TData>(
      variables === undefined ? ['GetMessagesPaginated'] : ['GetMessagesPaginated', variables],
      fetcher<GetMessagesPaginatedQuery, GetMessagesPaginatedQueryVariables>(client, GetMessagesPaginatedDocument, variables, headers),
      options
    );
useGetMessagesPaginatedQuery.document = GetMessagesPaginatedDocument;


useGetMessagesPaginatedQuery.getKey = (variables?: GetMessagesPaginatedQueryVariables) => variables === undefined ? ['GetMessagesPaginated'] : ['GetMessagesPaginated', variables];
;

export const useInfiniteGetMessagesPaginatedQuery = <
      TData = GetMessagesPaginatedQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetMessagesPaginatedQueryVariables,
      client: GraphQLClient,
      variables?: GetMessagesPaginatedQueryVariables,
      options?: UseInfiniteQueryOptions<GetMessagesPaginatedQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetMessagesPaginatedQuery, TError, TData>(
      variables === undefined ? ['GetMessagesPaginated.infinite'] : ['GetMessagesPaginated.infinite', variables],
      (metaData) => fetcher<GetMessagesPaginatedQuery, GetMessagesPaginatedQueryVariables>(client, GetMessagesPaginatedDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetMessagesPaginatedQuery.getKey = (variables?: GetMessagesPaginatedQueryVariables) => variables === undefined ? ['GetMessagesPaginated.infinite'] : ['GetMessagesPaginated.infinite', variables];
;

useGetMessagesPaginatedQuery.fetcher = (client: GraphQLClient, variables?: GetMessagesPaginatedQueryVariables, headers?: RequestInit['headers']) => fetcher<GetMessagesPaginatedQuery, GetMessagesPaginatedQueryVariables>(client, GetMessagesPaginatedDocument, variables, headers);
export const GetAllStepsDocument = `
    query GetAllSteps {
  getAllSteps {
    id
    title
    description
  }
}
    `;
export const useGetAllStepsQuery = <
      TData = GetAllStepsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetAllStepsQueryVariables,
      options?: UseQueryOptions<GetAllStepsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllStepsQuery, TError, TData>(
      variables === undefined ? ['GetAllSteps'] : ['GetAllSteps', variables],
      fetcher<GetAllStepsQuery, GetAllStepsQueryVariables>(client, GetAllStepsDocument, variables, headers),
      options
    );
useGetAllStepsQuery.document = GetAllStepsDocument;


useGetAllStepsQuery.getKey = (variables?: GetAllStepsQueryVariables) => variables === undefined ? ['GetAllSteps'] : ['GetAllSteps', variables];
;

export const useInfiniteGetAllStepsQuery = <
      TData = GetAllStepsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllStepsQueryVariables,
      client: GraphQLClient,
      variables?: GetAllStepsQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllStepsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllStepsQuery, TError, TData>(
      variables === undefined ? ['GetAllSteps.infinite'] : ['GetAllSteps.infinite', variables],
      (metaData) => fetcher<GetAllStepsQuery, GetAllStepsQueryVariables>(client, GetAllStepsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllStepsQuery.getKey = (variables?: GetAllStepsQueryVariables) => variables === undefined ? ['GetAllSteps.infinite'] : ['GetAllSteps.infinite', variables];
;

useGetAllStepsQuery.fetcher = (client: GraphQLClient, variables?: GetAllStepsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllStepsQuery, GetAllStepsQueryVariables>(client, GetAllStepsDocument, variables, headers);
export const FindRecruitersAdvSearchDocument = `
    query FindRecruitersAdvSearch($searchQuery: SearchQueryInput) {
  findRecruitersAdvSearch(searchQuery: $searchQuery) {
    list {
      id
      user {
        id
        firstName
        lastName
        displayName
        birthDate
        userProfile {
          photography
          profileTitle
        }
      }
      registeredAt
    }
    page
    totalPages
    totalElements
  }
}
    `;
export const useFindRecruitersAdvSearchQuery = <
      TData = FindRecruitersAdvSearchQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: FindRecruitersAdvSearchQueryVariables,
      options?: UseQueryOptions<FindRecruitersAdvSearchQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<FindRecruitersAdvSearchQuery, TError, TData>(
      variables === undefined ? ['FindRecruitersAdvSearch'] : ['FindRecruitersAdvSearch', variables],
      fetcher<FindRecruitersAdvSearchQuery, FindRecruitersAdvSearchQueryVariables>(client, FindRecruitersAdvSearchDocument, variables, headers),
      options
    );
useFindRecruitersAdvSearchQuery.document = FindRecruitersAdvSearchDocument;


useFindRecruitersAdvSearchQuery.getKey = (variables?: FindRecruitersAdvSearchQueryVariables) => variables === undefined ? ['FindRecruitersAdvSearch'] : ['FindRecruitersAdvSearch', variables];
;

export const useInfiniteFindRecruitersAdvSearchQuery = <
      TData = FindRecruitersAdvSearchQuery,
      TError = unknown
    >(
      pageParamKey: keyof FindRecruitersAdvSearchQueryVariables,
      client: GraphQLClient,
      variables?: FindRecruitersAdvSearchQueryVariables,
      options?: UseInfiniteQueryOptions<FindRecruitersAdvSearchQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<FindRecruitersAdvSearchQuery, TError, TData>(
      variables === undefined ? ['FindRecruitersAdvSearch.infinite'] : ['FindRecruitersAdvSearch.infinite', variables],
      (metaData) => fetcher<FindRecruitersAdvSearchQuery, FindRecruitersAdvSearchQueryVariables>(client, FindRecruitersAdvSearchDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteFindRecruitersAdvSearchQuery.getKey = (variables?: FindRecruitersAdvSearchQueryVariables) => variables === undefined ? ['FindRecruitersAdvSearch.infinite'] : ['FindRecruitersAdvSearch.infinite', variables];
;

useFindRecruitersAdvSearchQuery.fetcher = (client: GraphQLClient, variables?: FindRecruitersAdvSearchQueryVariables, headers?: RequestInit['headers']) => fetcher<FindRecruitersAdvSearchQuery, FindRecruitersAdvSearchQueryVariables>(client, FindRecruitersAdvSearchDocument, variables, headers);
export const GetConnectionInvitationsForUserDocument = `
    query GetConnectionInvitationsForUser($userId: Long!, $page: Int, $size: Int) {
  getNewConnectionForUser(userId: $userId, page: $page, size: $size) {
    list {
      id
      requester {
        id
        displayName
        firstName
        lastName
        userProfile {
          photography
          profileTitle
        }
      }
      connectionStatus
      lastModified
    }
    page
    totalPages
    totalElements
  }
}
    `;
export const useGetConnectionInvitationsForUserQuery = <
      TData = GetConnectionInvitationsForUserQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetConnectionInvitationsForUserQueryVariables,
      options?: UseQueryOptions<GetConnectionInvitationsForUserQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetConnectionInvitationsForUserQuery, TError, TData>(
      ['GetConnectionInvitationsForUser', variables],
      fetcher<GetConnectionInvitationsForUserQuery, GetConnectionInvitationsForUserQueryVariables>(client, GetConnectionInvitationsForUserDocument, variables, headers),
      options
    );
useGetConnectionInvitationsForUserQuery.document = GetConnectionInvitationsForUserDocument;


useGetConnectionInvitationsForUserQuery.getKey = (variables: GetConnectionInvitationsForUserQueryVariables) => ['GetConnectionInvitationsForUser', variables];
;

export const useInfiniteGetConnectionInvitationsForUserQuery = <
      TData = GetConnectionInvitationsForUserQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetConnectionInvitationsForUserQueryVariables,
      client: GraphQLClient,
      variables: GetConnectionInvitationsForUserQueryVariables,
      options?: UseInfiniteQueryOptions<GetConnectionInvitationsForUserQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetConnectionInvitationsForUserQuery, TError, TData>(
      ['GetConnectionInvitationsForUser.infinite', variables],
      (metaData) => fetcher<GetConnectionInvitationsForUserQuery, GetConnectionInvitationsForUserQueryVariables>(client, GetConnectionInvitationsForUserDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetConnectionInvitationsForUserQuery.getKey = (variables: GetConnectionInvitationsForUserQueryVariables) => ['GetConnectionInvitationsForUser.infinite', variables];
;

useGetConnectionInvitationsForUserQuery.fetcher = (client: GraphQLClient, variables: GetConnectionInvitationsForUserQueryVariables, headers?: RequestInit['headers']) => fetcher<GetConnectionInvitationsForUserQuery, GetConnectionInvitationsForUserQueryVariables>(client, GetConnectionInvitationsForUserDocument, variables, headers);
export const GetConnectionsForUserDocument = `
    query GetConnectionsForUser($userId: Long!, $page: Int, $size: Int, $searchQuery: String, $sortBy: SortsInput) {
  getConnectionsForUser(
    userId: $userId
    page: $page
    size: $size
    searchQuery: $searchQuery
    sortBy: $sortBy
  ) {
    list {
      id
      user {
        id
        displayName
        firstName
        lastName
        userProfile {
          photography
          profileTitle
          profileSlugUrl
        }
      }
      connectedAt
    }
    page
    totalPages
    totalElements
  }
}
    `;
export const useGetConnectionsForUserQuery = <
      TData = GetConnectionsForUserQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetConnectionsForUserQueryVariables,
      options?: UseQueryOptions<GetConnectionsForUserQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetConnectionsForUserQuery, TError, TData>(
      ['GetConnectionsForUser', variables],
      fetcher<GetConnectionsForUserQuery, GetConnectionsForUserQueryVariables>(client, GetConnectionsForUserDocument, variables, headers),
      options
    );
useGetConnectionsForUserQuery.document = GetConnectionsForUserDocument;


useGetConnectionsForUserQuery.getKey = (variables: GetConnectionsForUserQueryVariables) => ['GetConnectionsForUser', variables];
;

export const useInfiniteGetConnectionsForUserQuery = <
      TData = GetConnectionsForUserQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetConnectionsForUserQueryVariables,
      client: GraphQLClient,
      variables: GetConnectionsForUserQueryVariables,
      options?: UseInfiniteQueryOptions<GetConnectionsForUserQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetConnectionsForUserQuery, TError, TData>(
      ['GetConnectionsForUser.infinite', variables],
      (metaData) => fetcher<GetConnectionsForUserQuery, GetConnectionsForUserQueryVariables>(client, GetConnectionsForUserDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetConnectionsForUserQuery.getKey = (variables: GetConnectionsForUserQueryVariables) => ['GetConnectionsForUser.infinite', variables];
;

useGetConnectionsForUserQuery.fetcher = (client: GraphQLClient, variables: GetConnectionsForUserQueryVariables, headers?: RequestInit['headers']) => fetcher<GetConnectionsForUserQuery, GetConnectionsForUserQueryVariables>(client, GetConnectionsForUserDocument, variables, headers);
export const GetAllUserConnectionSuggestionsDocument = `
    query GetAllUserConnectionSuggestions($page: Int, $size: Int) {
  getAllUserConnectionSuggestions(page: $page, size: $size) {
    list {
      id
      displayName
      firstName
      lastName
      userProfile {
        coverPhotography
        photography
        profileTitle
        profileSlugUrl
      }
    }
    page
    totalPages
    totalElements
  }
}
    `;
export const useGetAllUserConnectionSuggestionsQuery = <
      TData = GetAllUserConnectionSuggestionsQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetAllUserConnectionSuggestionsQueryVariables,
      options?: UseQueryOptions<GetAllUserConnectionSuggestionsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetAllUserConnectionSuggestionsQuery, TError, TData>(
      variables === undefined ? ['GetAllUserConnectionSuggestions'] : ['GetAllUserConnectionSuggestions', variables],
      fetcher<GetAllUserConnectionSuggestionsQuery, GetAllUserConnectionSuggestionsQueryVariables>(client, GetAllUserConnectionSuggestionsDocument, variables, headers),
      options
    );
useGetAllUserConnectionSuggestionsQuery.document = GetAllUserConnectionSuggestionsDocument;


useGetAllUserConnectionSuggestionsQuery.getKey = (variables?: GetAllUserConnectionSuggestionsQueryVariables) => variables === undefined ? ['GetAllUserConnectionSuggestions'] : ['GetAllUserConnectionSuggestions', variables];
;

export const useInfiniteGetAllUserConnectionSuggestionsQuery = <
      TData = GetAllUserConnectionSuggestionsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAllUserConnectionSuggestionsQueryVariables,
      client: GraphQLClient,
      variables?: GetAllUserConnectionSuggestionsQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllUserConnectionSuggestionsQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetAllUserConnectionSuggestionsQuery, TError, TData>(
      variables === undefined ? ['GetAllUserConnectionSuggestions.infinite'] : ['GetAllUserConnectionSuggestions.infinite', variables],
      (metaData) => fetcher<GetAllUserConnectionSuggestionsQuery, GetAllUserConnectionSuggestionsQueryVariables>(client, GetAllUserConnectionSuggestionsDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetAllUserConnectionSuggestionsQuery.getKey = (variables?: GetAllUserConnectionSuggestionsQueryVariables) => variables === undefined ? ['GetAllUserConnectionSuggestions.infinite'] : ['GetAllUserConnectionSuggestions.infinite', variables];
;

useGetAllUserConnectionSuggestionsQuery.fetcher = (client: GraphQLClient, variables?: GetAllUserConnectionSuggestionsQueryVariables, headers?: RequestInit['headers']) => fetcher<GetAllUserConnectionSuggestionsQuery, GetAllUserConnectionSuggestionsQueryVariables>(client, GetAllUserConnectionSuggestionsDocument, variables, headers);
export const GetChatWithUserIdDocument = `
    query GetChatWithUserId($userId: Long!) {
  getChatWithUserId(userId: $userId) {
    id
    title
    unreadMessagesCount
    latestMessage {
      content
    }
  }
}
    `;
export const useGetChatWithUserIdQuery = <
      TData = GetChatWithUserIdQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: GetChatWithUserIdQueryVariables,
      options?: UseQueryOptions<GetChatWithUserIdQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetChatWithUserIdQuery, TError, TData>(
      ['GetChatWithUserId', variables],
      fetcher<GetChatWithUserIdQuery, GetChatWithUserIdQueryVariables>(client, GetChatWithUserIdDocument, variables, headers),
      options
    );
useGetChatWithUserIdQuery.document = GetChatWithUserIdDocument;


useGetChatWithUserIdQuery.getKey = (variables: GetChatWithUserIdQueryVariables) => ['GetChatWithUserId', variables];
;

export const useInfiniteGetChatWithUserIdQuery = <
      TData = GetChatWithUserIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetChatWithUserIdQueryVariables,
      client: GraphQLClient,
      variables: GetChatWithUserIdQueryVariables,
      options?: UseInfiniteQueryOptions<GetChatWithUserIdQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useInfiniteQuery<GetChatWithUserIdQuery, TError, TData>(
      ['GetChatWithUserId.infinite', variables],
      (metaData) => fetcher<GetChatWithUserIdQuery, GetChatWithUserIdQueryVariables>(client, GetChatWithUserIdDocument, {...variables, ...(metaData.pageParam ?? {})}, headers)(),
      options
    );


useInfiniteGetChatWithUserIdQuery.getKey = (variables: GetChatWithUserIdQueryVariables) => ['GetChatWithUserId.infinite', variables];
;

useGetChatWithUserIdQuery.fetcher = (client: GraphQLClient, variables: GetChatWithUserIdQueryVariables, headers?: RequestInit['headers']) => fetcher<GetChatWithUserIdQuery, GetChatWithUserIdQueryVariables>(client, GetChatWithUserIdDocument, variables, headers);

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny => v !== undefined && v !== null;

export const definedNonNullAnySchema = z.any().refine((v) => isDefinedNonNullAny(v));

export function ApplicationInputSchema(): z.ZodObject<Properties<ApplicationInput>> {
  return z.object<Properties<ApplicationInput>>({
    applicantProfileId: z.number(),
    dateOfApplication: definedNonNullAnySchema.nullish(),
    id: z.number().nullish(),
    jobListingId: z.number(),
    processSteps: z.array(z.lazy(() => ApplicationProcessStepsInputSchema().nullable())).nullish(),
    status: ApplicationStatusSchema.nullish(),
    userId: z.number()
  })
}

export function ApplicationProcessStepsInputSchema(): z.ZodObject<Properties<ApplicationProcessStepsInput>> {
  return z.object<Properties<ApplicationProcessStepsInput>>({
    applicationId: z.number(),
    id: z.number().nullish(),
    processStepId: z.number(),
    registeredAt: definedNonNullAnySchema.nullish()
  })
}

export const ApplicationStatusSchema = z.nativeEnum(ApplicationStatus);

export function CertificationInputSchema(): z.ZodObject<Properties<CertificationInput>> {
  return z.object<Properties<CertificationInput>>({
    name: z.string()
  })
}

export function ChatInputSchema(): z.ZodObject<Properties<ChatInput>> {
  return z.object<Properties<ChatInput>>({
    chatType: ChatTypeSchema.nullish(),
    id: z.number().nullish(),
    messages: z.array(z.lazy(() => MessageInputSchema().nullable())).nullish(),
    users: z.array(z.number().nullable())
  })
}

export const ChatTypeSchema = z.nativeEnum(ChatType);

export function ConnectionCreateInputSchema(): z.ZodObject<Properties<ConnectionCreateInput>> {
  return z.object<Properties<ConnectionCreateInput>>({
    addressedId: z.number(),
    connectionStatus: ConnectionStatusSchema,
    id: z.number().nullish(),
    requesterId: z.number()
  })
}

export const ConnectionStatusSchema = z.nativeEnum(ConnectionStatus);

export function ConnectionUpdateInputSchema(): z.ZodObject<Properties<ConnectionUpdateInput>> {
  return z.object<Properties<ConnectionUpdateInput>>({
    addressedId: z.number(),
    connectionStatus: ConnectionStatusSchema,
    id: z.number(),
    requesterId: z.number()
  })
}

export const ContractTypeSchema = z.nativeEnum(ContractType);

export function DomainInputSchema(): z.ZodObject<Properties<DomainInput>> {
  return z.object<Properties<DomainInput>>({
    name: z.string()
  })
}

export function ExperienceInputSchema(): z.ZodObject<Properties<ExperienceInput>> {
  return z.object<Properties<ExperienceInput>>({
    activitySectorId: z.number(),
    city: z.string().nullish(),
    contractType: ContractTypeSchema,
    description: z.string(),
    endDate: z.date().nullish(),
    id: z.number().nullish(),
    organizationId: z.number(),
    startDate: z.date(),
    title: z.string(),
    userProfileSlugUrl: z.string()
  })
}

export const FieldTypeSchema = z.nativeEnum(FieldType);

export function FiltersInputSchema(): z.ZodObject<Properties<FiltersInput>> {
  return z.object<Properties<FiltersInput>>({
    fieldType: FieldTypeSchema,
    key: z.string(),
    operator: OperatorSchema,
    value: z.string().nullish(),
    valueTo: z.string().nullish(),
    values: z.array(z.string().nullable()).nullish()
  })
}

export function InstitutionInputSchema(): z.ZodObject<Properties<InstitutionInput>> {
  return z.object<Properties<InstitutionInput>>({
    description: z.string().nullish(),
    name: z.string(),
    photography: z.string().nullish()
  })
}

export function JobCategoryInputSchema(): z.ZodObject<Properties<JobCategoryInput>> {
  return z.object<Properties<JobCategoryInput>>({
    id: z.number().nullish(),
    name: z.string()
  })
}

export function JobInputSchema(): z.ZodObject<Properties<JobInput>> {
  return z.object<Properties<JobInput>>({
    description: z.string().min(5).max(250, "Field must not be longer than 250 characters"),
    id: z.number().nullish(),
    name: z.string().min(5)
  })
}

export function JobListingInputSchema(): z.ZodObject<Properties<JobListingInput>> {
  return z.object<Properties<JobListingInput>>({
    availableFrom: z.date(),
    availableTo: z.date(),
    categoryId: z.number().min(1),
    contractType: ContractTypeSchema,
    description: z.string().min(10).max(8000, "Field must not be longer than 8000 characters"),
    formattedDescription: z.string().min(10),
    id: z.number().nullish(),
    jobId: z.number().min(1),
    location: z.string().min(3),
    numberOfVacancies: z.number().min(1),
    organizationId: z.number().min(1),
    recruiterId: z.number().min(1),
    title: z.string().min(5),
    workType: WorkTypeSchema
  })
}

export function MessageInputSchema(): z.ZodObject<Properties<MessageInput>> {
  return z.object<Properties<MessageInput>>({
    chatId: z.number(),
    content: z.string(),
    id: z.number().nullish(),
    senderUserId: z.number()
  })
}

export function MessageSeenInputSchema(): z.ZodObject<Properties<MessageSeenInput>> {
  return z.object<Properties<MessageSeenInput>>({
    id: z.number().nullish(),
    userId: z.number().nullish()
  })
}

export const OperatorSchema = z.nativeEnum(Operator);

export function OrganizationInputSchema(): z.ZodObject<Properties<OrganizationInput>> {
  return z.object<Properties<OrganizationInput>>({
    activitySectorId: z.number().min(1),
    companySize: OrganizationSizeSchema.nullish(),
    description: z.string().min(5),
    foundedAt: z.date(),
    headQuartersId: z.number().min(1),
    id: z.number().nullish(),
    locations: z.array(z.number().nullable()).nullish(),
    name: z.string().min(3),
    photography: z.string().nullish(),
    slogan: z.string().min(5).max(100, "Field must not be longer than 100 characters"),
    specializations: z.array(SpecializationSchema.nullable()).nullish(),
    webSite: z.string().url().nullish()
  })
}

export const OrganizationSizeSchema = z.nativeEnum(OrganizationSize);

export function ProcessInputSchema(): z.ZodObject<Properties<ProcessInput>> {
  return z.object<Properties<ProcessInput>>({
    description: z.string(),
    id: z.number().nullish(),
    name: z.string(),
    organizationId: z.number(),
    processSteps: z.array(z.lazy(() => ProcessStepsInputSchema().nullable())).nullish()
  })
}

export function ProcessInputCreateSchema(): z.ZodObject<Properties<ProcessInputCreate>> {
  return z.object<Properties<ProcessInputCreate>>({
    description: z.string(),
    id: z.number().nullish(),
    name: z.string(),
    organizationId: z.number(),
    processSteps: z.array(z.lazy(() => ProcessStepsInputCreateSchema().nullable())).nullish()
  })
}

export function ProcessStepsInputSchema(): z.ZodObject<Properties<ProcessStepsInput>> {
  return z.object<Properties<ProcessStepsInput>>({
    id: z.number().nullish(),
    order: z.number(),
    processId: z.number(),
    status: StatusSchema,
    stepId: z.number()
  })
}

export function ProcessStepsInputCreateSchema(): z.ZodObject<Properties<ProcessStepsInputCreate>> {
  return z.object<Properties<ProcessStepsInputCreate>>({
    id: z.number().nullish(),
    order: z.number(),
    status: StatusSchema,
    stepId: z.number()
  })
}

export function RecruiterInputSchema(): z.ZodObject<Properties<RecruiterInput>> {
  return z.object<Properties<RecruiterInput>>({
    id: z.number(),
    isActive: z.boolean().nullish(),
    lastActive: definedNonNullAnySchema.nullish(),
    organizationId: z.number().nullish()
  })
}

export function SearchQueryInputSchema(): z.ZodObject<Properties<SearchQueryInput>> {
  return z.object<Properties<SearchQueryInput>>({
    filters: z.array(z.lazy(() => FiltersInputSchema().nullable())).nullish(),
    page: z.number().nullish(),
    size: z.number().nullish(),
    sorts: z.array(z.lazy(() => SortsInputSchema().nullable())).nullish()
  })
}

export const SortDirectionSchema = z.nativeEnum(SortDirection);

export function SortsInputSchema(): z.ZodObject<Properties<SortsInput>> {
  return z.object<Properties<SortsInput>>({
    direction: SortDirectionSchema,
    key: z.string()
  })
}

export const SpecializationSchema = z.nativeEnum(Specialization);

export const StatusSchema = z.nativeEnum(Status);

export function StepInputSchema(): z.ZodObject<Properties<StepInput>> {
  return z.object<Properties<StepInput>>({
    description: z.string().min(3).max(150, "Field must not be longer than 150 characters"),
    title: z.string().min(2).max(15, "Field must not be longer than 15 characters")
  })
}

export function StudyInputSchema(): z.ZodObject<Properties<StudyInput>> {
  return z.object<Properties<StudyInput>>({
    certification: z.number().nullish(),
    degree: z.string().nullish(),
    description: z.string().nullish(),
    domainStudy: z.number().nullish(),
    endDate: z.date().nullish(),
    id: z.number().nullish(),
    institution: z.number(),
    startDate: z.date(),
    userProfileSlugUrl: z.string()
  })
}

export function UserProfileInputSchema(): z.ZodObject<Properties<UserProfileInput>> {
  return z.object<Properties<UserProfileInput>>({
    city: z.string(),
    description: z.string(),
    firstName: z.string(),
    id: z.number(),
    lastName: z.string(),
    profileSlugUrl: z.string(),
    profileTitle: z.string()
  })
}

export const WorkTypeSchema = z.nativeEnum(WorkType);
