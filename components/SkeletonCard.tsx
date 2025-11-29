"use dom";
import "../src/global.css";
import Skeleton from "./Skeleton";

export default function SkeletonCard() {
  return (
    <div className="w-full rounded-2xl overflow-hidden pb-4 ">
      {/* Image */}
      <div className="w-full aspect-square overflow-hidden rounded-2xl">
        <Skeleton />
      </div>

      <div className="px-4 pt-4 space-y-2">
        {/* Title */}
        <div className="w-[70%] h-5 rounded-md overflow-hidden">
          <Skeleton />
        </div>

        {/* Subtitle lines */}
        <div className="w-[90%] h-4 rounded-md overflow-hidden">
          <Skeleton />
        </div>
        <div className="w-[50%] h-4 rounded-md overflow-hidden">
          <Skeleton />
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-2 pt-1">
          <div className="w-5 h-5 rounded-md overflow-hidden">
            <Skeleton />
          </div>
          <div className="w-10 h-4 rounded-md overflow-hidden">
            <Skeleton />
          </div>
        </div>

        {/* Price */}
        <div className="w-[30%] h-5 rounded-md mt-2 overflow-hidden">
          <Skeleton />
        </div>
      </div>
    </div>
  );
}
