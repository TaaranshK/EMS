import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_NAME = "Employee Management System";

export default function PageSeo({
  title,
  description,
  noIndex = true,
}) {
  const location = useLocation();
  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}${location.pathname}`
      : location.pathname;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const robots = noIndex ? "noindex, nofollow" : "index, follow";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
}
