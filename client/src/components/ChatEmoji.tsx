import EmojiPicker from "emoji-picker-react";
import React, { useState, useEffect, useRef, SetStateAction } from "react";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";

type props = {
  onEmojiClick: (e: any) => void;
  showEmojiSelector: boolean;
  setShowEmojiSelector: React.Dispatch<SetStateAction<boolean>>;
};

export default function ChatEmoji({
  onEmojiClick,
  showEmojiSelector,
  setShowEmojiSelector,
}: props) {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(e.target as Node)
      ) {
        setShowEmojiSelector(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [componentRef]);

  return (
    <div className="relative h-auto" ref={componentRef}>
      <button
        onClick={() => setShowEmojiSelector((prev) => !prev)}
        className=" text-grayish hover:text-light-pink text-3xl"
      >
        <BsEmojiSmileUpsideDown />
      </button>
      {showEmojiSelector && (
        <div className="absolute bottom-[3.3rem]">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
}
