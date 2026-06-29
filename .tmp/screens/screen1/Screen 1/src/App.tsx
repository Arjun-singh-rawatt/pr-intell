import { useEffect } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Bookmark,
  Database,
  FileDiff,
  GitMerge,
  GitPullRequest,
  Minus,
  Plus,
  RefreshCw,
  RotateCw,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 flex w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <aside className="shrink-0 bg-neutral-900 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex p-6 flex-col justify-between w-64 h-239">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-lg bg-[#1447e6] flex justify-center items-center">
                <GitPullRequest className="size-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm leading-5 tracking-tight">
                  PR Intel
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">
                  Rocket.Chat
                </span>
              </div>
            </div>
            <nav className="flex flex-col justify-start items-start gap-1">
              <button className="font-medium rounded-lg bg-neutral-800 text-neutral-50 text-sm leading-5 flex px-3 py-2 items-center gap-3 w-full">
                <Zap className="size-4" />
                Feed
              </button>
              <button className="font-medium rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-3 w-full">
                <Search className="size-4" />
                Search
              </button>
              <button className="font-medium rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-3 w-full">
                <Bookmark className="size-4" />
                Saved
              </button>
              <button className="font-medium rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-3 w-full">
                <Settings className="size-4" />
                Settings
              </button>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border-white/10 border-1 border-solid flex p-4 flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#a1a1a1] text-xs leading-4">
                  AI Providers
                </span>
                <span className="text-[#00bc7d] text-xs leading-4 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#00bc7d]" />
                  Healthy
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xs leading-4 flex justify-between items-center">
                  <span className="text-neutral-50">OpenAI</span>
                  <span className="text-[#a1a1a1]">42ms</span>
                </div>
                <div className="text-xs leading-4 flex justify-between items-center">
                  <span className="text-neutral-50">Anthropic</span>
                  <span className="text-[#a1a1a1]">58ms</span>
                </div>
                <div className="text-xs leading-4 flex justify-between items-center">
                  <span className="text-neutral-50">Gemini</span>
                  <span className="text-[#fe9a00]">degraded</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg flex px-2 py-1 items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage
                  alt="User"
                  data-authorname="Diego Hernández"
                  data-authorurl="https://unsplash.com/@__diegohh"
                  data-blurhash="LVJ@%b%1tlIVXTIpWDRj0Ks-ivoL"
                  data-photoid="MSepzbKFz10"
                  src="https://images.unsplash.com/photo-1654110455429-cf322b40a906?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBwcm9ncmFtbWVyJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfDJ8fHwxNzgwMzMwODI5fDA&ixlib=rb-4.1.0&q=80&w=400"
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm leading-5">Alex Doan</span>
                <span className="text-[#a1a1a1] text-xs leading-4">
                  CS Student
                </span>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex flex-col flex-1 h-239 overflow-hidden">
          <header className="flex px-8 pt-8 pb-4 justify-between items-end">
            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-2xl leading-8 tracking-tight">
                Contributor Feed
              </h1>
              <p className="text-[#a1a1a1] text-sm leading-5">
                Merged pull requests, explained for humans.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="top-1/2 -translate-y-1/2 size-4 text-[#a1a1a1] absolute left-3" />
                <Input
                  className="bg-neutral-900 border-white/10 border-0 border-solid pl-9 w-64"
                  placeholder="Search PRs, files, authors..."
                />
              </div>
              <Button
                className="border-white/10 border-0 border-solid gap-2"
                variant="outline"
              >
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
              <Button className="bg-neutral-200 text-neutral-900 gap-2">
                <RefreshCw className="size-4" />
                Sync
              </Button>
            </div>
          </header>
          <div className="grid grid-cols-4 px-8 pb-4 gap-4">
            <Card className="p-4 gap-1">
              <CardContent className="flex p-0 flex-col gap-1">
                <div className="text-[#a1a1a1] flex items-center gap-2">
                  <GitMerge className="size-4 text-[#00bc7d]" />
                  <span className="text-xs leading-4">Merged this week</span>
                </div>
                <span className="font-semibold text-2xl leading-8 tracking-tight">
                  128
                </span>
                <span className="text-[#00bc7d] text-xs leading-4">
                  +18% vs last week
                </span>
              </CardContent>
            </Card>
            <Card className="p-4 gap-1">
              <CardContent className="flex p-0 flex-col gap-1">
                <div className="text-[#a1a1a1] flex items-center gap-2">
                  <Users className="size-4 text-[#1447e6]" />
                  <span className="text-xs leading-4">Active contributors</span>
                </div>
                <span className="font-semibold text-2xl leading-8 tracking-tight">
                  37
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">
                  across 9 repos
                </span>
              </CardContent>
            </Card>
            <Card className="p-4 gap-1">
              <CardContent className="flex p-0 flex-col gap-1">
                <div className="text-[#a1a1a1] flex items-center gap-2">
                  <Sparkles className="size-4 text-[#ad46ff]" />
                  <span className="text-xs leading-4">AI explanations</span>
                </div>
                <span className="font-semibold text-2xl leading-8 tracking-tight">
                  512
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">
                  judge avg 8.7/10
                </span>
              </CardContent>
            </Card>
            <Card className="p-4 gap-1">
              <CardContent className="flex p-0 flex-col gap-1">
                <div className="text-[#a1a1a1] flex items-center gap-2">
                  <Database className="size-4 text-[#fe9a00]" />
                  <span className="text-xs leading-4">KB documents</span>
                </div>
                <span className="font-semibold text-2xl leading-8 tracking-tight">
                  2,140
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">
                  indexed for RAG
                </span>
              </CardContent>
            </Card>
          </div>
          <div className="flex px-8 pb-3 items-center gap-2">
            <Button
              className="rounded-full bg-neutral-800 text-neutral-50 gap-1.5"
              size="sm"
              variant="secondary"
            >
              <Zap className="size-3.5" />
              All
            </Button>
            <Button
              className="rounded-full text-[#a1a1a1]"
              size="sm"
              variant="ghost"
            >
              Beginner friendly
            </Button>
            <Button
              className="rounded-full text-[#a1a1a1]"
              size="sm"
              variant="ghost"
            >
              Bug fixes
            </Button>
            <Button
              className="rounded-full text-[#a1a1a1]"
              size="sm"
              variant="ghost"
            >
              Features
            </Button>
            <Button
              className="rounded-full text-[#a1a1a1]"
              size="sm"
              variant="ghost"
            >
              Docs
            </Button>
          </div>
          <div className="overflow-y-auto flex px-8 pb-8 flex-col flex-1 gap-4">
            <Card className="transition-colors p-6 gap-4">
              <CardHeader className="p-0 gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage
                        alt="Maya"
                        data-authorname="Madalyn Cox"
                        data-authorurl="https://unsplash.com/@madalyncox"
                        data-blurhash="LMF={%~q-;fQ4n9F-;WB?bayM{of"
                        data-photoid="ulMu6bO2brM"
                        src="https://images.unsplash.com/photo-1643908091873-a64caefd35fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGVuZ2luZWVyJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfDJ8fHwxNzgwMjIxMzE4fDA&ixlib=rb-4.1.0&q=80&w=400"
                      />
                      <AvatarFallback>MK</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm leading-5">
                          Maya Krishnan
                        </span>
                        <Badge
                          className="rounded-full bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 border-black/1 border-0 border-solid gap-1"
                          variant="secondary"
                        >
                          <GitMerge className="size-3" />
                          Merged
                        </Badge>
                        <Badge
                          className="rounded-full bg-[#1447e6]/15 text-[#1447e6] text-xs leading-4 border-black/1 border-0 border-solid"
                          variant="secondary"
                        >
                          Beginner friendly
                        </Badge>
                      </div>
                      <span className="text-[#a1a1a1] text-xs leading-4">
                        rocketchat/Rocket.Chat #28471 · 2h ago
                      </span>
                    </div>
                  </div>
                  <Button
                    className="text-[#a1a1a1]"
                    size="icon"
                    variant="ghost"
                  >
                    <Bookmark className="size-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-base leading-6 tracking-tight">
                  Fix message reaction count not updating in real time
                </h3>
              </CardHeader>
              <CardContent className="flex p-0 flex-col gap-4">
                <div className="rounded-lg bg-neutral-800/40 border-white/10 border-1 border-solid flex p-4 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-[#ad46ff]" />
                    <span className="font-medium text-[#ad46ff] text-xs leading-4">
                      AI Summary
                    </span>
                    <Badge
                      className="rounded-full bg-neutral-800 text-[#a1a1a1] text-xs leading-4 border-black/1 border-0 border-solid ml-auto"
                      variant="secondary"
                    >
                      Judge 9.1/10
                    </Badge>
                  </div>
                  <p className="leading-relaxed text-[#a1a1a1] text-sm leading-5">
                    This PR fixes a bug where reaction counts froze until a page
                    refresh. The author subscribed the reaction component to the
                    live message stream, so updates now render instantly. Great
                    example of reactive state handling for newcomers.
                  </p>
                  <div className="flex pt-1 items-center gap-2">
                    <BookOpenCheck className="size-3.5 text-[#fe9a00]" />
                    <span className="text-[#a1a1a1] text-xs leading-4">
                      Context from
                    </span>
                    <span className="underline-offset-2 underline text-[#fe9a00] text-xs leading-4">
                      streams.md
                    </span>
                    <span className="underline-offset-2 underline text-[#fe9a00] text-xs leading-4">
                      reactions-api.md
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex p-0 items-center gap-4">
                <span className="text-[#a1a1a1] text-xs leading-4 flex items-center gap-1.5">
                  <FileDiff className="size-3.5" />4 files
                </span>
                <span className="text-[#00bc7d] text-xs leading-4 flex items-center gap-1.5">
                  <Plus className="size-3.5" />
                  62
                </span>
                <span className="text-[#ff6467] text-xs leading-4 flex items-center gap-1.5">
                  <Minus className="size-3.5" />
                  11
                </span>
                <Button
                  className="border-white/10 border-0 border-solid ml-auto gap-1.5"
                  size="sm"
                  variant="outline"
                >
                  <RotateCw className="size-3.5" />
                  Re-explain
                </Button>
                <Button
                  className="bg-neutral-200 text-neutral-900 gap-1.5"
                  size="sm"
                >
                  View details
                  <ArrowRight className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
            <Card className="transition-colors p-6 gap-4">
              <CardHeader className="p-0 gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage
                        alt="Leo"
                        data-authorname="True Agency"
                        data-authorurl="https://unsplash.com/@trueagency"
                        data-blurhash="LPLENSNe%2%MI:~qIURj_3IAM{Rj"
                        data-photoid="o4UhdLv5jbQ"
                        src="https://images.unsplash.com/photo-1536104968055-4d61aa56f46a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGRldmVsb3BlciUyMG1hbiUyMGNvZGluZyUyMHBvcnRyYWl0fGVufDF8Mnx8fDE3ODAzMzA4Mjl8MA&ixlib=rb-4.1.0&q=80&w=400"
                      />
                      <AvatarFallback>LO</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm leading-5">
                          Leo Okafor
                        </span>
                        <Badge
                          className="rounded-full bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 border-black/1 border-0 border-solid gap-1"
                          variant="secondary"
                        >
                          <GitMerge className="size-3" />
                          Merged
                        </Badge>
                        <Badge
                          className="rounded-full bg-[#ad46ff]/15 text-[#ad46ff] text-xs leading-4 border-black/1 border-0 border-solid"
                          variant="secondary"
                        >
                          Feature
                        </Badge>
                      </div>
                      <span className="text-[#a1a1a1] text-xs leading-4">
                        rocketchat/Rocket.Chat #28455 · 5h ago
                      </span>
                    </div>
                  </div>
                  <Button
                    className="text-[#a1a1a1]"
                    size="icon"
                    variant="ghost"
                  >
                    <Bookmark className="size-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-base leading-6 tracking-tight">
                  Add slash command for scheduling recurring messages
                </h3>
              </CardHeader>
              <CardContent className="flex p-0 flex-col gap-4">
                <div className="rounded-lg bg-neutral-800/40 border-white/10 border-1 border-solid flex p-4 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-[#ad46ff]" />
                    <span className="font-medium text-[#ad46ff] text-xs leading-4">
                      AI Summary
                    </span>
                    <Badge
                      className="rounded-full bg-neutral-800 text-[#a1a1a1] text-xs leading-4 border-black/1 border-0 border-solid ml-auto"
                      variant="secondary"
                    >
                      Judge 8.4/10
                    </Badge>
                  </div>
                  <p className="leading-relaxed text-[#a1a1a1] text-sm leading-5">
                    Introduces a /schedule command that lets users queue
                    recurring messages via a cron-style picker. The author wired
                    the command into the existing slash registry and added a job
                    runner. A solid intro to how Rocket.Chat extends its command
                    system.
                  </p>
                  <div className="flex pt-1 items-center gap-2">
                    <BookOpenCheck className="size-3.5 text-[#fe9a00]" />
                    <span className="text-[#a1a1a1] text-xs leading-4">
                      Context from
                    </span>
                    <span className="underline-offset-2 underline text-[#fe9a00] text-xs leading-4">
                      slash-commands.md
                    </span>
                    <span className="underline-offset-2 underline text-[#fe9a00] text-xs leading-4">
                      scheduler.md
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex p-0 items-center gap-4">
                <span className="text-[#a1a1a1] text-xs leading-4 flex items-center gap-1.5">
                  <FileDiff className="size-3.5" />
                  11 files
                </span>
                <span className="text-[#00bc7d] text-xs leading-4 flex items-center gap-1.5">
                  <Plus className="size-3.5" />
                  284
                </span>
                <span className="text-[#ff6467] text-xs leading-4 flex items-center gap-1.5">
                  <Minus className="size-3.5" />7
                </span>
                <Button
                  className="border-white/10 border-0 border-solid ml-auto gap-1.5"
                  size="sm"
                  variant="outline"
                >
                  <RotateCw className="size-3.5" />
                  Re-explain
                </Button>
                <Button
                  className="bg-neutral-200 text-neutral-900 gap-1.5"
                  size="sm"
                >
                  View details
                  <ArrowRight className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
            <Card className="transition-colors p-6 gap-4">
              <CardHeader className="p-0 gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-[#ff2056]/20 text-[#ff2056]">
                        SP
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm leading-5">
                          Sara Pereira
                        </span>
                        <Badge
                          className="rounded-full bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 border-black/1 border-0 border-solid gap-1"
                          variant="secondary"
                        >
                          <GitMerge className="size-3" />
                          Merged
                        </Badge>
                        <Badge
                          className="rounded-full bg-[#fe9a00]/15 text-[#fe9a00] text-xs leading-4 border-black/1 border-0 border-solid"
                          variant="secondary"
                        >
                          Docs
                        </Badge>
                      </div>
                      <span className="text-[#a1a1a1] text-xs leading-4">
                        rocketchat/docs #1932 · 8h ago
                      </span>
                    </div>
                  </div>
                  <Button
                    className="text-[#a1a1a1]"
                    size="icon"
                    variant="ghost"
                  >
                    <Bookmark className="size-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-base leading-6 tracking-tight">
                  Document the apps-engine permission model with examples
                </h3>
              </CardHeader>
              <CardContent className="flex p-0 flex-col gap-4">
                <div className="rounded-lg bg-neutral-800/40 border-white/10 border-1 border-solid flex p-4 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-[#ad46ff]" />
                    <span className="font-medium text-[#ad46ff] text-xs leading-4">
                      AI Summary
                    </span>
                    <Badge
                      className="rounded-full bg-neutral-800 text-[#a1a1a1] text-xs leading-4 border-black/1 border-0 border-solid ml-auto"
                      variant="secondary"
                    >
                      Judge 8.9/10
                    </Badge>
                  </div>
                  <p className="leading-relaxed text-[#a1a1a1] text-sm leading-5">
                    Adds a clear guide explaining how the apps-engine grants and
                    checks permissions, with copy-paste manifest snippets. This
                    is the kind of contribution that lowers the barrier for new
                    app developers without touching core code.
                  </p>
                  <div className="flex pt-1 items-center gap-2">
                    <BookOpenCheck className="size-3.5 text-[#fe9a00]" />
                    <span className="text-[#a1a1a1] text-xs leading-4">
                      Context from
                    </span>
                    <span className="underline-offset-2 underline text-[#fe9a00] text-xs leading-4">
                      apps-engine.md
                    </span>
                    <span className="underline-offset-2 underline text-[#fe9a00] text-xs leading-4">
                      permissions.md
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex p-0 items-center gap-4">
                <span className="text-[#a1a1a1] text-xs leading-4 flex items-center gap-1.5">
                  <FileDiff className="size-3.5" />2 files
                </span>
                <span className="text-[#00bc7d] text-xs leading-4 flex items-center gap-1.5">
                  <Plus className="size-3.5" />
                  148
                </span>
                <span className="text-[#ff6467] text-xs leading-4 flex items-center gap-1.5">
                  <Minus className="size-3.5" />3
                </span>
                <Button
                  className="border-white/10 border-0 border-solid ml-auto gap-1.5"
                  size="sm"
                  variant="outline"
                >
                  <RotateCw className="size-3.5" />
                  Re-explain
                </Button>
                <Button
                  className="bg-neutral-200 text-neutral-900 gap-1.5"
                  size="sm"
                >
                  View details
                  <ArrowRight className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
