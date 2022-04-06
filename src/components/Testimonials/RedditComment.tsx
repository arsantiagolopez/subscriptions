import { Interweave } from "interweave";
import moment from "moment";
import React, { FC } from "react";
import { FaRedditAlien } from "react-icons/fa";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import { KeyedMutator } from "swr";
import { PostEntity } from "../../types";
import { TestimonialControl } from "./TestimonialControl";

interface Props {
  post: PostEntity;
  isAdmin?: boolean;
  posts?: PostEntity[];
  mutate: KeyedMutator<PostEntity[]>;
  isShowingHidden: boolean;
}

const RedditComment: FC<Props> = ({
  post,
  isAdmin,
  posts,
  mutate,
  isShowingHidden,
}) => {
  const { image, username, messageHtml, likes, timestamp, isHidden } = post;

  const testimonialControlProps = { post, isHidden, posts, mutate };

  // Don't show hidden, if admin selects not to (!isShowingHidden)
  if (isHidden && !isShowingHidden) {
    return null;
  }

  return (
    <div
      className={`relative break-inside flex flex-row bg-secondary rounded-md shadow-lg text-white w-full hover:animate-pulse mb-4 md:mb-6 ${
        isHidden ? "opacity-20" : "opacity-100"
      }`}
    >
      <div className="flex flex-row px-8 py-6 w-full">
        {/* Left */}
        <div className="flex flex-col justify-center items-center">
          <img
            src={image}
            className="aspect-square rounded-full h-12 w-12 min-w-[2rem] max-w-[2rem]"
          />
          <div className="mx-auto h-full border-[1px] border-neutral-700 mt-3"></div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-start pl-4 pt-2">
          {/* Top row*/}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row items-center">
              <p className="text-sm text-fourth font-semibold">{username}</p>
              <p className="text-sm text-neutral-700 pl-3">
                {moment(timestamp).fromNow()}
              </p>
            </div>
            <FaRedditAlien className="text-neutral-700 text-xl -mt-3" />
          </div>
          {/* Message */}
          <div className="text-sm text-fourth pt-3">
            <Interweave content={messageHtml} />
          </div>
          {/* Comments & likes */}
          <div className="flex flex-row items-center pt-2">
            <ImArrowUp className="text-fourth text-md" />
            <p className="text-xs text-white font-semibold mx-2">{likes}</p>
            <ImArrowDown className="text-fourth text-md" />
          </div>
        </div>
      </div>

      {isAdmin && <TestimonialControl {...testimonialControlProps} />}
    </div>
  );
};

export { RedditComment };
