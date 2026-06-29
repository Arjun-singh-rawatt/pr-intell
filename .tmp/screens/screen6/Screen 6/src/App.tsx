import { useEffect } from "react";
import {
  Bell,
  BookOpen,
  Bookmark,
  Bot,
  ChevronsUpDown,
  GitFork,
  GitPullRequest,
  Palette,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Settings,
  Sparkles,
  Trash2,
  TriangleAlert,
  User,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { FallbackComponent } from "./CustomComponents";

export default function App() {
  return (
    <div>
      <div className="font-sans bg-zinc-950 text-neutral-50 flex w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <aside className="shrink-0 bg-zinc-900 border-white/5 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex p-4 flex-col w-64 h-239">
          <div className="flex p-2 items-center gap-2">
            <div className="size-10 shrink-0 rounded-xl bg-[#f54900] flex justify-center items-center">
              <GitPullRequest className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm leading-5">
                PR_Intel
              </span>
              <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                Rocket.Chat
              </span>
            </div>
          </div>
          <nav className="flex mt-6 flex-col gap-1">
            <button className="font-mono rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-3">
              <Zap className="size-4" />
              Feed
            </button>
            <button className="font-mono rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-3">
              <Search className="size-4" />
              Search
            </button>
            <button className="font-mono rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-3">
              <Bookmark className="size-4" />
              Saved
            </button>
            <button className="font-mono rounded-lg bg-zinc-800 text-white text-sm leading-5 flex px-3 py-2 items-center gap-3">
              <Settings className="size-4 text-[#f54900]" />
              Settings
            </button>
          </nav>
          <div className="flex mt-auto flex-col gap-4">
            <div className="rounded-xl bg-zinc-800 flex p-4 flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                  AI_Providers
                </span>
                <span className="text-[#00bc7d] text-xs leading-4 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-[#00bc7d]" />
                  Healthy
                </span>
              </div>
              <div className="font-mono text-xs leading-4 flex justify-between items-center">
                <span className="text-white flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#00bc7d]" />
                  OpenAI
                </span>
                <span className="text-[#f54900]">42ms</span>
              </div>
              <div className="font-mono text-xs leading-4 flex justify-between items-center">
                <span className="text-white flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#00bc7d]" />
                  Anthropic
                </span>
                <span className="text-[#f54900]">58ms</span>
              </div>
              <div className="font-mono text-xs leading-4 flex justify-between items-center">
                <span className="text-white flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#fe9a00]" />
                  Gemini
                </span>
                <span className="text-[#fe9a00]">degraded</span>
              </div>
            </div>
            <div className="flex p-2 items-center gap-3">
              <img
                alt="Alex Doan"
                className="size-9 object-cover rounded-full"
                data-authorname="Christopher Campbell"
                data-authorurl="https://unsplash.com/@chrisjoelcampbell"
                data-blurhash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
                data-photoid="iEEBWgY_6lA"
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdHxlbnwxfHx8fDE3NTQ5MjM3Nzd8MA&ixlib=rb-4.1.0&q=80&w=80"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-white text-sm leading-5">
                  Alex Doan
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">
                  CS Student
                </span>
              </div>
            </div>
          </div>
        </aside>
        <main className="overflow-y-auto p-12 flex-1 h-239">
          <div className="flex flex-col gap-1">
            <h1 className="font-mono font-bold text-3xl leading-9 tracking-tight">
              <span className="text-[#f54900]">SELECT</span>
              <span className="text-[#a1a1a1]">*</span>
              <span className="text-[#f54900]">FROM</span>
              <span className="text-white">system_config</span>
            </h1>
            <p className="text-[#a1a1a1] text-sm leading-5">
              Manage AI providers, repositories, and preferences.
            </p>
          </div>
          <div className="flex mt-8 gap-8">
            <div className="w-1/4 shrink-0">
              <div className="rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-2 flex-col gap-1">
                <button className="font-mono rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
                  <Bot className="size-4" />
                  AI_Providers
                </button>
                <button className="font-mono rounded-lg bg-[#f54900]/10 text-[#f54900] text-sm leading-5 border-[#f54900] border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex px-3 py-2.5 items-center gap-3">
                  <GitFork className="size-4" />
                  Repositories
                </button>
                <button className="font-mono rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
                  <Palette className="size-4" />
                  Appearance
                </button>
                <button className="font-mono rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
                  <Bell className="size-4" />
                  Notifications
                </button>
                <button className="font-mono rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
                  <BookOpen className="size-4" />
                  Knowledge_Base
                </button>
                <button className="font-mono rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3">
                  <User className="size-4" />
                  Account
                </button>
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-6">
              <span className="font-mono text-[#a1a1a1] text-sm leading-5">
                -- repository_config
              </span>
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-zinc-800 flex px-4 py-3 items-center flex-1 gap-3">
                  <Search className="size-4 text-[#a1a1a1]" />
                  <input
                    className="bg-transparent outline-none font-mono text-white text-sm leading-5 w-full"
                    placeholder="Search repositories..."
                  />
                </div>
                <Button className="font-mono bg-[#f54900] text-white px-4 py-3 gap-2 h-auto">
                  <Plus className="size-4" />
                  Add Repository
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono rounded-full bg-zinc-800 text-white text-xs leading-4 flex px-4 py-2 items-center gap-2">
                  <GitFork className="size-3.5 text-[#f54900]" />3 tracked_repos
                </span>
                <span className="font-mono rounded-full bg-zinc-800 text-white text-xs leading-4 flex px-4 py-2 items-center gap-2">
                  <GitPullRequest className="size-3.5 text-[#00bc7d]" />
                  127 total_prs
                </span>
                <span className="font-mono rounded-full bg-zinc-800 text-white text-xs leading-4 flex px-4 py-2 items-center gap-2">
                  <Sparkles className="size-3.5 text-[#ad46ff]" />
                  89 ai_explained
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <Card className="rounded-xl bg-zinc-900 border-white/10 border-1 border-solid p-6 gap-4">
                  <CardHeader className="p-0 gap-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-zinc-800 flex justify-center items-center">
                          <FallbackComponent className="size-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-base leading-6">
                            RocketChat/Rocket.Chat
                          </span>
                          <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                            github.com/RocketChat/Rocket.Chat
                          </span>
                        </div>
                      </div>
                      <span className="font-mono rounded-full bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 flex px-3 py-1 items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-[#00bc7d]" />
                        Active
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex p-0 flex-col gap-4">
                    <div className="flex items-center gap-8">
                      <div className="flex flex-col">
                        <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                          total_prs
                        </span>
                        <span className="font-mono text-white text-sm leading-5">
                          84
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                          ai_explained
                        </span>
                        <span className="font-mono text-[#ad46ff] text-sm leading-5">
                          71
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                          last_sync
                        </span>
                        <span className="font-mono text-[#a1a1a1] text-sm leading-5">
                          12m ago
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-zinc-800 flex px-4 py-3 justify-between items-center">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                            sync_frequency
                          </span>
                          <div className="rounded-md bg-zinc-900 border-white/10 border-1 border-solid flex px-3 py-1.5 items-center gap-2">
                            <span className="font-mono text-white text-xs leading-4">
                              Daily
                            </span>
                            <ChevronsUpDown className="size-3 text-[#a1a1a1]" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                            auto_explain
                          </span>
                          <div className="rounded-full bg-[#f54900] flex px-0.5 justify-end items-center w-9 h-5">
                            <span className="size-4 rounded-full bg-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-0 gap-3">
                    <Button
                      className="bg-transparent font-mono text-white text-xs leading-4 border-white/10 border-0 border-solid px-3 py-2 gap-2 h-auto"
                      variant="outline"
                    >
                      <RefreshCw className="size-3.5" />
                      Sync Now
                    </Button>
                    <Button
                      className="font-mono text-[#ff6467] text-xs leading-4 px-3 py-2 gap-2 h-auto"
                      variant="ghost"
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="rounded-xl bg-zinc-900 border-white/10 border-1 border-solid p-6 gap-4">
                  <CardHeader className="p-0 gap-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-zinc-800 flex justify-center items-center">
                          <FallbackComponent className="size-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-base leading-6">
                            RocketChat/Apps.Framework
                          </span>
                          <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                            github.com/RocketChat/Apps.Framework
                          </span>
                        </div>
                      </div>
                      <span className="font-mono rounded-full bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 flex px-3 py-1 items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-[#00bc7d]" />
                        Active
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex p-0 flex-col gap-4">
                    <div className="flex items-center gap-8">
                      <div className="flex flex-col">
                        <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                          total_prs
                        </span>
                        <span className="font-mono text-white text-sm leading-5">
                          42
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                          ai_explained
                        </span>
                        <span className="font-mono text-[#ad46ff] text-sm leading-5">
                          31
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                          last_sync
                        </span>
                        <span className="font-mono text-[#a1a1a1] text-sm leading-5">
                          2h ago
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-zinc-800 flex px-4 py-3 justify-between items-center">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                            sync_frequency
                          </span>
                          <div className="rounded-md bg-zinc-900 border-white/10 border-1 border-solid flex px-3 py-1.5 items-center gap-2">
                            <span className="font-mono text-white text-xs leading-4">
                              Hourly
                            </span>
                            <ChevronsUpDown className="size-3 text-[#a1a1a1]" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                            auto_explain
                          </span>
                          <div className="rounded-full bg-[#f54900] flex px-0.5 justify-end items-center w-9 h-5">
                            <span className="size-4 rounded-full bg-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-0 gap-3">
                    <Button
                      className="bg-transparent font-mono text-white text-xs leading-4 border-white/10 border-0 border-solid px-3 py-2 gap-2 h-auto"
                      variant="outline"
                    >
                      <RefreshCw className="size-3.5" />
                      Sync Now
                    </Button>
                    <Button
                      className="font-mono text-[#ff6467] text-xs leading-4 px-3 py-2 gap-2 h-auto"
                      variant="ghost"
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="rounded-xl bg-zinc-900 border-white/10 border-1 border-solid p-6 gap-4">
                  <CardHeader className="p-0 gap-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-zinc-800 flex justify-center items-center">
                          <FallbackComponent className="size-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-base leading-6">
                            RocketChat/fuselage
                          </span>
                          <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                            github.com/RocketChat/fuselage
                          </span>
                        </div>
                      </div>
                      <span className="font-mono rounded-full bg-[#fe9a00]/15 text-[#fe9a00] text-xs leading-4 flex px-3 py-1 items-center gap-1.5">
                        <TriangleAlert className="size-3" />
                        Needs attention
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex p-0 flex-col gap-4">
                    <div className="flex items-center gap-8">
                      <div className="flex flex-col">
                        <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                          total_prs
                        </span>
                        <span className="font-mono text-white text-sm leading-5">
                          1
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                          ai_explained
                        </span>
                        <span className="font-mono text-[#ad46ff] text-sm leading-5">
                          0
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                          last_sync
                        </span>
                        <span className="font-mono text-[#a1a1a1] text-sm leading-5">
                          5m ago
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-zinc-800 flex px-4 py-3 justify-between items-center">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                            sync_frequency
                          </span>
                          <div className="rounded-md bg-zinc-900 border-white/10 border-1 border-solid flex px-3 py-1.5 items-center gap-2">
                            <span className="font-mono text-white text-xs leading-4">
                              Daily
                            </span>
                            <ChevronsUpDown className="size-3 text-[#a1a1a1]" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#a1a1a1] text-xs leading-4">
                            auto_explain
                          </span>
                          <div className="rounded-full bg-zinc-700 flex px-0.5 justify-start items-center w-9 h-5">
                            <span className="size-4 rounded-full bg-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-0 gap-3">
                    <Button
                      className="bg-transparent font-mono text-white text-xs leading-4 border-white/10 border-0 border-solid px-3 py-2 gap-2 h-auto"
                      variant="outline"
                    >
                      <RefreshCw className="size-3.5" />
                      Sync Now
                    </Button>
                    <Button
                      className="font-mono text-[#ff6467] text-xs leading-4 px-3 py-2 gap-2 h-auto"
                      variant="ghost"
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div className="flex pt-2 justify-end items-center gap-3">
                <Button
                  className="font-mono text-[#a1a1a1] text-sm leading-5 gap-2"
                  variant="ghost"
                >
                  <RotateCcw className="size-4" />
                  Reset to Defaults
                </Button>
                <Button className="font-mono bg-[#f54900] text-white text-sm leading-5 gap-2">
                  <Save className="size-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
