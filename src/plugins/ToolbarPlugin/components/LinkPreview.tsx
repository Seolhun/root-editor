/* eslint-disable no-multi-assign */
import React from 'react';

interface LinkPreviewProps {
  url: string;
}

interface LinkPreviewContentProps {
  url: string;
}

type HtmlDivProps = React.HTMLAttributes<HTMLDivElement>;
interface GlimmerProps extends HtmlDivProps {
  index: number;
}

// Cached responses or running request promises
const PREVIEW_CACHE = {};

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

function useSuspenseRequest(url: string) {
  let cached = PREVIEW_CACHE[url];

  if (!url.match(URL_MATCHER)) {
    return { preview: null };
  }

  if (!cached) {
    cached = PREVIEW_CACHE[url] = fetch(
      `/api/link-preview?url=${encodeURI(url)}`,
    )
      .then((response) => response.json())
      .then((preview) => {
        PREVIEW_CACHE[url] = preview;
        return preview;
      })
      .catch(() => {
        PREVIEW_CACHE[url] = { preview: null };
      });
  }

  if (cached instanceof Promise) {
    return null;
  }
  return cached;
}

function LinkPreviewContent({ url }: LinkPreviewContentProps) {
  const { preview } = useSuspenseRequest(url);
  if (preview === null) {
    return null;
  }
  return (
    <div className="LinkPreview__container">
      {preview.img && (
        <div className="LinkPreview__imageWrapper">
          <img
            src={preview.img}
            alt={preview.title}
            className="LinkPreview__image"
          />
        </div>
      )}
      {preview.domain && (
        <div className="LinkPreview__domain">{preview.domain}</div>
      )}
      {preview.title && (
        <div className="LinkPreview__title">{preview.title}</div>
      )}
      {preview.description && (
        <div className="LinkPreview__description">{preview.description}</div>
      )}
    </div>
  );
}

function Glimmer({ index, style, ...rests }: GlimmerProps) {
  return (
    <div
      {...rests}
      className="LinkPreview__glimmer"
      style={{ animationDelay: `${(index || 0) * 300}`, ...(style || {}) }}
    />
  );
}

function LinkPreview({ url }: LinkPreviewProps) {
  return (
    <React.Suspense
      fallback={
        <>
          <Glimmer style={{ height: '80px' }} index={0} />
          <Glimmer style={{ width: '60%' }} index={1} />
          <Glimmer style={{ width: '80%' }} index={2} />
        </>
      }
    >
      <LinkPreviewContent url={url} />
    </React.Suspense>
  );
}

export { LinkPreview };
export default LinkPreview;
