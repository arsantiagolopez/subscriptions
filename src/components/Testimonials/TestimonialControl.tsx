import React, { FC, useState } from "react";
import { HiEye } from "react-icons/hi";
import { KeyedMutator } from "swr";
import axios from "../../axios";
import { PostEntity } from "../../types";

interface Props {
  post: PostEntity;
  isHidden: boolean;
  posts?: PostEntity[];
  mutate: KeyedMutator<PostEntity[]>;
}

const TestimonialControl: FC<Props> = ({ post, isHidden, posts, mutate }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Toggle hide testimonial
  const toggleVisibility: React.MouseEventHandler<SVGElement> = async (
    event
  ) => {
    // Prevent parent external link open
    event.preventDefault();
    event.stopPropagation();

    setIsLoading(true);

    const { status } = await axios.put(`/api/posts/${post?._id}`, {
      isHidden: !isHidden,
    });

    if (status !== 200) {
      console.log("Could not update visibility.");
    }

    // Update UI
    if (posts) {
      const updatedPosts = posts.map((obj) => {
        const { _id, isHidden } = obj;
        if (post?._id === _id) return { ...obj, isHidden: !isHidden };
        return obj;
      });
      mutate(updatedPosts);
    }

    setIsLoading(false);
  };

  return (
    <div className="absolute flex flex-col justify-end pb-6 h-full w-[3.25rem] right-0 opacity-60 select-none">
      <HiEye
        onClick={!isLoading ? toggleVisibility : undefined}
        className="text-white text-xl animate-pulse"
      />
    </div>
  );
};

export { TestimonialControl };
