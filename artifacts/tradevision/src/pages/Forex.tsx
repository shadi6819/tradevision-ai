import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Loader2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalyzeForex } from "@/api";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ImageUpload";
import { ForexResult } from "@/components/ForexResult";
import { toBase64 } from "@/lib/utils";

const PLATFORMS = ["Exness", "MetaTrader 4", "MetaTrader 5", "TradingView", "cTrader", "Other"];
const CURRENCIES = ["USD", "EUR", "GBP", "BDT", "INR"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function Forex() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const analyze = useAnalyzeForex();

  const form = useForm({
    defaultValues: {
      accountBalance: "",
      accountCurrency: "USD",
      maxRiskPercent: "1",
      experienceLevel: "Intermediate",
      platform: "MetaTrader 5",
    },
  });

  const onSubmit = async (values: any) => {
    if (!selectedImage) {
      toast({
        title: "Telemetry Missing",
        description: "Please upload a chart image for analysis.",
        variant: "destructive",
      });
      return;
    }

    try {
      const base64 = await toBase64(selectedImage);
      
      analyze.mutate({
        data: {
          imageBase64: base64,
          platform: values.platform,
          accountBalance: values.accountBalance ? Number(values.accountBalance) : undefined,
          accountCurrency: values.accountCurrency,
          maxRiskPercent: values.maxRiskPercent ? Number(values.maxRiskPercent) : undefined,
          experienceLevel: values.experienceLevel,
        }
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error processing the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          <Globe2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white text-glow">Forex Analysis</h1>
          <p className="text-muted-foreground text-sm">Structural market intelligence & zone projection.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {analyze.isPending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 space-y-6"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-purple-500/20 rounded-full border-t-purple-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-display font-bold text-white text-glow">Projecting Zones...</h3>
              <p className="text-purple-400/80 animate-pulse">Calculating liquidity voids and market structure</p>
            </div>
          </motion.div>
        ) : analyze.data ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-white">Analysis Complete</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => analyze.reset()}>
                New Analysis
              </Button>
            </div>
            
            <ForexResult result={analyze.data} />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Protocol Parameters */}
                <Card className="p-6 md:p-8 border-purple-500/10">
                  <div className="mb-6">
                    <h2 className="text-xl font-display font-bold text-white">Risk Parameters</h2>
                    <p className="text-sm text-muted-foreground">Configure the execution environment (optional)</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="accountBalance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Balance</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 1000" className="focus-visible:ring-purple-500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accountCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="focus:ring-purple-500">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CURRENCIES.map((currency) => (
                                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxRiskPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Risk per Trade (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="e.g. 1" className="focus-visible:ring-purple-500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="focus:ring-purple-500">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EXPERIENCE_LEVELS.map((level) => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                {/* Market & Platform */}
                <Card className="p-6 border-purple-500/10">
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trading Platform / Data Source</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-purple-500">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PLATFORMS.map((platform) => (
                              <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>

                {/* Chart Upload */}
                <Card className="p-6 md:p-8 border-purple-500/30">
                  <div className="mb-6">
                    <h2 className="text-xl font-display font-bold text-white">Chart Telemetry</h2>
                    <p className="text-sm text-muted-foreground">Upload a clear screenshot of the chart for analysis. Include visible timeframe.</p>
                  </div>
                  
                  <ImageUpload
                    selectedFile={selectedImage}
                    onImageSelected={setSelectedImage}
                    onClear={() => setSelectedImage(null)}
                    className="hover:border-purple-500/50"
                  />
                </Card>

                {/* Submit */}
                <div className="flex justify-end">
                  <Button type="submit" size="lg" className="w-full md:w-auto px-12 text-lg font-display tracking-wide h-14 bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_0_rgba(168,85,247,0.3)]">
                    Initialize Analysis
                  </Button>
                </div>

                {analyze.isError && (
                  <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm text-center">
                    System Error: Failed to process telemetry. Please verify chart image and try again.
                  </div>
                )}
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
