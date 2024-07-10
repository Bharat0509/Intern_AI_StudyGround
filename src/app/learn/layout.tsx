import { TooltipProvider } from "@/components/ui/tooltip";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
