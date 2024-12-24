export const config = {
  BASE_URL: process.env.NODE_ENV === 'development' 
    ? process.env.DEV_API_URL 
    : process.env.PROD_API_URL,
  CLIENT_URL: process.env.NODE_ENV === 'development'
    ? process.env.DEV_CLIENT_URL
    : process.env.PROD_CLIENT_URL
};