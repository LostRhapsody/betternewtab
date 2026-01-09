const apiDomain = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const API = {
  LOGIN: `${apiDomain}/login`,
  REGISTER: `${apiDomain}/register`,
  CREATE_USER: `${apiDomain}/create_user`,
  GET_USER: `${apiDomain}/user`,
  GET_USER_LINKS: `${apiDomain}/user/links`,
  CREATE_LINK: `${apiDomain}/link`,
  UPDATE_LINK: `${apiDomain}/link`,
  DELETE_LINK: (linkId: string) => `${apiDomain}/link/${linkId}`,
  SUGGEST: (query: string) => `${apiDomain}/suggest/${query}`,
  FEEDBACK: `${apiDomain}/feedback`,
  CREATE_SETTINGS: `${apiDomain}/settings`,
  UPDATE_SETTINGS: `${apiDomain}/settings`,
  GET_SETTINGS: `${apiDomain}/settings`,
  GET_USER_DATA: `${apiDomain}/user_data`,
  STAGING_LOGIN: `${apiDomain}/staging_login`,
} as const;
