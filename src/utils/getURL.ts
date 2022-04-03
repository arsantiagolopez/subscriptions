export const getURL = () => {
  const url =
    process?.env?.DOMAIN && process.env.DOMAIN !== ""
      ? process.env.DOMAIN
      : process?.env?.NEXTAUTH_URL && process.env.NEXTAUTH_URL !== ""
      ? process.env.NEXTAUTH_URL
      : "http://localhost:2000";

  return url.includes("http") ? url : `https://${url}`;
};
