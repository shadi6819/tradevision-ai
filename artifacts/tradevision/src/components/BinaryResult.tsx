import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { BinaryAnalysisResult } from "@/api";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const getRiskColor = (risk: string) => {
  switch (risk.toLowerCase()) {
    case "very low": return "text-success border-success/30 bg-success/10";
    case "low": return "text-teal-400 border-teal-400/30 bg-teal-400/10";
    case "medium": return "text-warning border-warning/30 bg-warning/10";
    case "high": return "text-orange-500 border-orange-500/30 bg-orange-500/10";
    case "extreme": return "text-destructive border-destructive/30 bg-destructive/10";
    default: return "text-muted-foreground border-white/10 bg-white/5";
  }
};

const getQualityColor = (quality: string) => {
  switch (quality.toLowerCase()) {
    case "excellent": return "text-success border-success/30 bg-success/10";
    case "good": return "text-teal-400 border-teal-400/30 bg-teal-400/10";
    case "average": return "text-warning border-warning/30 bg-warning/10";
    case "weak": return "text-orange-500 border-orange-500/30 bg-orange-500/10";
    case "avoid": return "text-destructive border-destructive/30 bg-destructive/10";
    default: return "text-muted-foreground border-white/10 bg-white/5";
  }
};

export function BinaryResult({ result }: { result: BinaryAnalysisResult }) {
  const isUp = result.direction === "UP";
  const isDown = result.direction === "DOWN";
  const isNoTrade = result.direction === "NO_TRADE";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Primary Decision Header */}
      <motion.div variants={item}>
        <Card className={cn(
          "overflow-hidden relative border-2",
          isUp && "border-success/50 glow-green bg-success/5",
          isDown && "border-destructive/50 glow-red bg-destructive/5",
          isNoTrade && "border-white/10 bg-white/5"
        )}>
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {isUp && <ArrowUpCircle className="w-20 h-20 text-success animate-pulse" />}
              {isDown && <ArrowDownCircle className="w-20 h-20 text-destructive animate-pulse" />}
              {isNoTrade && <MinusCircle className="w-20 h-20 text-muted-foreground" />}
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-widest">
                  Signal Output
                </div>
                <h2 className={cn(
                  "text-5xl font-display font-bold text-glow",
                  isUp && "text-success",
                  isDown && "text-destructive",
                  isNoTrade && "text-white"
                )}>
                  {result.direction}
                </h2>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="text-3xl font-display font-bold text-white">
                {result.confidence}%
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Confidence Level
              </div>
              <div className="flex gap-2 mt-2">
                <Badge className={cn("uppercase", getRiskColor(result.riskLevel))}>
                  Risk: {result.riskLevel}
                </Badge>
                <Badge className={cn("uppercase", getQualityColor(result.tradeQuality))}>
                  Quality: {result.tradeQuality}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Probabilities */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-end mb-4">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Win Probability</div>
            <div className="text-2xl font-bold text-success">{result.winProbability}%</div>
          </div>
          <Progress value={result.winProbability} indicatorClassName="bg-success" className="h-2 bg-success/20" />
        </Card>
        
        <Card className="p-6">
          <div className="flex justify-between items-end mb-4">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Loss Probability</div>
            <div className="text-2xl font-bold text-destructive">{result.lossProbability}%</div>
          </div>
          <Progress value={result.lossProbability} indicatorClassName="bg-destructive" className="h-2 bg-destructive/20" />
        </Card>
      </motion.div>

      {/* Core Analysis Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col">
          <div className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Summary & Advice</div>
          <p className="text-lg text-white font-medium mb-4 leading-relaxed">{result.summary}</p>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 mt-auto">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Recommended Expiry</div>
            <div className="text-xl font-display text-white">{result.recommendedExpiry}</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Market Structure</div>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.marketStructureAnalysis}</p>
        </Card>
      </motion.div>

      {/* Secondary Analysis Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Technical Logic</div>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.technicalLogic}</p>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Candlestick Analysis</div>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.candlestickAnalysis}</p>
        </Card>
      </motion.div>

      {/* Money Management */}
      {result.moneyManagement && (
        <motion.div variants={item}>
          <Card className="border-warning/30 bg-warning/5">
            <div className="p-6 border-b border-warning/10">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <h3 className="text-lg font-display font-semibold text-warning">Money Management Protocol</h3>
              </div>
              <p className="text-sm text-warning/80">{result.moneyManagement.sessionAdvice}</p>
            </div>
            
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Standard Trade</div>
                <div className="text-2xl font-bold text-white">${result.moneyManagement.suggestedTradeAmount}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Max Safe Trade</div>
                <div className="text-2xl font-bold text-white">${result.moneyManagement.maxSafeTradeAmount}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Max Daily Risk</div>
                <div className="text-2xl font-bold text-white">${result.moneyManagement.maxDailyRisk}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Martingale</div>
                <div className="text-sm font-bold text-white mt-2">
                  <Badge variant="outline" className={cn(
                    result.moneyManagement.martingaleRecommendation === "AVOID_COMPLETELY" && "text-destructive border-destructive",
                    result.moneyManagement.martingaleRecommendation === "NOT_RECOMMENDED" && "text-warning border-warning",
                  )}>
                    {result.moneyManagement.martingaleRecommendation.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div variants={item}>
        <div className="bg-black/40 border border-white/5 rounded-lg p-4 text-xs text-muted-foreground text-center">
          {result.disclaimer}
        </div>
      </motion.div>

    </motion.div>
  );
}
