import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ActivitySquare, Loader2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalyzeBinary } from "@/api";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { BinaryResult } from "@/components/BinaryResult";
import { toBase64 } from "@/lib/utils";

const PLATFORMS = ["Quotex", "Pocket Option", "Binomo", "IQ Option", "Expert Option", "Other"];
const CURRENCIES = ["USD", "EUR", "GBP", "BDT", "INR"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function Binary() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const analyze = useAnalyzeBinary();

  const form = useForm({
    defaultValues: {
      accountBalance: "",
      accountCurrency: "USD",
      maxRiskPercent: "2",
      experienceLevel: "Intermediate",
      platform: "Quotex",
      marketType: "Real Market",
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
          marketType: values.marketType,
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
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <ActivitySquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white text-glow">Binary Analysis</h1>
          <p className="text-muted-foreground text-sm">Short-timeframe deterministic execution.</p>
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
              <div className="w-24 h-24 border-4 border-primary/20 rounded-full border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-display font-bold text-white text-glow">Processing Telemetry...</h3>
              <p className="text-primary/80 animate-pulse">Running technical models and candlestick patterns</p>
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
            
            <BinaryResult result={analyze.data} />
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
                <Card className="p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-display font-bold text-white">Protocol Parameters</h2>
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
                            <Input type="number" placeholder="e.g. 1000" {...field} />
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
                              <SelectTrigger>
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
                            <Input type="number" step="0.1" placeholder="e.g. 2" {...field} />
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
                              <SelectTrigger>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trading Platform</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
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

                  <Card className="p-6">
                    <FormField
                      control={form.control}
                      name="marketType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Market Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select market type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Real Market">Real Market</SelectItem>
                              <SelectItem value="OTC Market">OTC Market</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Card>
                </div>

                {/* Chart Upload */}
                <Card className="p-6 md:p-8 border-primary/20">
                  <div className="mb-6">
                    <h2 className="text-xl font-display font-bold text-white">Chart Telemetry</h2>
                    <p className="text-sm text-muted-foreground">Upload a clear screenshot of the chart for analysis.</p>
                  </div>
                  
                  <ImageUpload
                    selectedFile={selectedImage}
                    onImageSelected={setSelectedImage}
                    onClear={() => setSelectedImage(null)}
                  />
                </Card>

                {/* Submit */}
                <div className="flex justify-end">
                  <Button type="submit" size="lg" className="w-full md:w-auto px-12 text-lg font-display tracking-wide h-14">
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
