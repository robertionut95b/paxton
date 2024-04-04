const isProd = Boolean(import.meta.env.PROD);

export const APP_API_VERSION = 1;
export const APP_API_BASE_URL = isProd ? "" : "http://localhost:8080";
export const APP_API_WS_BASE_URL = isProd ? "" : "ws://localhost:8080";
export const APP_API_PATH = `/api/v${APP_API_VERSION}`;
export const APP_APPLICATION_DOCS_PATH = `${APP_API_BASE_URL}${APP_API_PATH}/applications`;
export const APP_GQL_ENDPOINT = `${APP_API_BASE_URL}/graphql`;
export const APP_GQL_WS_ENDPOINT = `${APP_API_WS_BASE_URL}/subscriptions`;
export const API_PAGINATION_SIZE = 10;
export const APP_SUPPORTED_IMAGE_EXTENSIONS = ["jpg", "png", "jpeg"];
export const APP_SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpeg"];
export const APP_SUPPORTED_DOCS_TYPES = ["application/pdf"];

export const JOB_POSTING_INITIAL_DESCRIPTION =
  "<h1><strong>About the job</strong></h1><p></p><h2><strong>Description</strong></h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ut dui tellus. Quisque congue luctus risus non consequat. Nullam nec lorem at dolor ullamcorper iaculis. Nullam nec ultricies ex, non luctus orci.<p></p> Aenean ex ligula, molestie et dolor at, mattis sodales nibh. Maecenas sed dignissim orci, sed accumsan ante. Praesent vulputate sed sem id tempus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed commodo bibendum velit, nec porta turpis efficitur vel. Aenean quam tellus, ultricies sed tortor tempus, consectetur finibus odio.</p>";
