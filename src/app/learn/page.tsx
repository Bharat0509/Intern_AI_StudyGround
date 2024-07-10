import {
    Bird,
    Settings,
    Share,
    
  } from "lucide-react"
  
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Textarea } from "@/components/ui/textarea"
import UserTopicInput from "@/components/forms/UserTopicInput"
import { explainTopic } from "@/lib/gpt"
  
  type Props = {};


  export const metadata = {
    title: "Dashboard | StudyGround.AI",
    description: "StudyGround.AI - yourself on anything!",
  };

  const LearnPage = async (props: Props) => {
  
    return (
      <div className="grid h-[100vh - 5rem] w-full z-0">
       
        <div className="flex flex-col max-w-7xl">
          <main className="flex-1 gap-4 overflow-auto p-4 ">
          
            {/* <div className="relative flex h-full min-h-[40vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-3">
              <Badge variant="outline" className="absolute right-3 top-3">
                Output
              </Badge>
              
              <div className="flex-1" /> */}
              <UserTopicInput />
            {/* </div> */}
          </main>
        </div>
      </div>
    )
  }

  export default LearnPage
  