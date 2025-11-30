"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("/api/ping");
        const data = await response.json();
        if (data.status === "awake") {
          setLoading(false);
        } else {
          // If not awake yet, maybe retry or just stop?
          // Assuming if we get a response, we are good to go or let the page handle it.
          setLoading(false);
        }
      } catch (error) {
        // If error, stop loading so the page can show the error state
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <img
                src="/running.gif"
                alt="Loading..."
                className="w-32 h-32 mb-4 object-contain"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[#a0a0a0] font-mono text-sm"
              >
                Warming up the models...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
