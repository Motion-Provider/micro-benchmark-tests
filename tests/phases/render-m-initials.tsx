import * as m from "motion/react-m";

/**
 * Tests if we can render a motion component with initial and animate props.
 * @returns {JSX.Element} A motion component with initial and animate props.
 */
export default function RenderMInitials() {
  return (
    <m.div
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
    </m.div>
  );
}
