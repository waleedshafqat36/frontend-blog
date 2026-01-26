"use client";

import BlogInteractive from "./BlogInteractive";
import ShareSection from "./ShareSection";

interface BlogInteractiveWrapperProps {
  blogId: string;
  title: string;
  slugUrdu:string;
  initialLikes?: number;
  initialDislikes?: number;
  initialLikedBy?: string[];
  initialDislikedBy?: string[];
  initialComments?: any[];
  isUrdu?: boolean;
}

export default function BlogInteractiveWrapper({
  blogId,
  title,
  slugUrdu,
  initialLikes = 0,
  initialDislikes = 0,
  initialLikedBy = [],
  initialDislikedBy = [],
  initialComments = [],
  isUrdu = false,
}: BlogInteractiveWrapperProps) {
  return (
    <>
      <BlogInteractive
        blogId={blogId}
        slugUrdu={slugUrdu}
        initialLikes={initialLikes}
        initialDislikes={initialDislikes}
        initialLikedBy={initialLikedBy}
        initialDislikedBy={initialDislikedBy}
        initialComments={initialComments}
        isUrdu={isUrdu}
      />
      <ShareSection title={title} isUrdu={isUrdu} />
    </>
  );
}
