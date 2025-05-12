// Type declarations for config module
declare module '*/config' {
  export const API_URL: string;
  export const APP_NAME: string;
  export const APP_VERSION: string;
  
  const config: {
    API_URL: string;
    APP_NAME: string;
    APP_VERSION: string;
  };
  
  export default config;
}
