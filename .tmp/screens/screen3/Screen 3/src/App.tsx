import { useEffect } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  BookOpenCheck,
  Bookmark,
  GitMerge,
  GitPullRequest,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function App() {
  return (
    <div>
      <div className="font-sans bg-zinc-950 text-neutral-50 flex w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <aside className="shrink-0 bg-zinc-900 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex p-4 flex-col justify-between w-64 h-239">
          <div className="flex flex-col gap-8">
            <div className="flex px-2 pt-2 items-center gap-2">
              <div className="size-10 shrink-0 rounded-lg bg-[#f54900] flex justify-center items-center">
                <GitPullRequest className="size-5 text-orange-50" />
              </div>
              <div className="flex flex-col">
                <span className="leading-tight font-bold text-neutral-50 text-sm leading-5">
                  PR_Intel
                </span>
                <span className="leading-tight text-[#a1a1a1] text-xs leading-4">
                  Rocket.Chat
                </span>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              <button className="transition-colors font-mono rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-3">
                <Zap className="size-4" />
                Feed
              </button>
              <button className="transition-colors font-mono rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-3">
                <Search className="size-4" />
                Search
              </button>
              <button className="font-mono font-medium rounded-lg bg-[#f54900]/15 text-[#f54900] text-sm leading-5 flex px-3 py-2 items-center gap-3">
                <Bookmark className="size-4 text-[#f54900]" />
                Saved
              </button>
              <button className="transition-colors font-mono rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-3">
                <Settings className="size-4" />
                Settings
              </button>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-zinc-800 flex p-4 flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-neutral-50 text-xs leading-4">
                  AI_Providers
                </span>
                <span className="text-[#00bc7d] text-xs leading-4 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-[#00bc7d]" />
                  Healthy
                </span>
              </div>
              <div className="font-mono text-xs leading-4 flex justify-between items-center">
                <span className="text-[#a1a1a1]">OpenAI</span>
                <span className="text-neutral-50">42ms</span>
              </div>
              <div className="font-mono text-xs leading-4 flex justify-between items-center">
                <span className="text-[#a1a1a1]">Anthropic</span>
                <span className="text-neutral-50">58ms</span>
              </div>
              <div className="font-mono text-xs leading-4 flex justify-between items-center">
                <span className="text-[#a1a1a1]">Gemini</span>
                <span className="text-[#fe9a00]">degraded</span>
              </div>
            </div>
            <div className="flex px-2 items-center gap-3">
              <Avatar className="size-9">
                <AvatarImage
                  alt="Alex Doan"
                  data-authorname="abdullah ali"
                  data-authorurl="https://unsplash.com/@adbullahx"
                  data-blurhash="LwM7or4n~q?a%M%LxuayofRjIUay"
                  data-photoid="9Uzk8gx0HPg"
                  src="https://images.unsplash.com/photo-1655449195187-a51a4606b32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHByb2ZpbGUlMjBmYWNlfGVufDF8Mnx8fDE3ODAzMzE1MTJ8MA&ixlib=rb-4.1.0&q=80&w=400"
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="leading-tight font-semibold text-neutral-50 text-sm leading-5">
                  Alex Doan
                </span>
                <span className="leading-tight text-[#a1a1a1] text-xs leading-4">
                  CS Student
                </span>
              </div>
            </div>
          </div>
        </aside>
        <main className="overflow-y-auto p-8 flex-1 h-239">
          <div className="flex mb-6 justify-between items-start gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="font-mono font-bold text-2xl leading-8">
                <span className="text-[#f54900]">SELECT</span>
                <span className="text-neutral-50">*</span>
                <span className="text-[#f54900]">FROM</span>
                <span className="text-neutral-50">saved_items</span>
              </h1>
              <p className="text-[#a1a1a1] text-sm leading-5">
                Your bookmarked PRs and knowledge base references.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="top-1/2 -translate-y-1/2 size-4 text-[#f54900] absolute left-3" />
                <Input
                  className="bg-zinc-800 text-sm leading-5 border-white/10 border-0 border-solid pl-9 w-64"
                  placeholder="Search saved items..."
                />
              </div>
              <Button
                className="bg-zinc-800 border-white/10 border-0 border-solid gap-2"
                variant="outline"
              >
                <ArrowDownUp className="size-4" />
                Sort
              </Button>
            </div>
          </div>
          <div className="font-mono flex mb-6 items-center gap-2">
            <button className="font-medium rounded-full bg-[#f54900] text-orange-50 text-sm leading-5 flex px-4 py-1.5 items-center gap-2">
              All Saved
              <span className="rounded-full bg-black/25 text-xs leading-4 px-1.5">
                12
              </span>
            </button>
            <button className="rounded-full text-[#a1a1a1] text-sm leading-5 flex px-4 py-1.5 items-center gap-2">
              PRs
              <span className="rounded-full bg-zinc-700 text-xs leading-4 px-1.5">
                7
              </span>
            </button>
            <button className="rounded-full text-[#a1a1a1] text-sm leading-5 flex px-4 py-1.5 items-center gap-2">
              KB Docs
              <span className="rounded-full bg-zinc-700 text-xs leading-4 px-1.5">
                4
              </span>
            </button>
            <button className="rounded-full text-[#a1a1a1] text-sm leading-5 flex px-4 py-1.5 items-center gap-2">
              Contributors
              <span className="rounded-full bg-zinc-700 text-xs leading-4 px-1.5">
                1
              </span>
            </button>
          </div>
          <div className="font-mono rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex mb-6 p-4 items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[#a1a1a1] text-xs leading-4">
                  saved_prs
                </span>
                <span className="font-bold text-neutral-50 text-xl leading-7">
                  7
                </span>
              </div>
              <div className="flex items-end gap-0.5 h-8">
                <span className="rounded-sm bg-[#f54900]/30 w-1 h-3" />
                <span className="rounded-sm bg-[#f54900]/50 w-1 h-5" />
                <span className="rounded-sm bg-[#f54900]/40 w-1 h-4" />
                <span className="rounded-sm bg-[#f54900]/80 w-1 h-7" />
                <span className="rounded-sm bg-[#f54900] w-1 h-6" />
              </div>
            </div>
            <div className="bg-white/10 w-px h-10" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[#a1a1a1] text-xs leading-4">
                  saved_kb_docs
                </span>
                <span className="font-bold text-neutral-50 text-xl leading-7">
                  4
                </span>
              </div>
              <div className="flex items-end gap-0.5 h-8">
                <span className="rounded-sm bg-[#f54900]/30 w-1 h-4" />
                <span className="rounded-sm bg-[#f54900]/60 w-1 h-6" />
                <span className="rounded-sm bg-[#f54900]/40 w-1 h-3" />
                <span className="rounded-sm bg-[#f54900]/70 w-1 h-5" />
                <span className="rounded-sm bg-[#f54900] w-1 h-7" />
              </div>
            </div>
            <div className="bg-white/10 w-px h-10" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[#a1a1a1] text-xs leading-4">
                  avg_judge_score
                </span>
                <span className="font-bold text-neutral-50 text-xl leading-7">
                  8.9/10
                </span>
              </div>
              <div className="flex items-end gap-0.5 h-8">
                <span className="rounded-sm bg-[#f54900]/40 w-1 h-5" />
                <span className="rounded-sm bg-[#f54900]/60 w-1 h-6" />
                <span className="rounded-sm bg-[#f54900]/80 w-1 h-7" />
                <span className="rounded-sm bg-[#f54900]/70 w-1 h-6" />
                <span className="rounded-sm bg-[#f54900] w-1 h-8" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-l-[#f54900]/40 relative rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-4 flex-col gap-3">
              <Bookmark className="size-4 fill-[#f54900] text-[#f54900] absolute right-4 top-4" />
              <span className="font-mono font-medium rounded-md bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 px-2 py-0.5 w-fit">
                PR
              </span>
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarImage
                    alt="Maya"
                    data-authorname="Madalyn Cox"
                    data-authorurl="https://unsplash.com/@madalyncox"
                    data-blurhash="LMF={%~q-;fQ4n9F-;WB?bayM{of"
                    data-photoid="ulMu6bO2brM"
                    src="https://images.unsplash.com/photo-1643908091873-a64caefd35fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGRldmVsb3BlciUyMHBvcnRyYWl0fGVufDF8Mnx8fDE3ODAxOTgyNTR8MA&ixlib=rb-4.1.0&q=80&w=400"
                  />
                  <AvatarFallback>MK</AvatarFallback>
                </Avatar>
                <span className="font-medium text-neutral-50 text-sm leading-5">
                  Maya Krishnan
                </span>
                <span className="rounded-md bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 flex px-1.5 py-0.5 items-center gap-1">
                  <GitMerge className="size-3" />
                  Merged
                </span>
              </div>
              <div className="font-mono text-[#a1a1a1] text-xs leading-4">
                rocketchat/Rocket.Chat #28471 · saved 2h ago
              </div>
              <h3 className="font-semibold text-neutral-50 text-sm leading-5">
                Fix message reaction count not updating in real time
              </h3>
              <div className="rounded-lg bg-zinc-800 flex p-3 flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#ad46ff] text-xs leading-4 flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    AI Summary
                  </span>
                  <span className="font-mono rounded-md text-[#f54900] text-xs leading-4 border-[#f54900]/50 border-1 border-solid px-1.5 py-0.5">
                    Judge 9.1/10
                  </span>
                </div>
                <p className="line-clamp-2 text-[#a1a1a1] text-xs leading-4">
                  Subscribes the reaction component to the live message stream
                  so counts update instantly. Great reactive state example for
                  newcomers.
                </p>
                <span className="font-mono text-[#fe9a00] text-xs leading-4 flex items-center gap-1.5">
                  <BookOpenCheck className="size-3.5" />
                  <span className="underline">streams.md</span>
                  <span className="underline">reactions-api.md</span>
                </span>
              </div>
              <div className="flex pt-1 justify-between items-center">
                <div className="font-mono text-xs leading-4 flex items-center gap-3">
                  <span className="text-[#a1a1a1]">4 files</span>
                  <span className="text-[#00bc7d]">+62</span>
                  <span className="text-[#ff6467]">-11</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-transparent text-xs leading-4 border-white/10 border-0 border-solid gap-1.5 h-8"
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className="size-3.5" />
                    Re-explain
                  </Button>
                  <Button
                    className="bg-[#f54900] text-orange-50 text-xs leading-4 gap-1.5 h-8"
                    size="sm"
                  >
                    View details
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-l-[#f54900]/40 relative rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-4 flex-col gap-3">
              <Bookmark className="size-4 fill-[#f54900] text-[#f54900] absolute right-4 top-4" />
              <span className="font-mono font-medium rounded-md bg-[#fe9a00]/15 text-[#fe9a00] text-xs leading-4 px-2 py-0.5 w-fit">
                KB_DOC
              </span>
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarImage
                    alt="Leo"
                    data-authorname="Compagnons"
                    data-authorurl="https://unsplash.com/@sigmund"
                    data-blurhash="LH9H2^t70KNGMwaex]j[I@az$$of"
                    data-photoid="a19OVaa2rzA"
                    src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBwb3J0cmFpdCUyMG1hbnxlbnwxfDJ8fHwxNzgwMjI2Mjc5fDA&ixlib=rb-4.1.0&q=80&w=400"
                  />
                  <AvatarFallback>LO</AvatarFallback>
                </Avatar>
                <span className="font-medium text-neutral-50 text-sm leading-5">
                  Leo Okafor
                </span>
              </div>
              <div className="font-mono text-[#a1a1a1] text-xs leading-4">
                docs/slash-commands · saved 5h ago
              </div>
              <h3 className="font-semibold text-neutral-50 text-sm leading-5">
                Building custom slash commands in Rocket.Chat
              </h3>
              <div className="rounded-lg bg-zinc-800 flex p-3 flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#ad46ff] text-xs leading-4 flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    AI Summary
                  </span>
                  <span className="font-mono rounded-md text-[#f54900] text-xs leading-4 border-[#f54900]/50 border-1 border-solid px-1.5 py-0.5">
                    Judge 8.4/10
                  </span>
                </div>
                <p className="line-clamp-2 text-[#a1a1a1] text-xs leading-4">
                  Reference doc explaining the slash registry and job runner
                  pattern used for cron-style scheduled messaging commands.
                </p>
                <span className="font-mono text-[#fe9a00] text-xs leading-4 flex items-center gap-1.5">
                  <BookOpenCheck className="size-3.5" />
                  <span className="underline">slash-commands.md</span>
                  <span className="underline">scheduler.md</span>
                </span>
              </div>
              <div className="flex pt-1 justify-between items-center">
                <div className="font-mono text-xs leading-4 flex items-center gap-3">
                  <span className="text-[#a1a1a1]">11 files</span>
                  <span className="text-[#00bc7d]">+284</span>
                  <span className="text-[#ff6467]">-7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-transparent text-xs leading-4 border-white/10 border-0 border-solid gap-1.5 h-8"
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className="size-3.5" />
                    Re-explain
                  </Button>
                  <Button
                    className="bg-[#f54900] text-orange-50 text-xs leading-4 gap-1.5 h-8"
                    size="sm"
                  >
                    View details
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-l-[#f54900]/40 relative rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-4 flex-col gap-3">
              <Bookmark className="size-4 fill-[#f54900] text-[#f54900] absolute right-4 top-4" />
              <span className="font-mono font-medium rounded-md bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 px-2 py-0.5 w-fit">
                PR
              </span>
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarImage
                    alt="Diego"
                    data-authorname="True Agency"
                    data-authorurl="https://unsplash.com/@trueagency"
                    data-blurhash="LPLENSNe%2%MI:~qIURj_3IAM{Rj"
                    data-photoid="o4UhdLv5jbQ"
                    src="https://images.unsplash.com/photo-1536104968055-4d61aa56f46a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWVyJTIwaGVhZHNob3R8ZW58MXwyfHx8MTc4MDMzMTUwNHww&ixlib=rb-4.1.0&q=80&w=400"
                  />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <span className="font-medium text-neutral-50 text-sm leading-5">
                  Diego Rivera
                </span>
                <span className="rounded-md bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 flex px-1.5 py-0.5 items-center gap-1">
                  <GitMerge className="size-3" />
                  Merged
                </span>
              </div>
              <div className="font-mono text-[#a1a1a1] text-xs leading-4">
                rocketchat/Rocket.Chat #28402 · saved 1d ago
              </div>
              <h3 className="font-semibold text-neutral-50 text-sm leading-5">
                Add keyboard shortcuts for channel navigation
              </h3>
              <div className="rounded-lg bg-zinc-800 flex p-3 flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#ad46ff] text-xs leading-4 flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    AI Summary
                  </span>
                  <span className="font-mono rounded-md text-[#f54900] text-xs leading-4 border-[#f54900]/50 border-1 border-solid px-1.5 py-0.5">
                    Judge 9.3/10
                  </span>
                </div>
                <p className="line-clamp-2 text-[#a1a1a1] text-xs leading-4">
                  Introduces a global keymap hook with accessible focus
                  management. A clean intro to event delegation and a11y
                  patterns.
                </p>
                <span className="font-mono text-[#fe9a00] text-xs leading-4 flex items-center gap-1.5">
                  <BookOpenCheck className="size-3.5" />
                  <span className="underline">keymap.md</span>
                  <span className="underline">a11y.md</span>
                </span>
              </div>
              <div className="flex pt-1 justify-between items-center">
                <div className="font-mono text-xs leading-4 flex items-center gap-3">
                  <span className="text-[#a1a1a1]">6 files</span>
                  <span className="text-[#00bc7d]">+148</span>
                  <span className="text-[#ff6467]">-23</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-transparent text-xs leading-4 border-white/10 border-0 border-solid gap-1.5 h-8"
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className="size-3.5" />
                    Re-explain
                  </Button>
                  <Button
                    className="bg-[#f54900] text-orange-50 text-xs leading-4 gap-1.5 h-8"
                    size="sm"
                  >
                    View details
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-l-[#f54900]/40 relative rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-4 flex-col gap-3">
              <Bookmark className="size-4 fill-[#f54900] text-[#f54900] absolute right-4 top-4" />
              <span className="font-mono font-medium rounded-md bg-[#fe9a00]/15 text-[#fe9a00] text-xs leading-4 px-2 py-0.5 w-fit">
                KB_DOC
              </span>
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarImage
                    alt="Sara"
                    data-authorname="Nicolas Horn"
                    data-authorurl="https://unsplash.com/@sysengineer"
                    data-blurhash="LIH-_c%#u5_N0}?HxtaxVsNGrXM{"
                    data-photoid="ARBQCe2GrjQ"
                    src="https://images.unsplash.com/photo-1625241152315-4a698f74ceb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDF8Mnx8fDE3ODAyMTI0NzZ8MA&ixlib=rb-4.1.0&q=80&w=400"
                  />
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>
                <span className="font-medium text-neutral-50 text-sm leading-5">
                  Sara Park
                </span>
              </div>
              <div className="font-mono text-[#a1a1a1] text-xs leading-4">
                docs/realtime · saved 2d ago
              </div>
              <h3 className="font-semibold text-neutral-50 text-sm leading-5">
                Understanding the WebSocket message stream
              </h3>
              <div className="rounded-lg bg-zinc-800 flex p-3 flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#ad46ff] text-xs leading-4 flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    AI Summary
                  </span>
                  <span className="font-mono rounded-md text-[#f54900] text-xs leading-4 border-[#f54900]/50 border-1 border-solid px-1.5 py-0.5">
                    Judge 8.8/10
                  </span>
                </div>
                <p className="line-clamp-2 text-[#a1a1a1] text-xs leading-4">
                  Explains how the realtime layer multiplexes subscriptions over
                  a single socket and how clients reconcile state on reconnect.
                </p>
                <span className="font-mono text-[#fe9a00] text-xs leading-4 flex items-center gap-1.5">
                  <BookOpenCheck className="size-3.5" />
                  <span className="underline">streams.md</span>
                  <span className="underline">ddp.md</span>
                </span>
              </div>
              <div className="flex pt-1 justify-between items-center">
                <div className="font-mono text-xs leading-4 flex items-center gap-3">
                  <span className="text-[#a1a1a1]">3 files</span>
                  <span className="text-[#00bc7d]">+91</span>
                  <span className="text-[#ff6467]">-4</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-transparent text-xs leading-4 border-white/10 border-0 border-solid gap-1.5 h-8"
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className="size-3.5" />
                    Re-explain
                  </Button>
                  <Button
                    className="bg-[#f54900] text-orange-50 text-xs leading-4 gap-1.5 h-8"
                    size="sm"
                  >
                    View details
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-l-[#f54900]/40 relative rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-4 flex-col gap-3">
              <Bookmark className="size-4 fill-[#f54900] text-[#f54900] absolute right-4 top-4" />
              <span className="font-mono font-medium rounded-md bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 px-2 py-0.5 w-fit">
                PR
              </span>
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarImage
                    alt="Tom"
                    data-authorname="Compagnons"
                    data-authorurl="https://unsplash.com/@sigmund"
                    data-blurhash="LH9H2^t70KNGMwaex]j[I@az$$of"
                    data-photoid="a19OVaa2rzA"
                    src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBwb3J0cmFpdCUyMG1hbnxlbnwxfDJ8fHwxNzgwMjI2Mjc5fDA&ixlib=rb-4.1.0&q=80&w=400"
                  />
                  <AvatarFallback>TN</AvatarFallback>
                </Avatar>
                <span className="font-medium text-neutral-50 text-sm leading-5">
                  Tom Nguyen
                </span>
                <span className="rounded-md bg-[#00bc7d]/15 text-[#00bc7d] text-xs leading-4 flex px-1.5 py-0.5 items-center gap-1">
                  <GitMerge className="size-3" />
                  Merged
                </span>
              </div>
              <div className="font-mono text-[#a1a1a1] text-xs leading-4">
                rocketchat/Rocket.Chat #28350 · saved 3d ago
              </div>
              <h3 className="font-semibold text-neutral-50 text-sm leading-5">
                Improve file upload progress feedback
              </h3>
              <div className="rounded-lg bg-zinc-800 flex p-3 flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#ad46ff] text-xs leading-4 flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    AI Summary
                  </span>
                  <span className="font-mono rounded-md text-[#f54900] text-xs leading-4 border-[#f54900]/50 border-1 border-solid px-1.5 py-0.5">
                    Judge 8.6/10
                  </span>
                </div>
                <p className="line-clamp-2 text-[#a1a1a1] text-xs leading-4">
                  Wires upload XHR progress events into a reactive store,
                  showing a smooth progress bar. Solid example of optimistic UI
                  handling.
                </p>
                <span className="font-mono text-[#fe9a00] text-xs leading-4 flex items-center gap-1.5">
                  <BookOpenCheck className="size-3.5" />
                  <span className="underline">uploads.md</span>
                  <span className="underline">stores.md</span>
                </span>
              </div>
              <div className="flex pt-1 justify-between items-center">
                <div className="font-mono text-xs leading-4 flex items-center gap-3">
                  <span className="text-[#a1a1a1]">5 files</span>
                  <span className="text-[#00bc7d]">+73</span>
                  <span className="text-[#ff6467]">-19</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-transparent text-xs leading-4 border-white/10 border-0 border-solid gap-1.5 h-8"
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className="size-3.5" />
                    Re-explain
                  </Button>
                  <Button
                    className="bg-[#f54900] text-orange-50 text-xs leading-4 gap-1.5 h-8"
                    size="sm"
                  >
                    View details
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-l-[#f54900]/40 relative rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-4 flex-col gap-3">
              <Bookmark className="size-4 fill-[#f54900] text-[#f54900] absolute right-4 top-4" />
              <span className="font-mono font-medium rounded-md bg-[#fe9a00]/15 text-[#fe9a00] text-xs leading-4 px-2 py-0.5 w-fit">
                KB_DOC
              </span>
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarImage
                    alt="Priya"
                    data-authorname="Madalyn Cox"
                    data-authorurl="https://unsplash.com/@madalyncox"
                    data-blurhash="LMF={%~q-;fQ4n9F-;WB?bayM{of"
                    data-photoid="ulMu6bO2brM"
                    src="https://images.unsplash.com/photo-1643908091873-a64caefd35fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGRldmVsb3BlciUyMHBvcnRyYWl0fGVufDF8Mnx8fDE3ODAxOTgyNTR8MA&ixlib=rb-4.1.0&q=80&w=400"
                  />
                  <AvatarFallback>PV</AvatarFallback>
                </Avatar>
                <span className="font-medium text-neutral-50 text-sm leading-5">
                  Priya Verma
                </span>
              </div>
              <div className="font-mono text-[#a1a1a1] text-xs leading-4">
                docs/contributing · saved 4d ago
              </div>
              <h3 className="font-semibold text-neutral-50 text-sm leading-5">
                First contribution guide for new developers
              </h3>
              <div className="rounded-lg bg-zinc-800 flex p-3 flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#ad46ff] text-xs leading-4 flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    AI Summary
                  </span>
                  <span className="font-mono rounded-md text-[#f54900] text-xs leading-4 border-[#f54900]/50 border-1 border-solid px-1.5 py-0.5">
                    Judge 9.0/10
                  </span>
                </div>
                <p className="line-clamp-2 text-[#a1a1a1] text-xs leading-4">
                  Walks beginners through forking, setting up the dev env, and
                  opening a first PR. Includes labels to find beginner-friendly
                  issues.
                </p>
                <span className="font-mono text-[#fe9a00] text-xs leading-4 flex items-center gap-1.5">
                  <BookOpenCheck className="size-3.5" />
                  <span className="underline">contributing.md</span>
                  <span className="underline">setup.md</span>
                </span>
              </div>
              <div className="flex pt-1 justify-between items-center">
                <div className="font-mono text-xs leading-4 flex items-center gap-3">
                  <span className="text-[#a1a1a1]">2 files</span>
                  <span className="text-[#00bc7d]">+120</span>
                  <span className="text-[#ff6467]">-0</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-transparent text-xs leading-4 border-white/10 border-0 border-solid gap-1.5 h-8"
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className="size-3.5" />
                    Re-explain
                  </Button>
                  <Button
                    className="bg-[#f54900] text-orange-50 text-xs leading-4 gap-1.5 h-8"
                    size="sm"
                  >
                    View details
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
