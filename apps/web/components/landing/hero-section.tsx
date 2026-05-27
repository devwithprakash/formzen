"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const words = ["beautiful", "intuitive", "engaging"];

export function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-background to-background" />

      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Trusted by 10,000+ teams worldwide
            </motion.div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.15] tracking-tight text-foreground">
              Build{" "}
              <span className="relative inline-block min-w-[200px] sm:min-w-[280px] text-primary font-medium overflow-hidden vertical-align-middle">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={words[index]}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute left-0 top-0 block"
                  >
                    {words[index]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              forms in minutes
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              Create stunning forms with our intuitive drag-and-drop builder. Collect responses,
              analyze data, and integrate seamlessly with your favorite tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/dashboard" className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />

                <Button
                  size="lg"
                  className="relative rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 gap-2 w-full sm:w-auto shadow-md"
                >
                  Start Building Free
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            whileHover={{ y: -10 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2,
              y: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-3xl opacity-30" />

            <div className="relative rounded-[2rem] bg-card/60 backdrop-blur-sm shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] overflow-hidden">
              <Image
                src="/images/main-hero-img.png"
                alt="FormZen form builder interface showcase"
                width={800}
                height={600}
                className="w-full h-auto rounded-[2rem] object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
