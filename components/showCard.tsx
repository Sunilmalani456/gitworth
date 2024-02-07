"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toPng } from "html-to-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface ShowCardProps {
  avatar?: string;
  fullname?: string;
  username?: string;
  followers?: number;
  stars?: number;
  contribuitions?: number;
  estimated?: number;
}

const ShowCard = ({
  avatar,
  contribuitions,
  fullname,
  username,
  followers,
  stars,
  estimated,
}: ShowCardProps) => {
  const [loading, setLoading] = useState(false);
  const elementRef = useRef(null);

  //  FUNCTION TO CONVERT HTML TO IMAGE
  const htmlToImageConvert = () => {
    setLoading(true);
    try {
      if (elementRef.current) {
        toPng(elementRef.current, { cacheBust: false })
          .then((dataUrl) => {
            const link = document.createElement("a");
            link.download = "gitEstimate.png";
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            // console.log(err);
            toast.error("Sorry, Downloading limit reached!", {
              style: {
                background: "crimson",
                color: "white",
              },
              position: "top-center",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } catch (error) {
      toast.error("Error converting to image !", {
        style: {
          background: "crimson",
          color: "white",
        },
        position: "top-center",
      });
      console.error("Error converting to image:", error);
    }
  };

  return (
    <>
      <div
        className="flex flex-col bg-white dark:dark:bg-zinc-900 w-full max-w-[520px] p-5 sm:p-5 rounded-md shadow-md border dark:border-gray-600 max-sm:gap-3"
        ref={elementRef}
      >
        {/* HEAD  */}
        <div className="flex flex-row justify-between w-full sm:p-5">
          <div className="h-full flex flex-col items-start justify-start mb-2">
            <Avatar className="h-[56px] sm:h-[100px] w-auto">
              <AvatarImage src={avatar} className="object-cover" />
              <AvatarFallback>IMG</AvatarFallback>
            </Avatar>

            <span className="text-sm dark:text-white font-bold text-center ">
              {fullname}
            </span>
            <span className="text-sm font-normal text-center">
              {`github.com/${username}`}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-normal text-center">Get Yours</span>
            <span className="text-xs font-bold text-center">
              gitworth.vercel.app
            </span>
          </div>
        </div>
        {/* BODY  */}
        <div className="py-2 px-1 sm:px-5 w-full flex flex-row justify-center max-sm:text-xs">
          <div className="sm:px-4 px-1 flex flex-col gap-1 border-r">
            <span className="w-full text-center font-medium">
              {contribuitions}
            </span>
            <span className="w-full max-sm:text-xs text-center px-1 text-sm font-medium">
              Total Contributions
            </span>
          </div>
          <div className="sm:px-4 px-1 flex flex-col gap-1 border-r">
            <span className="w-full text-center font-medium">{stars}</span>
            <span className="w-full max-sm:text-xs text-center text-sm px-1 font-medium">
              Total Stars
            </span>
          </div>
          <div className="sm:px-4 px-1 flex flex-col gap-1">
            <span className="w-full text-center font-medium">{followers}</span>
            <span className="w-full max-sm:text-xs text-center pl-1 text-sm font-medium">
              Total Followers
            </span>
          </div>
        </div>
        {/* FOOTER  */}
        <div className="py-2 px-2 sm:px-5 w-full flex max-sm:h-[70px] h-[100px] relative">
          {/* 🔴 SUGGESTION -> Due to my vercel free tire end of 1000 images  unoptimized= true 👇   */}

          <Image
            src={`https://ghchart.rshah.org/sunilmalani456`}
            alt="Contribution Graph"
            fill={true}
            loading="eager"
            priority
            unoptimized={true}
          />
        </div>

        <div className="flex flex-col mt-1 gap-0.5">
          <span className="w-full text-center text-xl">{estimated} $</span>
          <span className="w-full text-center text-xs">Estimated Worth</span>
        </div>
        <span className="w-full text-center mt-2 text-xs">
          Get yours at gitworth.vercel.app
        </span>
      </div>
      <div className="flex justify-center mt-3">
        <Button disabled={loading} onClick={htmlToImageConvert}>
          {loading ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            "Save as JPEG"
          )}
        </Button>
      </div>
    </>
  );
};

export default ShowCard;
