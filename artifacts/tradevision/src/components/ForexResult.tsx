import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, MinusCircle, AlertTriangle, Target, Shield, Crosshair } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ForexAnalysisResult } from "@/api";
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

export function ForexResult({ result }: { result: ForexAnalysisResult }) {
  const isBuy = result.direction === "BUY";
  const isSell = result.direction === "SELL";
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
          isBuy && "border-success/50 glow-green bg-success/5",
          isSell && "border-destructive/50 glow-red bg-destructive/5",
          isNoTrade && "border-white/10 bg-white/5"
        )}>
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {isBuy && <ArrowUpRight className="w-20 h-20 text-success animate-pulse" />}
              {isSell && <ArrowDownRight className="w-20 h-20 text-destructive animate-pulse" />}
              {isNoTrade && <MinusCircle className="w-20 h-20 text-muted-foreground" />}
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-widest">
                  Signal Output
                </div>
                <h2 className={cn(
                  "text-5xl font-display font-bold text-glow",
                  isBuy && "text-success",
                  isSell && "text-destructive",
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
                <Badge variant="outline" className="uppercase text-purple-400 border-purple-400/30 bg-purple-400/10">
                  Trend: {result.trendDirection}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Trade Parameters (Entry, SL, TP) */}
      {!isNoTrade && (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-l-4 border-l-primary bg-primary/5">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Target className="w-5 h-5" />
              <div className="text-sm font-medium uppercase tracking-widest">Entry Zone</div>
            </div>
            <div className="text-xl font-display font-bold text-white">{result.entryZone}</div>
          </Card>
          
          <Card className="p-6 border-l-4 border-l-destructive bg-destructive/5">
            <div className="flex items-center gap-2 mb-4 text-destructive">
              <Shield className="w-5 h-5" />
              <div className="text-sm font-medium uppercase tracking-widest">Stop Loss</div>
            </div>
            <div className="text-xl font-display font-bold text-white">{result.stopLossZone}</div>
          </Card>
          
          <Card className="p-6 border-l-4 border-l-success bg-success/5">
            <div className="flex items-center gap-2 mb-4 text-success">
              <Crosshair className="w-5 h-5" />
              <div className="text-sm font-medium uppercase tracking-widest">Take Profit</div>
            </div>
            <div className="text-xl font-display font-bold text-white">{result.takeProfitZone}</div>
          </Card>
        </motion.div>
      )}

      {/* R:R Ratio & Summary */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col justify-center items-center text-center bg-white/5">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Risk:Reward Ratio</div>
          <div className="text-4xl font-display font-bold text-purple-400 text-glow">{result.riskRewardRatio}</div>
        </Card>
        
        <Card className="p-6 md:col-span-2">
          <div className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Executive Summary</div>
          <p className="text-lg text-white font-medium leading-relaxed">{result.summary}</p>
        </Card>
      </motion.div>

      {/* Detailed Analysis Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Market Structure</div>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.marketStructureAnalysis}</p>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Momentum & Volatility</div>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.momentumAnalysis}</p>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap border-t border-white/10 pt-4">{result.volatilityAnalysis}</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Key Levels</div>
          <div className="space-y-4">
            {result.supportResistance && (
              <div>
                <h4 className="text-white text-sm font-medium mb-1">Support & Resistance</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{result.supportResistance}</p>
              </div>
            )}
            {result.supplyDemandZones && (
              <div>
                <h4 className="text-white text-sm font-medium mb-1">Supply & Demand Zones</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{result.supplyDemandZones}</p>
              </div>
            )}
            {result.liquidityAnalysis && (
              <div>
                <h4 className="text-white text-sm font-medium mb-1">Liquidity Analysis</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{result.liquidityAnalysis}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Technical Indicators</div>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.technicalIndicators}</p>
          
          <div className="mt-6">
            <h4 className="text-white text-sm font-medium mb-2">Candlestick Action</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">{result.candlestickAnalysis}</p>
          </div>
        </Card>
      </motion.div>

      {/* Money Management */}
      {result.moneyManagement && (
        <motion.div variants={item}>
          <Card className="border-warning/30 bg-warning/5">
            <div className="p-6 border-b border-warning/10">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <h3 className="text-lg font-display font-semibold text-warning">Risk Management Protocol</h3>
              </div>
              <p className="text-sm text-warning/80">{result.moneyManagement.sessionAdvice}</p>
            </div>
            
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Recommended Risk</div>
                <div className="text-2xl font-bold text-white">{result.moneyManagement.recommendedRiskPercent}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Suggested Trade</div>
                <div className="text-2xl font-bold text-white">${result.moneyManagement.suggestedTradeAmount}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Max Daily Risk</div>
                <div className="text-2xl font-bold text-white">${result.moneyManagement.maxDailyRisk}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Capital Protection</div>
                <div className="text-sm font-medium text-warning mt-1 leading-snug">
                  {result.moneyManagement.capitalProtectionNote}
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
