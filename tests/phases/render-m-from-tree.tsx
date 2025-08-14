import * as m from "motion/react-m";
import animations from "@/mocks/animate.lib.ts";

/**
 * Test to render a motion component from a tree.
 * @returns {JSX.Element} A motion component with a tree structure.
 */
export default function RenderMFromTree() {
  return (
    <m.div
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
    </m.div>
  );
}
