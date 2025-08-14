import animations from "@/mocks/animate.lib.ts";
import { motion } from "motion/react";

/**
 * @function RenderMotionFromTree
 * @description Test to render a motion component from a tree.
 * @returns {JSX.Element} A motion component with a tree structure.
 * Why I am calling these initials from external library?
 * It's because in my motion provider component, currently
 * using an object file to match the desired animation utility with
 * given property.
 */
export default function RenderMotionFromTree() {
  return (
    <motion.div
      initial={animations["opacity"]?.initial!}
      animate={animations["opacity"]?.animate!}
      transition={{
        duration: 1,
      }}
      style={{
        backgroundColor: "red",
        width: "10vw",
        height: "10vh",
        borderRadius: "12.5px",
      }}
      key={"opacity"}
    >
      This is a test
    </motion.div>
  );
}
