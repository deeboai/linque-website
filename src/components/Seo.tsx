import { useEffect } from "react";

interface OpenGraphConfig {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  url?: string;
}

interface SeoProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  openGraph?: OpenGraphConfig;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

const Seo = ({ title, description, canonicalUrl, openGraph, structuredData, noIndex = false }: SeoProps) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const previousTitle = document.title;
    document.title = title;

    const manageTag = <T extends HTMLMetaElement | HTMLLinkElement | HTMLScriptElement>(
      selector: string,
      create: () => T,
      update: (element: T) => void
    ) => {
      const existing = document.head.querySelector<T>(selector);
      if (existing) {
        const previousAttributes = Array.from(existing.attributes).reduce<Record<string, string>>(
          (acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          },
          {}
        );
        const previousContent = existing.textContent ?? "";
        update(existing);
        return { element: existing, created: false, previousAttributes, previousContent };
      }

      const element = create();
      update(element);
      document.head.appendChild(element);
      return { element, created: true, previousAttributes: null, previousContent: "" };
    };

    const descriptionRecord = manageTag(
      'meta[name="description"]',
      () => document.createElement("meta"),
      (meta) => {
        meta.setAttribute("name", "description");
        meta.setAttribute("content", description);
      }
    );

    const robotsRecord = manageTag(
      'meta[name="robots"]',
      () => document.createElement("meta"),
      (meta) => {
        meta.setAttribute("name", "robots");
        meta.setAttribute("content", noIndex ? "noindex, nofollow" : "index, follow");
      }
    );

    const ogTitleRecord = manageTag(
      'meta[property="og:title"]',
      () => document.createElement("meta"),
      (meta) => {
        meta.setAttribute("property", "og:title");
        meta.setAttribute("content", openGraph?.title ?? title);
      }
    );

    const ogDescriptionRecord = manageTag(
      'meta[property="og:description"]',
      () => document.createElement("meta"),
      (meta) => {
        meta.setAttribute("property", "og:description");
        meta.setAttribute("content", openGraph?.description ?? description);
      }
    );

    const ogTypeRecord = manageTag(
      'meta[property="og:type"]',
      () => document.createElement("meta"),
      (meta) => {
        meta.setAttribute("property", "og:type");
        meta.setAttribute("content", openGraph?.type ?? "website");
      }
    );

    const ogUrlRecord = openGraph?.url
      ? manageTag(
          'meta[property="og:url"]',
          () => document.createElement("meta"),
          (meta) => {
            meta.setAttribute("property", "og:url");
            meta.setAttribute("content", openGraph.url ?? "");
          }
        )
      : null;

    const ogImageRecord = openGraph?.image
      ? manageTag(
          'meta[property="og:image"]',
          () => document.createElement("meta"),
          (meta) => {
            meta.setAttribute("property", "og:image");
            meta.setAttribute("content", openGraph.image ?? "");
          }
        )
      : null;

    const twitterTitleRecord = manageTag(
      'meta[name="twitter:title"]',
      () => document.createElement("meta"),
      (meta) => {
        meta.setAttribute("name", "twitter:title");
        meta.setAttribute("content", openGraph?.title ?? title);
      }
    );

    const twitterDescriptionRecord = manageTag(
      'meta[name="twitter:description"]',
      () => document.createElement("meta"),
      (meta) => {
        meta.setAttribute("name", "twitter:description");
        meta.setAttribute("content", openGraph?.description ?? description);
      }
    );

    const twitterImageRecord = openGraph?.image
      ? manageTag(
          'meta[name="twitter:image"]',
          () => document.createElement("meta"),
          (meta) => {
            meta.setAttribute("name", "twitter:image");
            meta.setAttribute("content", openGraph.image ?? "");
          }
        )
      : null;

    const canonicalRecord = canonicalUrl
      ? manageTag(
          'link[rel="canonical"]',
          () => document.createElement("link"),
          (link) => {
            link.setAttribute("rel", "canonical");
            link.setAttribute("href", canonicalUrl);
          }
        )
      : null;

    const structuredDataRecord = structuredData
      ? manageTag(
          'script[data-structured="page"]',
          () => document.createElement("script"),
          (script) => {
            script.setAttribute("type", "application/ld+json");
            script.setAttribute("data-structured", "page");
            script.textContent = JSON.stringify(structuredData);
          }
        )
      : null;

    return () => {
      document.title = previousTitle;

      const restore = <T extends HTMLMetaElement | HTMLLinkElement | HTMLScriptElement>(
        record:
          | {
              element: T;
              created: boolean;
              previousAttributes: Record<string, string> | null;
              previousContent: string;
            }
          | null
          | undefined
      ) => {
        if (!record) return;

        if (record.created) {
          record.element.parentElement?.removeChild(record.element);
          return;
        }

        if (record.previousAttributes) {
          Array.from(record.element.attributes).forEach((attr) => {
            if (!(attr.name in record.previousAttributes!)) {
              record.element.removeAttribute(attr.name);
            }
          });
          Object.entries(record.previousAttributes).forEach(([key, value]) =>
            record.element.setAttribute(key, value)
          );
        }

        if (record.element instanceof HTMLScriptElement) {
          record.element.textContent = record.previousContent;
        }
      };

      restore(descriptionRecord);
      restore(robotsRecord);
      restore(ogTitleRecord);
      restore(ogDescriptionRecord);
      restore(ogTypeRecord);
      restore(ogUrlRecord);
      restore(ogImageRecord);
      restore(twitterTitleRecord);
      restore(twitterDescriptionRecord);
      restore(twitterImageRecord);
      restore(canonicalRecord);
      restore(structuredDataRecord);
    };
  }, [title, description, canonicalUrl, openGraph, structuredData, noIndex]);

  return null;
};

export default Seo;
