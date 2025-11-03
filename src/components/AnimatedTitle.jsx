import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const AnimatedTitle = ({ title = "", containerClass = "" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(".animated-word", {
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        ease: "power2.inOut",
        stagger: 0.02,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [title]);

  // normalize escaped <br> and remove <b> tags (keep inner text)
  const normalized = String(title).replace(/&lt;br\s*\/?&gt;/gi, "<br/>");
  const noBold = normalized.replace(/<\/?b[^>]*>/gi, "");
  const lines = noBold.split(/<br\s*\/?>/gi);

  const initialStyle = {
    opacity: 0,
    transform: "translate3d(0,6px,0) rotateX(15deg) rotateY(10deg)",
    display: "inline-block",
  };

  const renderWord = (word, keyBase) => (
    <span key={keyBase} className="inline-block whitespace-nowrap">
      {word.split("").map((ch, i) => (
        <span key={`${keyBase}-c-${i}`} className="animated-word" style={initialStyle}>
          {ch}
        </span>
      ))}
    </span>
  );

  return (
    <div ref={containerRef} className={`animated-title ${containerClass || ""}`}>
      {lines.map((line, li) => (
        <div key={li} className="flex justify-center items-center flex-wrap gap-2 px-10 md:gap-3">
          {line
            .split(/(\s+)/) // preserve spaces
            .map((part, pi) =>
              /\s+/.test(part) ? (
                <span key={`s-${li}-${pi}`} className="animated-space" aria-hidden>
                  {part}
                </span>
              ) : (
                renderWord(part, `w-${li}-${pi}`)
              )
            )}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;