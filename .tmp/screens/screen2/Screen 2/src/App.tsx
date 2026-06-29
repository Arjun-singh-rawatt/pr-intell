import { useEffect } from "react";
import {
  ArrowUpDown,
  BookOpenCheck,
  Bookmark,
  ChevronDown,
  GitPullRequest,
  Search,
  Settings,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div>
      <div className="font-mono bg-zinc-950 text-neutral-50 flex w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <aside className="shrink-0 bg-zinc-900 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex p-4 flex-col w-64 h-239">
          <div className="flex px-2 pt-2 pb-6 items-center gap-2">
            <div className="size-9 rounded-lg bg-[#f54900] flex justify-center items-center">
              <GitPullRequest className="size-5 text-white" />
            </div>
            <div className="leading-tight flex flex-col">
              <span className="font-bold text-neutral-50 text-sm leading-5">
                PR_Intel
              </span>
              <span className="text-[#a1a1a1] text-xs leading-4">
                Rocket.Chat
              </span>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <button className="transition-colors rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-3">
              <Zap className="size-4" />
              Feed
            </button>
            <button className="font-medium rounded-lg bg-[#f54900]/15 text-[#f54900] text-sm leading-5 flex px-3 py-2 items-center gap-3">
              <Search className="size-4 text-[#f54900]" />
              Search
            </button>
            <button className="transition-colors rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-3">
              <Bookmark className="size-4" />
              Saved
            </button>
            <button className="transition-colors rounded-lg text-[#a1a1a1] text-sm leading-5 flex px-3 py-2 items-center gap-3">
              <Settings className="size-4" />
              Settings
            </button>
          </nav>
          <div className="flex mt-auto flex-col gap-4">
            <div className="rounded-lg bg-zinc-800 flex p-4 flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-50 text-xs leading-4">
                  AI_Providers
                </span>
                <span className="text-[#00bc7d] text-xs leading-4 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#00bc7d]" />
                  Healthy
                </span>
              </div>
              <div className="text-xs leading-4 flex justify-between items-center">
                <span className="text-[#a1a1a1]">OpenAI</span>
                <span className="text-neutral-50">42ms</span>
              </div>
              <div className="text-xs leading-4 flex justify-between items-center">
                <span className="text-[#a1a1a1]">Anthropic</span>
                <span className="text-neutral-50">58ms</span>
              </div>
              <div className="text-xs leading-4 flex justify-between items-center">
                <span className="text-[#a1a1a1]">Gemini</span>
                <span className="text-[#fe9a00]">degraded</span>
              </div>
            </div>
            <div className="flex px-2 py-1 items-center gap-3">
              <img
                alt="Alex Doan"
                className="size-9 object-cover rounded-full"
                data-authorname="Imansyah Muhamad Putera"
                data-authorurl="https://unsplash.com/@imansyahmp"
                data-blurhash="LOE{FM_NK6r=kqt7$*WXE2RjwvWV"
                data-photoid="n4KewLKFOZw"
                src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8Mnx8fDE3ODAxNjkwMzR8MA&ixlib=rb-4.1.0&q=80&w=400"
              />
              <div className="leading-tight flex flex-col">
                <span className="font-medium text-neutral-50 text-sm leading-5">
                  Alex Doan
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">
                  CS Student
                </span>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex p-8 flex-col flex-1 gap-6 h-239 overflow-hidden">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-2xl leading-8 tracking-tight">
              <span className="text-[#f54900]">SELECT</span>
              <span className="text-[#f54900]">*</span>
              <span className="text-[#f54900]">FROM</span>
              <span className="text-neutral-50">search_results</span>
            </h1>
            <p className="font-sans text-[#a1a1a1] text-sm leading-5">
              Find PRs, contributors, and knowledge base entries.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-zinc-800 border-white/10 border-1 border-solid flex px-4 py-3 items-center flex-1 gap-3">
              <Search className="size-5 text-[#f54900]" />
              <input
                className="bg-transparent outline-none text-neutral-50 text-sm leading-5 flex-1"
                placeholder="Search PRs, files, authors, topics…"
              />
            </div>
            <Button
              className="bg-zinc-800 text-sm leading-5 border-white/10 border-0 border-solid px-4 gap-2 h-12"
              variant="outline"
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </Button>
            <Button
              className="bg-zinc-800 text-sm leading-5 border-white/10 border-0 border-solid px-4 gap-2 h-12"
              variant="outline"
            >
              <ArrowUpDown className="size-4" />
              Sort
              <ChevronDown className="size-4 text-[#a1a1a1]" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-[#f54900] text-white text-xs leading-4 px-3 py-1.5">
              All Types
            </button>
            <button className="transition-colors rounded-full bg-zinc-800 text-[#a1a1a1] text-xs leading-4 px-3 py-1.5">
              Pull Requests
            </button>
            <button className="transition-colors rounded-full bg-zinc-800 text-[#a1a1a1] text-xs leading-4 px-3 py-1.5">
              Contributors
            </button>
            <button className="transition-colors rounded-full bg-zinc-800 text-[#a1a1a1] text-xs leading-4 px-3 py-1.5">
              KB Documents
            </button>
            <button className="transition-colors rounded-full bg-zinc-800 text-[#a1a1a1] text-xs leading-4 px-3 py-1.5">
              AI Explanations
            </button>
          </div>
          <div className="flex flex-1 gap-6 overflow-hidden">
            <div className="w-[62%] overflow-y-auto flex pr-1 flex-col gap-4">
              <div className="transition-colors rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-5 flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold rounded-md bg-[#00bc7d]/15 text-[#00bc7d] text-[10px] px-2 py-0.5">
                    PR
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    2h ago
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    alt="Maya Krishnan"
                    className="size-6 object-cover rounded-full"
                    data-authorname="Madalyn Cox"
                    data-authorurl="https://unsplash.com/@madalyncox"
                    data-blurhash="LMF={%~q-;fQ4n9F-;WB?bayM{of"
                    data-photoid="ulMu6bO2brM"
                    src="https://images.unsplash.com/photo-1643908091873-a64caefd35fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNvZnR3YXJlJTIwZW5naW5lZXIlMjBwb3J0cmFpdHxlbnwxfDJ8fHwxNzgwMjI4MjA1fDA&ixlib=rb-4.1.0&q=80&w=400"
                  />
                  <span className="text-neutral-50 text-sm leading-5">
                    Maya Krishnan
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    rocketchat/Rocket.Chat #28471
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-neutral-50 text-base leading-6">
                  Fix message reaction count not updating in real time
                </h3>
                <p className="font-sans text-[#a1a1a1] text-sm leading-5">
                  Subscribes the reaction component to the live message stream
                  so counts render instantly.
                </p>
                <div className="flex pt-1 items-center gap-2">
                  <span className="text-[#a1a1a1] text-[10px]">relevance</span>
                  <div className="rounded-full bg-zinc-800 flex-1 h-1.5 overflow-hidden">
                    <div className="w-[94%] rounded-full bg-[#f54900] h-full" />
                  </div>
                  <span className="text-[#f54900] text-[10px]">94%</span>
                </div>
              </div>
              <div className="transition-colors rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-5 flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold rounded-md bg-[#ad46ff]/15 text-[#ad46ff] text-[10px] px-2 py-0.5">
                    CONTRIBUTOR
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    alt="Leo Okafor"
                    className="size-6 object-cover rounded-full"
                    data-authorname="Daniil Lobachev"
                    data-authorurl="https://unsplash.com/@danilal"
                    data-blurhash="L55hY|?b0000oft7ofM{9FD%%M_3"
                    data-photoid="oh7BwFw07cw"
                    src="https://images.unsplash.com/photo-1584307833174-a3bbb76ab367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxtYW4lMjBkZXZlbG9wZXIlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXwyfHx8MTc4MDMzMTUwNXww&ixlib=rb-4.1.0&q=80&w=400"
                  />
                  <span className="text-neutral-50 text-sm leading-5">
                    Leo Okafor
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    @leo-okafor · 42 merged PRs
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-neutral-50 text-base leading-6">{`Top contributor in slash-commands & scheduling`}</h3>
                <p className="font-sans text-[#a1a1a1] text-sm leading-5">
                  Frequent author of beginner-friendly features with high judge
                  scores.
                </p>
                <div className="flex pt-1 items-center gap-2">
                  <span className="text-[#a1a1a1] text-[10px]">relevance</span>
                  <div className="rounded-full bg-zinc-800 flex-1 h-1.5 overflow-hidden">
                    <div className="w-[88%] rounded-full bg-[#f54900] h-full" />
                  </div>
                  <span className="text-[#f54900] text-[10px]">88%</span>
                </div>
              </div>
              <div className="transition-colors rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-5 flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold rounded-md bg-[#fe9a00]/15 text-[#fe9a00] text-[10px] px-2 py-0.5">
                    KB_DOC
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    indexed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpenCheck className="size-5 text-[#fe9a00]" />
                  <span className="text-neutral-50 text-sm leading-5">
                    streams.md
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    knowledge-base/realtime
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-neutral-50 text-base leading-6">{`Live message streams & reactive subscriptions`}</h3>
                <p className="font-sans text-[#a1a1a1] text-sm leading-5">
                  Explains how Rocket.Chat pushes live updates to subscribed UI
                  components.
                </p>
                <div className="flex pt-1 items-center gap-2">
                  <span className="text-[#a1a1a1] text-[10px]">relevance</span>
                  <div className="rounded-full bg-zinc-800 flex-1 h-1.5 overflow-hidden">
                    <div className="w-[81%] rounded-full bg-[#f54900] h-full" />
                  </div>
                  <span className="text-[#f54900] text-[10px]">81%</span>
                </div>
              </div>
              <div className="transition-colors rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-5 flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold rounded-md bg-[#00bc7d]/15 text-[#00bc7d] text-[10px] px-2 py-0.5">
                    PR
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    5h ago
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    alt="Leo Okafor"
                    className="size-6 object-cover rounded-full"
                    data-authorname="Daniil Lobachev"
                    data-authorurl="https://unsplash.com/@danilal"
                    data-blurhash="L55hY|?b0000oft7ofM{9FD%%M_3"
                    data-photoid="oh7BwFw07cw"
                    src="https://images.unsplash.com/photo-1584307833174-a3bbb76ab367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxtYW4lMjBkZXZlbG9wZXIlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXwyfHx8MTc4MDMzMTUwNXww&ixlib=rb-4.1.0&q=80&w=400"
                  />
                  <span className="text-neutral-50 text-sm leading-5">
                    Leo Okafor
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    rocketchat/Rocket.Chat #28455
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-neutral-50 text-base leading-6">
                  Add slash command for scheduling recurring messages
                </h3>
                <p className="font-sans text-[#a1a1a1] text-sm leading-5">
                  Introduces a /schedule command wired into the existing slash
                  registry with a job runner.
                </p>
                <div className="flex pt-1 items-center gap-2">
                  <span className="text-[#a1a1a1] text-[10px]">relevance</span>
                  <div className="rounded-full bg-zinc-800 flex-1 h-1.5 overflow-hidden">
                    <div className="w-[76%] rounded-full bg-[#f54900] h-full" />
                  </div>
                  <span className="text-[#f54900] text-[10px]">76%</span>
                </div>
              </div>
            </div>
            <div className="w-[38%] overflow-y-auto flex flex-col gap-4">
              <div className="rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-5 flex-col gap-4">
                <span className="text-[#f54900] text-xs leading-4">
                  search_insights
                </span>
                <div className="flex flex-col gap-2">
                  <span className="text-[#a1a1a1] text-[10px]">
                    activity_by_category
                  </span>
                  <div className="flex items-end gap-2 h-24">
                    <div className="flex flex-col items-center flex-1 gap-1">
                      <div className="h-[90%] rounded-sm bg-[#f54900] w-full" />
                      <span className="text-[#a1a1a1] text-[9px]">PR</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 gap-1">
                      <div className="h-[60%] rounded-sm bg-[#f54900]/70 w-full" />
                      <span className="text-[#a1a1a1] text-[9px]">CONTRIB</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 gap-1">
                      <div className="h-[45%] rounded-sm bg-[#f54900]/50 w-full" />
                      <span className="text-[#a1a1a1] text-[9px]">KB</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 gap-1">
                      <div className="h-[30%] rounded-sm bg-[#f54900]/30 w-full" />
                      <span className="text-[#a1a1a1] text-[9px]">AI</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-5 flex-col gap-3">
                <span className="text-[#f54900] text-xs leading-4">
                  Top Contributors
                </span>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      alt="Maya"
                      className="size-7 object-cover rounded-full"
                      data-authorname="Madalyn Cox"
                      data-authorurl="https://unsplash.com/@madalyncox"
                      data-blurhash="LMF={%~q-;fQ4n9F-;WB?bayM{of"
                      data-photoid="ulMu6bO2brM"
                      src="https://images.unsplash.com/photo-1643908091873-a64caefd35fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNvZnR3YXJlJTIwZW5naW5lZXIlMjBwb3J0cmFpdHxlbnwxfDJ8fHwxNzgwMjI4MjA1fDA&ixlib=rb-4.1.0&q=80&w=400"
                    />
                    <span className="text-neutral-50 text-sm leading-5">
                      Maya Krishnan
                    </span>
                  </div>
                  <span className="text-[#f54900] text-xs leading-4">
                    31 matches
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      alt="Leo"
                      className="size-7 object-cover rounded-full"
                      data-authorname="Daniil Lobachev"
                      data-authorurl="https://unsplash.com/@danilal"
                      data-blurhash="L55hY|?b0000oft7ofM{9FD%%M_3"
                      data-photoid="oh7BwFw07cw"
                      src="https://images.unsplash.com/photo-1584307833174-a3bbb76ab367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxtYW4lMjBkZXZlbG9wZXIlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXwyfHx8MTc4MDMzMTUwNXww&ixlib=rb-4.1.0&q=80&w=400"
                    />
                    <span className="text-neutral-50 text-sm leading-5">
                      Leo Okafor
                    </span>
                  </div>
                  <span className="text-[#f54900] text-xs leading-4">
                    24 matches
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      alt="Alex"
                      className="size-7 object-cover rounded-full"
                      data-authorname="Imansyah Muhamad Putera"
                      data-authorurl="https://unsplash.com/@imansyahmp"
                      data-blurhash="LOE{FM_NK6r=kqt7$*WXE2RjwvWV"
                      data-photoid="n4KewLKFOZw"
                      src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8Mnx8fDE3ODAxNjkwMzR8MA&ixlib=rb-4.1.0&q=80&w=400"
                    />
                    <span className="text-neutral-50 text-sm leading-5">
                      Alex Doan
                    </span>
                  </div>
                  <span className="text-[#f54900] text-xs leading-4">
                    17 matches
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-zinc-900 border-white/10 border-1 border-solid flex p-5 flex-col gap-3">
                <span className="text-[#f54900] text-xs leading-4">
                  Related KB Docs
                </span>
                <a className="underline-offset-2 underline text-[#fe9a00] text-sm leading-5 flex items-center gap-2">
                  <BookOpenCheck className="size-4 shrink-0" />
                  streams.md
                </a>
                <a className="underline-offset-2 underline text-[#fe9a00] text-sm leading-5 flex items-center gap-2">
                  <BookOpenCheck className="size-4 shrink-0" />
                  reactions-api.md
                </a>
                <a className="underline-offset-2 underline text-[#fe9a00] text-sm leading-5 flex items-center gap-2">
                  <BookOpenCheck className="size-4 shrink-0" />
                  slash-commands.md
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
