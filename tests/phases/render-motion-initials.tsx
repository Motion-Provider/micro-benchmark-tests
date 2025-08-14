import { motion } from "motion/react";

/**
 * Renders a motion component with initial and animate properties for opacity.
 * @function RenderMotionInitials
 * @returns {JSX.Element} A motion div element with specified animation properties.
 */
export default function RenderMotionInitials() {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
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
