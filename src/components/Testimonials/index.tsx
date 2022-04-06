import { useSession } from "next-auth/react";
import React, { FC, useEffect, useState } from "react";
import useSWR from "swr";
import axios from "../../axios";
import { PostEntity } from "../../types";
import { RedditComment } from "./RedditComment";

interface Props {}

const Testimonials: FC<Props> = () => {
  const [isShowingHidden, setIsShowingHidden] = useState<boolean>(false);
  const { data: session } = useSession();

  const { user } = session || {};

  const { isAdmin } = user || {};

  const { data: posts, mutate } = useSWR<PostEntity[]>("/api/posts");

  const toggleHidden = () => setIsShowingHidden(!isShowingHidden);

  const scrapePosts = async () => {
    await axios.post("/api/scrape");
  };

  // Scrape new posts if no posts found
  useEffect(() => {
    if (posts && !posts.length) {
      scrapePosts();
    }
  }, [posts]);

  const postProps = { isAdmin, posts, mutate, isShowingHidden };

  return (
    <div className="flex flex-col justify-center items-center w-full pt-16 md:pt-20 pb-10 md:pb-12">
      <h1 className="font-Basic text-primary dark:text-white text-4xl md:text-6xl tracking-tighter pb-14 md:pb-24">
        What people are saying
      </h1>

      {
        // Show/hide hidden cards
        isAdmin && (
          <button
            onClick={toggleHidden}
            className="italic -mt-4 md:-mt-14 pb-14 md:pb-14 text-white text-sm"
          >
            {isShowingHidden ? "Hide hidden" : "Show hidden"}
          </button>
        )
      }

      {/* Content */}
      <div className="flex flex-row justify-center items-center md:items-start w-full">
        {/* Testimonials */}
        <div className="masonry-1-col md:masonry-2-col lg:masonry-3-col w-full transition-all">
          {
            // Post
            posts?.map((post) => (
              <a
                key={post?.platformId}
                href={post?.link}
                rel="noreferrer"
                target="_blank"
                className="cursor-pointer"
              >
                {post?.platform === "reddit" ? (
                  <RedditComment post={post} {...postProps} />
                ) : null}
              </a>
            ))
          }
        </div>
      </div>

      <button onClick={scrapePosts}>Click me</button>
    </div>
  );
};

export { Testimonials };
