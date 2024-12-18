import { AnimatePresence, motion } from "framer-motion";

import React from "react";

type CountdownOverlayProps = {
  countdown: number;
};

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  countdown,
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={countdown}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-white text-9xl font-bold"
        >
          {countdown}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
