import { Link } from "wouter";
import { motion } from "framer-motion";
import { ActivitySquare, LineChart, ArrowRight, Zap, Globe2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          <span>System Online: Awaiting Telemetry</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-white mb-6 text-glow">
          Terminal <span className="text-primary">Intelligence</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Upload chart telemetry. Execute deterministic AI analysis. Minimize emotional variance. 
          Select an operational mode to begin sequence.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Binary Options Mode */}
        <Link href="/binary">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <Card className="h-full p-8 flex flex-col relative overflow-hidden group cursor-pointer border-white/10 hover:border-primary/50 transition-colors duration-500 hover:glow-blue">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-110">
                <ActivitySquare className="w-32 h-32" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 text-primary border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                  <ActivitySquare className="w-7 h-7" />
                </div>
                
                <h2 className="text-2xl font-display font-bold text-white mb-3">Binary Options</h2>
                <p className="text-muted-foreground mb-8 flex-1">
                  Short-timeframe analysis for timed expiry contracts. Optimizes for precise entry points and immediate directional probability over 1-5 minute intervals.
                </p>
                
                <div className="flex items-center text-primary font-medium mt-auto group-hover:translate-x-2 transition-transform duration-300">
                  Initialize Protocol <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Card>
          </motion.div>
        </Link>

        {/* Forex Mode */}
        <Link href="/forex">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <Card className="h-full p-8 flex flex-col relative overflow-hidden group cursor-pointer border-white/10 hover:border-purple-500/50 transition-colors duration-500 hover:shadow-[0_0_20px_0_rgba(168,85,247,0.3)]">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-110">
                <Globe2 className="w-32 h-32" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 border border-purple-500/30 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-500">
                  <LineChart className="w-7 h-7" />
                </div>
                
                <h2 className="text-2xl font-display font-bold text-white mb-3">Forex & Crypto</h2>
                <p className="text-muted-foreground mb-8 flex-1">
                  Structural market analysis for continuous trading. Generates high-probability Entry, Stop Loss, and Take Profit zones based on liquidity and momentum.
                </p>
                
                <div className="flex items-center text-purple-400 font-medium mt-auto group-hover:translate-x-2 transition-transform duration-300">
                  Initialize Protocol <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Card>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
