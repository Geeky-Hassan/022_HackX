// Updated this
type Role = "admin" | "user" | "moderator" | "PathAI"; // Roles we are going to assign
// Updated till this

type UserType = {
  id: string;
  appwriteId?: string;
  name: string;
  img: string;
  lastName?: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  department?: string;
  hobbies?: string[];
  role: Role;
  country: string;
  language: string;
  gender: string;
  plan: string;
  degree?: string;
  totalFriends: number;
  institution: string;
  userProfile: string;
  // Updated this
  madeTextRequests: number;
  allowedTextRequests: number;
  madeVisualRequests: number;
  allowedVisualRequests: number;
  // Updated till this
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type FriendType = {
  id: string;
  user_id: string;
  friend_id: UserType;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type ChatHistoryType = {
  friendId: string;
  friendName: string;
  friendProfileImage: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: Date;
};

type MessageType = {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  createdAt: Date;
  read: boolean;
};

type FriendRequestType = {
  id: string;
  requestedToUser: UserType;
  requestedFromUser: UserType;
  createdAt: Date;
  updatedAt: Date;
};

type ThemeType = "light" | "dark" | "system";

type StateType = {
  user: UserType | null;
  userName: string;
  email: string;
  open: boolean;
  reglo: boolean;
  department: string;
  offset: number;
  totalData: number;
  isLoading: boolean;
  error: string | null;
  messages: MessageType[];
  selectedChat: ChatHistoryType | null;
  friendProfile: boolean;
  chats: ChatHistoryType[];
  theme: ThemeType;
  isCollapsed: boolean;
  setChats: (chats: ChatHistoryType[]) => void;
  setUser: (user: UserType) => void;
  setUserName: (name: string) => void;
  setEmail: (email: string) => void;
  setTotalData: (total: number) => void;
  setDepartment: (dept: string) => void;
  setOffset: () => void;
  setOpen: () => void;
  setReglo: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMessages: (newMessages: MessageType[] | ((prev: MessageType[]) => MessageType[])) => void;
  setSelectedChat: (selectedChat: ChatHistoryType | null) => void;
  setFriendProfile: (settingfriendProfile: boolean) => void;
  setTheme: (theme: ThemeType) => void;
  setIsCollapsed: (collapsed: boolean) => void;
};

type FriendRequestCardProps = {
  friendRequest: FriendRequestType;
  handleAccept: (requestId: string, setLoading: (loading: boolean) => void) => void;
  handleReject: (requestId: string, setLoading: (loading: boolean) => void) => void;
};

type InterestCardProps = {
  user: UserType;
  sendFriendRequest: (userId: string, setLoading: (loading: boolean) => void) => void;
};
type ChatHistoryCardProps = {
  chat: ChatHistoryType;
  setSelectedChat?: (chat: ChatHistoryType) => void;
};
type ChatMessagesProps = {
  messages: MessageType[];
};

type SupportType = {
  category: string;
  subject: string;
  description: string;
};

type QuizType = {
  quiz_id: string;
  question: string;
  options: Array<string>;
  correct_answer: number;
  explanation: string;
};

type FlashcardType = {
  front: string;
  back: string;
};

// Define the Message interface for chatbot and user messages
type ChatbotMessageType = {
  conversation_id: string | undefined;
  category: string;
  newChat?: boolean;
  role?: Role;
  type?: string;
  content?: string | {quiz: QuizType[]; quiz_id: string};
  quiz_id?: string;
  agentName?: string;
  internet?: boolean;
  visualization?: string;
  // Alert-specific properties
  alertType?: "success" | "error" | "warning" | "info" | "quiz-complete" | "quiz-cancel";
  title?: string;
  score?: string;
  attachments?: Array<{name: string; type: string; size: number; url: string}>;
  // Video/Visualization pipeline properties
  job_id?: string; // Unique identifier for video generation job
  video_status?: "SCRIPTING" | "CODING" | "RENDERING" | "DEBUGGING" | "FAILED" | "COMPLETE";
  video_url?: string; // Temporary signed URL for video playback
  topic?: string; // Topic of the generated video (e.g., "Linked Lists")
};

type StateQuizType = {
  quiz_id: string;
  showQuiz: boolean;
  quiz: Array<QuizType>;
  totalScore: number;
  setShowQuiz: () => void;
  setQuiz: (quiz: Array<QuizType>) => void; // Updated to accept an argument
  setQuizId: (quizId: string) => void;
  setTotalScore: (score: number) => void;
};

type StateFlashcardType = {
  flashcardTitle: string;
  showFlashcard: boolean;
  flashcards: Array<FlashcardType>;
  setShowFlashcard: (bool: boolean) => void;
  setFlashcards: (flashcards: Array<FlashcardType>) => void;
  setFlashcardTitle: (title: string) => void;
};

type StoryBookPage = {
  pageNumber: number;
  text: string;
  imgUrl: string;
};

type StoryBookType = {          // This schema will be filled upon hitting GET /media/storybooks/{job_id}/content
  coverImageUrl: string | null; // Dispaly a cover image if it's not `null`. Else just start displaying the `pages`
  pages: [StoryBookPage];
  totalPages: number;
};

type ChatbotChatType = {
  sessionID: string | undefined;
  newChat: boolean;
  fetchChat: boolean;
  agentName: string;
  thinking: boolean;
  deepThink: string;
  remainingWords: number;
  messages: ChatbotMessageType[];
  inputMessage: string;
  allowedWords: number;
  setSessionID: (sessionID: string | undefined) => void;
  setAgentName: (name: string) => void;
  setDeepThink: (deepThink: string) => void;
  setNewChat: (newChat: boolean) => void;
  setFetchChat: (fetchChat: boolean) => void;
  setThinking: (thinking: boolean) => void;
  setRemainingWords: (remainingWords: number) => void;
  // This line is the key change - allowing messages to be either an array or a function
  setMessages: (
    messages: ChatbotMessageType[] | ((prevMessages: ChatbotMessageType[]) => ChatbotMessageType[]),
  ) => void;
  setInputMessage: (message: string | ((prev: string) => string)) => void;
};

type MainChatProps = {
  updateLastMessage: (chatId: string, lastMessage: string, lastMessageTime: Date) => void;
};

type Card = {
  id: number;
  title: string;
  content: string;
  description: string; // Added detailed description for text section
};
type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

type MainAppStoreType = {
  showChatHistory: boolean;
  dark: boolean;
  setDark: (dark: boolean) => void;
  setShowChatHistory: (show: boolean) => void;
};
export type {
  Card,
  Role,
  UserType,
  FriendRequestType,
  FriendType,
  MessageType,
  ChatHistoryType,
  StateType,
  FriendRequestCardProps,
  InterestCardProps,
  ChatHistoryCardProps,
  ChatMessagesProps,
  SupportType,
  ChatbotMessageType,
  ChatbotChatType,
  MainChatProps,
  ConfirmationModalProps,
  StateQuizType,
  QuizType,
  MainAppStoreType,
  ThemeType,
  FlashcardType,
  StateFlashcardType,
  StoryBookType
};
