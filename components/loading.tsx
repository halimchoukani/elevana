import { Hourglass } from "ldrs/react";
import "ldrs/react/Hourglass.css";

// Default values shown
export function Loading() {
  return (
    <div className="flex items-center justify-center h-[100vh] w-full">
      <Hourglass size="40" bgOpacity="0.1" speed="1.75" color="black" />
    </div>
  );
}
