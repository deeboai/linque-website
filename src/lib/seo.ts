const sanitizePath = (path: string) => {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
};

export const getSiteUrl = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL ?? "https://linqueresourcing.com";
  return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
};

export const buildCanonicalUrl = (path: string) => `${getSiteUrl()}${sanitizePath(path)}`;
