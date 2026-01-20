"use client";

import React from "react";

interface BlogImageProps {
  src: string;
  alt: string;
  title: string;
}

const BlogImage = React.memo(
  function BlogImage({ src, alt, title }: BlogImageProps) {
    return (
      <div className="mb-8">
        <img
          src={src}
          alt={alt}
          title={title}
          className="w-full h-auto rounded-xl shadow-lg object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if props actually change
    return (
      prevProps.src === nextProps.src &&
      prevProps.alt === nextProps.alt &&
      prevProps.title === nextProps.title
    );
  }
);

BlogImage.displayName = "BlogImage";

export default BlogImage;
