import { useEffect } from "react";
import {
  Bell,
  Bookmark,
  Bot,
  ChevronDown,
  Cpu,
  Database,
  Gavel,
  Gem,
  GitBranch,
  GitPullRequest,
  Palette,
  Plug,
  RotateCcw,
  Save,
  Search,
  Settings,
  Sparkles,
  TriangleAlert,
  User,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function App() {
  return (
    <div>
      <div className="font-mono bg-zinc-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-[956px] flex w-285">
          <aside className="bg-zinc-900 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex p-6 flex-col justify-between w-64">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-2">
                <div className="size-9 rounded-lg bg-[#f54900] text-orange-50 flex justify-center items-center">
                  <GitPullRequest className="size-5" />
                </div>
                <div className="leading-tight flex flex-col">
                  <span className="font-bold text-neutral-50 text-sm leading-5">
                    PR_Intel
                  </span>
                  <span className="text-[#9f9fa9] text-xs leading-4">
                    Rocket.Chat
                  </span>
                </div>
              </div>
              <nav className="flex flex-col gap-1">
                <button className="rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2 items-center gap-2">
                  <Zap className="size-4" />
                  Feed
                </button>
                <button className="rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2 items-center gap-2">
                  <Search className="size-4" />
                  Search
                </button>
                <button className="rounded-lg text-[#9f9fa9] text-sm leading-5 flex px-3 py-2 items-center gap-2">
                  <Bookmark className="size-4" />
                  Saved
                </button>
                <button className="font-semibold rounded-lg bg-[#f54900]/15 text-[#f54900] text-sm leading-5 flex px-3 py-2 items-center gap-2">
                  <Settings className="size-4 text-[#f54900]" />
                  Settings
                </button>
              </nav>
            </div>
            <div className="flex flex-col gap-6">
              <div className="rounded-xl bg-zinc-800 p-4">
                <div className="flex mb-3 justify-between items-center">
                  <span className="text-neutral-50 text-xs leading-4">
                    AI_Providers
                  </span>
                  <span className="text-[#00bc7d] text-xs leading-4 flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#00bc7d]" />
                    Healthy
                  </span>
                </div>
                <div className="text-xs leading-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#9f9fa9]">OpenAI</span>
                    <span className="text-[#00bc7d]">42ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#9f9fa9]">Anthropic</span>
                    <span className="text-[#00bc7d]">58ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#9f9fa9]">Gemini</span>
                    <span className="text-[#fe9a00]">degraded</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="size-9">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGhlYWRzaG90JTIwbWFuJTIwc3R1ZGVudHxlbnwxfDJ8fHwxNzgwMzMxNTAxfDA&ixlib=rb-4.1.0&q=80&w=400"
                    alt="Alex Doan"
                    data-photoid="n4KewLKFOZw"
                    data-authorname="Imansyah Muhamad Putera"
                    data-authorurl="https://unsplash.com/@imansyahmp"
                    data-blurhash="LOE{FM_NK6r=kqt7$*WXE2RjwvWV"
                  />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="leading-tight flex flex-col">
                  <span className="font-semibold text-neutral-50 text-sm leading-5">
                    Alex Doan
                  </span>
                  <span className="text-[#9f9fa9] text-xs leading-4">
                    CS Student
                  </span>
                </div>
              </div>
            </div>
          </aside>
          <main className="overflow-y-auto p-8 flex-1">
            <header className="mb-8">
              <h1 className="font-bold text-2xl leading-8">
                <span className="text-[#f54900]">SELECT</span>
                <span className="text-neutral-50">*</span>
                <span className="text-[#f54900]">FROM</span>
                <span className="text-neutral-50">settings</span>
              </h1>
              <p className="text-[#9f9fa9] text-sm leading-5 mt-1">
                Configure AI providers, repositories, and preferences.
              </p>
            </header>
            <div className="flex gap-6">
              <div className="w-1/4 rounded-xl bg-zinc-900 p-2">
                <nav className="text-sm leading-5 flex flex-col gap-1">
                  <button className="font-semibold rounded-lg bg-[#f54900]/10 text-[#f54900] border-[#f54900] border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex px-3 py-2 items-center gap-2">
                    <Cpu className="size-4" />
                    AI_Providers
                  </button>
                  <button className="border-transparent rounded-lg text-[#9f9fa9] border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex px-3 py-2 items-center gap-2">
                    <GitBranch className="size-4" />
                    Repositories
                  </button>
                  <button className="border-transparent rounded-lg text-[#9f9fa9] border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex px-3 py-2 items-center gap-2">
                    <Palette className="size-4" />
                    Appearance
                  </button>
                  <button className="border-transparent rounded-lg text-[#9f9fa9] border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex px-3 py-2 items-center gap-2">
                    <Bell className="size-4" />
                    Notifications
                  </button>
                  <button className="border-transparent rounded-lg text-[#9f9fa9] border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex px-3 py-2 items-center gap-2">
                    <Database className="size-4" />
                    Knowledge_Base
                  </button>
                  <button className="border-transparent rounded-lg text-[#9f9fa9] border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex px-3 py-2 items-center gap-2">
                    <User className="size-4" />
                    Account
                  </button>
                </nav>
              </div>
              <div className="w-3/4 flex flex-col gap-6">
                <div>
                  <h2 className="font-semibold text-[#f54900] text-lg leading-7">
                    AI_Providers
                  </h2>
                  <p className="text-[#9f9fa9] text-sm leading-5">
                    Manage API keys, models, and connection health for each
                    provider.
                  </p>
                </div>
                <Card className="rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-6 gap-4">
                  <CardHeader className="flex p-0 flex-row justify-between items-center gap-2">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-zinc-800 flex justify-center items-center">
                        <Sparkles className="size-4 text-neutral-50" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-50 text-sm leading-5">
                          OpenAI
                        </span>
                        <span className="text-[#00bc7d] text-xs leading-4">
                          42ms
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 px-2 py-0.5">
                        42ms
                      </span>
                      <Switch defaultChecked={true} />
                    </div>
                  </CardHeader>
                  <CardContent className="flex p-0 flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[#9f9fa9] text-xs leading-4">
                        api_key
                      </label>
                      <Input
                        type="password"
                        defaultValue="sk-xxxxxxxxxxxxxxxxxxxx"
                        className="font-mono bg-zinc-800 text-sm leading-5 border-white/10 border-0 border-solid"
                      />
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col flex-1 gap-1">
                        <label className="text-[#9f9fa9] text-xs leading-4">
                          model
                        </label>
                        <div className="rounded-lg bg-zinc-800 text-sm leading-5 border-white/10 border-1 border-solid flex px-3 py-2 justify-between items-center">
                          <span>gpt-4o</span>
                          <ChevronDown className="size-4 text-[#9f9fa9]" />
                        </div>
                      </div>
                      <Button variant="ghost" className="text-sm leading-5">
                        <Plug className="size-4" />
                        Test Connection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-6 gap-4">
                  <CardHeader className="flex p-0 flex-row justify-between items-center gap-2">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-zinc-800 flex justify-center items-center">
                        <Bot className="size-4 text-neutral-50" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-50 text-sm leading-5">
                          Anthropic
                        </span>
                        <span className="text-[#00bc7d] text-xs leading-4">
                          58ms
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 px-2 py-0.5">
                        58ms
                      </span>
                      <Switch defaultChecked={true} />
                    </div>
                  </CardHeader>
                  <CardContent className="flex p-0 flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[#9f9fa9] text-xs leading-4">
                        api_key
                      </label>
                      <Input
                        type="password"
                        defaultValue="sk-ant-xxxxxxxxxxxxxxxx"
                        className="font-mono bg-zinc-800 text-sm leading-5 border-white/10 border-0 border-solid"
                      />
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col flex-1 gap-1">
                        <label className="text-[#9f9fa9] text-xs leading-4">
                          model
                        </label>
                        <div className="rounded-lg bg-zinc-800 text-sm leading-5 border-white/10 border-1 border-solid flex px-3 py-2 justify-between items-center">
                          <span>claude-3-5-sonnet</span>
                          <ChevronDown className="size-4 text-[#9f9fa9]" />
                        </div>
                      </div>
                      <Button variant="ghost" className="text-sm leading-5">
                        <Plug className="size-4" />
                        Test Connection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl bg-zinc-900 border-[#fe9a00]/30 border-1 border-solid p-6 gap-4">
                  <CardHeader className="flex p-0 flex-row justify-between items-center gap-2">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-zinc-800 flex justify-center items-center">
                        <Gem className="size-4 text-neutral-50" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-50 text-sm leading-5 flex items-center gap-1">
                          Gemini
                          <TriangleAlert className="size-3.5 text-[#fe9a00]" />
                        </span>
                        <span className="text-[#fe9a00] text-xs leading-4">
                          340ms
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#fe9a00]/15 text-[#fe9a00] text-xs leading-4 px-2 py-0.5">
                        degraded
                      </span>
                      <Switch defaultChecked={true} />
                    </div>
                  </CardHeader>
                  <CardContent className="flex p-0 flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[#9f9fa9] text-xs leading-4">
                        api_key
                      </label>
                      <Input
                        type="password"
                        defaultValue="AIzaxxxxxxxxxxxxxxxxxxxx"
                        className="font-mono bg-zinc-800 text-sm leading-5 border-white/10 border-0 border-solid"
                      />
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col flex-1 gap-1">
                        <label className="text-[#9f9fa9] text-xs leading-4">
                          model
                        </label>
                        <div className="rounded-lg bg-zinc-800 text-sm leading-5 border-white/10 border-1 border-solid flex px-3 py-2 justify-between items-center">
                          <span>gemini-1.5-pro</span>
                          <ChevronDown className="size-4 text-[#9f9fa9]" />
                        </div>
                      </div>
                      <Button variant="ghost" className="text-sm leading-5">
                        <Plug className="size-4" />
                        Test Connection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-6 gap-4">
                  <CardHeader className="flex p-0 flex-row items-center gap-2">
                    <div className="size-9 rounded-lg bg-[#ad46ff]/15 flex justify-center items-center">
                      <Gavel className="size-4 text-[#ad46ff]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-neutral-50 text-sm leading-5">
                        judge_agent
                      </span>
                      <span className="text-[#9f9fa9] text-xs leading-4">
                        Scoring configuration for AI explanations.
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex p-0 flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <div className="text-sm leading-5 flex justify-between items-center">
                        <label className="text-[#9f9fa9]">
                          min_score_threshold
                        </label>
                        <span className="text-[#f54900]">7.0</span>
                      </div>
                      <div className="relative rounded-full bg-zinc-800 w-full h-1.5">
                        <div className="w-[70%] rounded-full bg-[#f54900] absolute left-0 top-0 h-1.5" />
                        <div className="left-[70%] top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950 border-[#f54900] border-2 border-solid absolute" />
                      </div>
                    </div>
                    <div className="rounded-lg bg-zinc-800 flex px-3 py-2 justify-between items-center">
                      <label className="text-[#9f9fa9] text-sm leading-5">
                        auto_rerank
                      </label>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[#9f9fa9] text-xs leading-4">
                        scoring_model
                      </label>
                      <div className="rounded-lg bg-zinc-800 text-sm leading-5 border-white/10 border-1 border-solid flex px-3 py-2 justify-between items-center">
                        <span>gpt-4o</span>
                        <ChevronDown className="size-4 text-[#9f9fa9]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex pb-4 items-center gap-3">
                  <Button className="rounded-lg bg-[#f54900] text-orange-50">
                    <Save className="size-4" />
                    Save Changes
                  </Button>
                  <Button variant="ghost" className="rounded-lg text-[#9f9fa9]">
                    <RotateCcw className="size-4" />
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
