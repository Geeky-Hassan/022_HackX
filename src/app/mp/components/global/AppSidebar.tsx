"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import Image from "next/image";
import {
  Menu,
  Plus,
  Search,
  PanelLeft,
  History as HistoryIcon,
  GalleryVerticalEnd,
  Presentation,
} from "lucide-react";
import ProfileDropdown from "../../components/Profile/ProfileDropdown";
import stateStore from "@/store/zuStore";
import {useChatbotStore} from "../../store/chatbotStore";
import ChatHistoryModal from "../../components/Modal/ChatHistoryModal";
import FlashcardModal from "../../components/Modal/FlashcardModal";
import {usePathname, useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {getChats, type ChatListItem, handleNewChat} from "@/services/llmChat";
import {useQuery} from "@tanstack/react-query";

type AppSidebarProps = {
  onNewChat?: () => void;
  onSearch?: () => void;
  className?: string;
};

const AppSidebar = ({onNewChat, onSearch, className}: AppSidebarProps) => {
  const pathname = usePathname();
  const hideSidebar =
    pathname?.startsWith("/mp/login") ||
    pathname?.startsWith("/mp/register") ||
    pathname === "/mp/profile" ||
    pathname === "/mp/settings";
  const {user, userName, isCollapsed, setIsCollapsed} = stateStore();
  const router = useRouter();
  const setSessionID = useChatbotStore((s) => s.setSessionID);
  const setNewChat = useChatbotStore((s) => s.setNewChat);
  const setMessages = useChatbotStore((s) => s.setMessages);
  const setMode = useChatbotStore((s) => s.setMode);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [showPPTModal, setShowPPTModal] = useState(false);
  // Dropdown open for user profile
  const [open, setOpen] = useState(false);
  // Layout state
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  // Prefer collapsed by default on small screens
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    setIsCollapsed(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsCollapsed(e.matches);
    try {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } catch {
      // Safari fallback
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, []);

  // Ensure consistent SSR/CSR by deferring auth detection to client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [hasToken, setHasToken] = useState(false);

  // Check for token changes reactively
  useEffect(() => {
    if (!mounted) return;

    const checkToken = () => {
      const token = Boolean(Cookies.get("serviceToken"));
      setHasToken(token);
    };

    // Check immediately
    checkToken();

    // Listen for custom login events
    const handleLogin = () => {
      setTimeout(checkToken, 100); // Small delay to ensure cookie is set
    };

    // Listen for storage changes (in case token is set in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "serviceToken") {
        checkToken();
      }
    };

    // Set up listeners
    window.addEventListener("login-success", handleLogin);
    window.addEventListener("storage", handleStorageChange);

    // Fallback interval check (less frequent)
    const interval = setInterval(checkToken, 5000);

    return () => {
      window.removeEventListener("login-success", handleLogin);
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [mounted]);

  const {
    data: chats = [],
    isLoading: loadingChats,
    error: chatsError,
  } = useQuery<ChatListItem[], any, ChatListItem[], [string, boolean]>({
    queryKey: ["llm-chats", hasToken],
    queryFn: getChats,
    enabled: hasToken,
    staleTime: 60_000,
    retry: (failureCount, error: any) => {
      // Avoid spamming retries on 401; retry a couple times otherwise
      const status = error?.response?.status;
      if (status === 401) return false;
      return failureCount < 2;
    },
  });
  const chatError = chatsError ? (chatsError as Error).message : null;

  const groupedChats = useMemo((): Array<[string, ChatListItem[]]> => {
    // Sort chats by last_updated desc if available
    const sorted = [...chats].sort((a, b) => {
      const ta = a.last_updated ? new Date(a.last_updated).getTime() : 0;
      const tb = b.last_updated ? new Date(b.last_updated).getTime() : 0;
      return tb - ta;
    });

    const groups = new Map<string, ChatListItem[]>();
    const todayStr = new Date().toDateString();

    for (const c of sorted) {
      const d = c.last_updated ? new Date(c.last_updated) : null;
      const key =
        d && d.toDateString() === todayStr
          ? "Today"
          : d
            ? d.toLocaleString(undefined, {month: "long", year: "numeric"})
            : "Other";
      if (!groups.has(key)) groups.set(key, [] as any);
      groups.get(key)!.push(c);
    }

    // Preserve order: Today first, then the rest in insertion order
    const entries: Array<[string, ChatListItem[]]> = [];
    if (groups.has("Today")) entries.push(["Today", groups.get("Today")!]);
    for (const [k, v] of groups.entries()) if (k !== "Today") entries.push([k, v]);
    return entries;
  }, [chats]);

  const handleNewChatClick = useCallback(async () => {
    if (onNewChat) return onNewChat();

    await handleNewChat().then((session: string) => {
      setSessionID(session);
      setMode("chat");
      setNewChat(false);
      setMessages([]);
      router.push("/mp/chatbot");
    });
  }, [onNewChat, setNewChat, setSessionID, setMessages, router]);

  const handleSearch = useCallback(() => {
    if (onSearch) return onSearch();
    setShowChatHistory(true);
  }, [onSearch]);

  const handleFlashcards = useCallback(() => {
    setShowFlashcardModal(true);
  }, []);

  const handlePPT = useCallback(() => {
    setShowPPTModal(true);
  }, []);

  const userDisplayName = useMemo(() => userName || "User", [userName]);

  // Shared button styles
  const baseBtn =
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100";
  const iconBtn =
    "flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100";

  const toggleCollapsed = useCallback(
    () => setIsCollapsed(!isCollapsed),
    [isCollapsed, setIsCollapsed],
  );

  const CollapsedLogo = (
    <button
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={toggleCollapsed}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      className="flex h-12 w-full items-center justify-center"
    >
      {isHovering ? (
        <PanelLeft className="h-5 w-5 text-gray-500" />
      ) : (
        <Image src="/Logo/logo.svg" alt="MyPath" width={40} height={40} />
      )}
    </button>
  );

  const ExpandedLogo = (
    <div className="flex h-12 w-full items-center px-3 justify-between">
      <Image src="/Logo/logo.svg" alt="MyPath" width={40} height={40} />
      {/* Collapse button sits adjacent to logo when expanded */}
      <button
        onClick={toggleCollapsed}
        className="ml-auto rounded-md p-1.5 hover:bg-gray-100"
        aria-label="Collapse sidebar"
      >
        <PanelLeft className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );

  if (hideSidebar) {
    return null;
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur px-3 py-2">
        <button className={iconBtn} aria-label="Open sidebar" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
        <button className={iconBtn} aria-label="New chat" onClick={handleNewChatClick}>
          <Plus className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Desktop/Tablet Sidebar */}
      <aside
        onMouseEnter={() => isCollapsed && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={[
          "hidden lg:flex lg:flex-col bg-back-white border-r border-neutral-300 transition-[width] duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen overflow-visible z-[80]",
          isCollapsed ? "w-16" : "w-64",
          className || "",
        ].join(" ")}
      >
        {/* Header / Logo */}
        <div className="h-14 flex items-center border-b border-gray-100">
          {isCollapsed ? CollapsedLogo : ExpandedLogo}
        </div>

        {/* Actions and chat list (sidebar body)*/}
        <div className="flex-1 px-2 py-3 space-y-1 overflow-hidden">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-1">
              <button
                className={iconBtn}
                aria-label="New chat"
                onClick={handleNewChatClick}
                title="New chat"
              >
                <Plus className="h-5 w-5 text-gray-700" />
              </button>
              <button className={iconBtn} aria-label="Search" onClick={handleSearch} title="Search">
                <Search className="h-5 w-5 text-gray-700" />
              </button>
              <button
                className={iconBtn}
                aria-label="Flashcards"
                onClick={handleFlashcards}
                title="Flashcards"
              >
                <GalleryVerticalEnd className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <button className={baseBtn} onClick={handleNewChatClick}>
                <Plus className="h-5 w-5 text-gray-700" />
                <span className="text-gray-800">New chat</span>
              </button>
              <button className={baseBtn} onClick={handleSearch}>
                <Search className="h-5 w-5 text-gray-700" />
                <span className="text-gray-800">Search chats</span>
              </button>
              <button className={baseBtn} onClick={handleFlashcards}>
                <GalleryVerticalEnd className="h-5 w-5 text-gray-700" />
                <span className="text-gray-800">Flashcards</span>
              </button>
              {/* Collapsible History with timeline */}
              <div className="">
                <button
                  className={`${baseBtn} w-full`}
                  onClick={() => setHistoryOpen((o) => !o)}
                  aria-expanded={historyOpen}
                >
                  <HistoryIcon className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-800">History</span>
                </button>

                {historyOpen && (
                  <div className="relative">
                    {/* vertical thread line under the history icon, centered beneath it */}
                    <span
                      aria-hidden
                      className="absolute left-[22px] top-0 bottom-1 w-px bg-gray-200"
                    />

                    <div
                      className="pl-6 overflow-y-auto pr-1"
                      style={{maxHeight: "calc(100vh - 260px)"}}
                    >
                      {(!mounted || loadingChats) && (
                        <div className="text-xs text-gray-500 px-3 py-2">Loading chats...</div>
                      )}
                      {mounted && !loadingChats && chatError && (
                        <div className="text-xs text-red-500 px-3 py-2">{chatError}</div>
                      )}
                      {mounted && !loadingChats && !chatError && chats.length === 0 && (
                        <div className="text-xs text-gray-400 px-3 py-2">No chats yet</div>
                      )}

                      {mounted && !loadingChats && (
                        <div className="space-y-3">
                          {groupedChats.map(([group, items]) => (
                            <div key={group}>
                              <div className="text-[11px] uppercase tracking-wide text-gray-400 px-2">
                                {group}
                              </div>
                              <ul className="mt-1 space-y-1">
                                {items.map((c) => (
                                  <li
                                    title={c.title}
                                    key={c.chat_id}
                                    className="animate-in fade-in slide-in-from-left-1 duration-200"
                                  >
                                    <button
                                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 text-sm text-gray-800"
                                      onClick={() =>
                                        router.push(
                                          `/mp/chatbot?chat=${encodeURIComponent(c.chat_id)}`,
                                        )
                                      }
                                    >
                                      <span className="truncate block">{c.title || c.chat_id}</span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer / Profile */}
        <div
          onClick={() => setOpen(!open)}
          className="mt-auto border-t cursor-pointer border-gray-100 p-3"
        >
          {isCollapsed ? (
            <div className="flex items-center justify-center">
              <ProfileDropdown placement="top-right" open={open} setOpen={setOpen} />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ProfileDropdown placement="top-right" open={open} setOpen={setOpen} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">{userDisplayName}</p>
                {user?.email && <p className="truncate text-xs text-gray-500">{user.email}</p>}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      <div
        className={[
          "fixed inset-0 z-[60] lg:hidden transition-opacity",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div
          className={[
            "absolute left-0 top-0 h-full w-72 bg-back-white border-r border-gray-200 shadow-xl",
            "transition-transform duration-200 ease-out flex flex-col",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer header */}
          <div className="h-14 flex items-center border-b border-gray-100 px-3">
            <Image src="/Logo/logo.svg" alt="MyPath" width={40} height={40} />
          </div>
          {/* Drawer actions same as expanded */}
          <div className="p-3 space-y-1 flex-1 overflow-hidden">
            <button
              className={baseBtn}
              onClick={() => {
                handleNewChatClick();
                setMobileOpen(false);
              }}
            >
              <Plus className="h-5 w-5 text-gray-700" />
              <span className="text-gray-800">New chat</span>
            </button>
            <button
              className={baseBtn}
              onClick={() => {
                handleSearch();
                setMobileOpen(false);
              }}
            >
              <Search className="h-5 w-5 text-gray-700" />
              <span className="text-gray-800">Search chats</span>
            </button>
            <button
              className={baseBtn}
              onClick={() => {
                handleFlashcards();
                setMobileOpen(false);
              }}
            >
              <GalleryVerticalEnd className="h-5 w-5 text-gray-700" />
              <span className="text-gray-800">Flashcards</span>
            </button>

            {/* Mobile History Dropdown */}
            <div className="">
              <button
                className={`${baseBtn} w-full`}
                onClick={() => setHistoryOpen((o) => !o)}
                aria-expanded={historyOpen}
              >
                <HistoryIcon className="h-5 w-5 text-gray-700" />
                <span className="text-gray-800">History</span>
              </button>

              {historyOpen && (
                <div className="relative">
                  {/* vertical thread line under the history icon, centered beneath it */}
                  <span
                    aria-hidden
                    className="absolute left-[22px] top-0 bottom-1 w-px bg-gray-200"
                  />

                  <div
                    className="pl-6 overflow-y-auto pr-1"
                    style={{maxHeight: "calc(100vh - 300px)"}}
                  >
                    {(!mounted || loadingChats) && (
                      <div className="text-xs text-gray-500 px-3 py-2">Loading chats...</div>
                    )}
                    {mounted && !loadingChats && chatError && (
                      <div className="text-xs text-red-500 px-3 py-2">{chatError}</div>
                    )}
                    {mounted && !loadingChats && !chatError && chats.length === 0 && (
                      <div className="text-xs text-gray-400 px-3 py-2">No chats yet</div>
                    )}

                    {mounted && !loadingChats && (
                      <div className="space-y-3">
                        {groupedChats.map(([group, items]) => (
                          <div key={group}>
                            <div className="text-[11px] uppercase tracking-wide text-gray-400 px-2">
                              {group}
                            </div>
                            <ul className="mt-1 space-y-1">
                              {items.map((c) => (
                                <li
                                  key={c.chat_id}
                                  className="animate-in fade-in slide-in-from-left-1 duration-200"
                                >
                                  <button
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 text-sm text-gray-800"
                                    onClick={() => {
                                      router.push(
                                        `/mp/chatbot?chat=${encodeURIComponent(c.chat_id)}`,
                                      );
                                      setMobileOpen(false);
                                    }}
                                  >
                                    <span className="truncate block">{c.title || c.chat_id}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-auto border-t border-gray-100 p-3">
            <div onClick={() => setOpen(!open)} className="flex items-center gap-3 cursor-pointer">
              <ProfileDropdown placement="top-right" open={open} setOpen={setOpen} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">{userDisplayName}</p>
                {user?.email && <p className="truncate text-xs text-gray-500">{user.email}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat History Modal */}
      {showChatHistory && <ChatHistoryModal setShowChatHistory={setShowChatHistory} />}

      {/* Flashcard Modal */}
      {showFlashcardModal && <FlashcardModal onClose={() => setShowFlashcardModal(false)} />}
    </>
  );
};

export default AppSidebar;
