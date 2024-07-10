"use client";
import { CornerDownLeft, Mic, Paperclip, Share } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useState } from "react";
import { explainTopic } from "@/lib/gpt";
import ReactMarkdown from "react-markdown";

const UserTopicInput = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<object[]>([]);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [history, setHistory] = useState([]);
  const handleClick = async () => {
    if (!modelUrl) {
      await fetch(
          `https://api.sketchfab.com/v3/search?type=models&q=${prompt}&downloadable=false&archives_flavours=false`
      )
          .then((res) => res.json())
          .then((data) => data?.results)
          .then((data) => {
              if (data?.[0]?.embedUrl) {
                  setModelUrl(
                      `${data?.[0]?.embedUrl}?ui_infos=0&ui_watermark_link=0&ui_watermark=0`
                  );
              }
          });
  }
    const res = await explainTopic(prompt, setHistory);
    console.log("Res: ",res)
    setResponse([...response, ...res]);
  };
  
  const handleCreateMindMap = async () => {
    const res = await explainTopic(
      "Provide MindMap from all history content so student can easily remember",
      setHistory
    );
    setResponse([...response, ...res]);
  };
  return (
    <div className="relative flex w-full min-h-[30vh] flex-col rounded-xl overflow-x-hidden bg-muted/50 p-4 scrollbar-none">
      {/* <Badge variant="outline" className="absolute right-3 top-3">
        Output
      </Badge> */}
      <div className="h-[28rem] overflow-scroll w-full flex flex-col">
        {response &&
          response?.map((res, idx) =>
            res.type === "image" ? (
              <img src="res.url" key={idx} />
            ) : res.type === "details" ? (
              <div className="py-4" key={idx}>
                
                <ReactMarkdown children={res.content} />
              </div>
            ) : (
              // <iframe
              //   key={idx}
              //   title="MatCap Demo: Koschey"
              //   allow="autoplay; fullscreen; xr-spatial-tracking"
              //   xr-spatial-tracking="true"
              //   web-share="true"
              //   src={res.url}
              //   className="h-full w-full"
              // />
              <></>
            )
          )}
          <div className="h-[25rem] px-10">
          {modelUrl && <iframe
                title="MatCap Demo: Koschey"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                xr-spatial-tracking="true"
                web-share="true"
                src={modelUrl}
                className="h-[30rem] w-full"
              />}
          </div>
      </div>
      {/* <Button
        variant="outline"
        size="sm"
        className="ml-auto gap-1.5 text-sm"
        onClick={handleCreateMindMap}
      >
        <Share className="size-3.5" /> Create Mindmap
      </Button> */}
      <div className="flex-1" />

      <form
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        x-chunk="dashboard-03-chunk-1"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Type your topic here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex items-center p-3 pt-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Paperclip className="size-4" />
                <span className="sr-only">Attach file</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Attach File</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Mic className="size-4" />
                <span className="sr-only">Use Microphone</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Use Microphone</TooltipContent>
          </Tooltip>
          <Button
            type="button"
            onClick={handleClick}
            size="sm"
            className="ml-auto gap-1.5"
          >
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
};
export default UserTopicInput;
