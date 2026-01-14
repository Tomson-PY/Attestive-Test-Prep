"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export function RiataLogo() {
  const ref = useRef<SVGSVGElement>(null);
  
  // Mouse position state for parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for the movement
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Parallax transforms for different layers
  // Layer 1 (Back) -> Layer 4 (Front)
  const move1 = { x: useTransform(mouseX, [-0.5, 0.5], [30, -30]), y: useTransform(mouseY, [-0.5, 0.5], [30, -30]) };
  const move2 = { x: useTransform(mouseX, [-0.5, 0.5], [-20, 20]), y: useTransform(mouseY, [-0.5, 0.5], [-20, 20]) };
  const move3 = { x: useTransform(mouseX, [-0.5, 0.5], [40, -40]), y: useTransform(mouseY, [-0.5, 0.5], [40, -40]) };
  const move4 = { x: useTransform(mouseX, [-0.5, 0.5], [-50, 50]), y: useTransform(mouseY, [-0.5, 0.5], [-50, 50]) };

  return (
    <motion.div 
      className="relative w-full aspect-[4/3] flex items-center justify-center cursor-pointer perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
    >
      <svg 
        ref={ref}
        viewBox="0 0 3480.7 2440" 
        className="w-full h-full drop-shadow-2xl"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gradient 1: Magentas */}
          <linearGradient id="grad1" x1="2069.1" y1="-338.8" x2="2072.6" y2="-338.8" gradientTransform="translate(-214481.4 1048830.4) rotate(-87.6) scale(509.9 -509.9)" gradientUnits="userSpaceOnUse">
             <stop offset="0" stopColor="#900a45"/>
             <stop offset=".2" stopColor="#910b46"/>
             <stop offset=".4" stopColor="#a51254"/>
             <stop offset=".6" stopColor="#c7206d"/>
             <stop offset=".8" stopColor="#e42c82"/>
             <stop offset="1" stopColor="#e42c82"/>
          </linearGradient>

          {/* Gradient 2: Greens */}
          <linearGradient id="grad2" x1="2062" y1="-345" x2="2065.5" y2="-345" gradientTransform="translate(15455.7 -1219282) rotate(81.2) scale(583.4 -583.4)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#195a30"/>
            <stop offset=".3" stopColor="#21602f"/>
            <stop offset=".5" stopColor="#518129"/>
            <stop offset=".7" stopColor="#a0b720"/>
            <stop offset="1" stopColor="#cad41b"/>
          </linearGradient>

          {/* Gradient 3: Teals */}
          <linearGradient id="grad3" x1="2068" y1="-344.2" x2="2070.6" y2="-344.2" gradientTransform="translate(1627680.6 648946.1) rotate(-167.7) scale(833.8 -833.8)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#22777a"/>
            <stop offset=".3" stopColor="#268283"/>
            <stop offset=".6" stopColor="#30a09c"/>
            <stop offset=".8" stopColor="#38b5af"/>
            <stop offset="1" stopColor="#39b8b1"/>
          </linearGradient>

          {/* Gradient 4: Oranges */}
          <linearGradient id="grad4" x1="2069.1" y1="-338.4" x2="2072.5" y2="-338.4" gradientTransform="translate(-137231.9 1072118.5) rotate(-91.9) scale(514.8 -514.8)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#e30e14"/>
            <stop offset=".3" stopColor="#e73118"/>
            <stop offset=".5" stopColor="#ea461a"/>
            <stop offset=".7" stopColor="#ef701e"/>
            <stop offset="1" stopColor="#f7ae24"/>
          </linearGradient>
        </defs>

        {/* 
           Using the CLIP PATH shape data as the actual paths to be filled.
           This ensures we render the Logo shapes, not the gradient bounding boxes.
        */}

        {/* Group 1: Magentas - Shape from clippath-1 */}
        <motion.g style={{ x: move1.x, y: move1.y }}>
            <path 
                fill="url(#grad1)" 
                d="M3171.4,584.4c-216.9-339.5-782.2-541.3-1255.6-396.6-485.8,148.7-762.2,601.1-1070.2,936.9-328.1,357.5-789.9,468.8-660.2-185.1-62.5,132-86.5,261.3-78.8,382.2,16.4,250.6,191.1,383.9,398.3,390.3,439,13.4,702-396.6,995.4-762.5,532.3-664.6,1245.9-659.6,1671.3-365.2h0Z"
                style={{ mixBlendMode: 'multiply' }}
            />
        </motion.g>

        {/* Group 2: Greens - Shape from clippath-4 */}
        <motion.g style={{ x: move2.x, y: move2.y }}>
            <path 
                fill="url(#grad2)" 
                d="M276.6,1730.4c141,164.4,358.5,279,614.1,311.4,717-25.4,968-428,1174.1-796.9,380.6-671.9,933.9-108.9,355.9,16-234.6,50.4-446.1,135.7-456.8,427.3,150.4-260.3,561.7-124.3,808.9-231.9,533.6-231.9,30.8-1007-635.5-763.8-520.6,190.1-569.7,769.8-1023.4,993.4-218.9,107.6-575.4,135.3-837.3,44.4h0Z"
                style={{ mixBlendMode: 'multiply' }}
            />
        </motion.g>

        {/* Group 3: Teals - Shape from clippath-7 */}
        <motion.g style={{ x: move3.x, y: move3.y }}>
            <path 
                fill="url(#grad3)" 
                d="M2044.6,2432.9c-53.5-644.2,816.8-186.9,1243.8-753.7,313.1-415.6,148.2-1120.1-686.4-1135.8,637.5,163.8,677.7,765.4,345.1,998.5-311.1,218.4-799.7-56-1035.8,348.2-107.1,183.2-81.8,426.8,133.4,542.9h0Z"
                style={{ mixBlendMode: 'multiply' }}
            />
        </motion.g>

        {/* Group 4: Oranges - Shape from clippath-10 */}
        <motion.g style={{ x: move4.x, y: move4.y }}>
             <path 
                fill="url(#grad4)" 
                d="M2046.8,41.8C1399.2,3,885.7,150.4,609,756.8c-111.6,244.2-368.9,50.1,54.8-351.2-735.4,418.7-370.9,1312.4,174.1,501.9C1139.3,459.1,1451.3,69.2,2046.8,41.8Z"
                style={{ mixBlendMode: 'multiply' }}
             />
        </motion.g>
        
        {/* Shine Overlay */}
        <motion.rect
          width="100%"
          height="100%"
          fill="white"
          initial={{ opacity: 0, x: "-100%" }}
          whileHover={{ 
            opacity: [0, 0.1, 0],
            x: ["-100%", "100%"]
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ pointerEvents: "none", mixBlendMode: "overlay" }}
        />
      </svg>
    </motion.div>
  );
}
