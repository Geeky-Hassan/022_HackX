import {Role, StateType} from "@/types";
import {
  Bot,
  Users2,
  User2,
  MessagesSquare,
  History,
  BotIcon,
  MessageCirclePlus,
} from "lucide-react";

import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {CodeIcon, NewtonIcon, SatIcon} from "../CopyButton";

// Types
interface sideNavigationType {
  title: string;
  icon: React.ReactNode;
  href: string;
}

// Sidebar Navigation
export const sideNavigation: sideNavigationType[] = [
  {title: "PathAI", icon: <Bot className="icon-color" />, href: "/mp/chatbot"},
  {
    title: "Student Matching Platform",
    icon: <Users2 className="icon-color" />,
    href: "/mp/matching_platform",
  },
  {title: "Messages", icon: <MessagesSquare className="icon-color" />, href: "/mp/messages"},
];

export const navLinks = [
  {
    title: "New Chat",
    icon: MessageCirclePlus,
  },
  {
    title: "Chat History",
    icon: History,
  },
];

// Profile dropdown links
export const profileDropdownLinks = [
  {
    title: "My Profile",
    href: "/mp/profile",
    icon: <User2 className="text-neutral-500 size-5 mr-3" />,
  },
];

// Setting links
export const settings = [
  {
    title: "Support",
  },
  {
    title: "Billing",
  },
];
export type AgentType = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  desc: string;
  sampleMessages: {title: string}[];
}[];
export const agents: AgentType = [
  {
    title: "Turing",
    icon: BotIcon,
    desc: "Your AI tutor for mastering Math concepts!",
    sampleMessages: [
      {title: "Can you explain quadratic equations with a step-by-step solution?"},
      {title: "Show me a GeoGebra graph for y = x^2 + 2x + 1."},
      {title: "Give me an adaptive quiz on trigonometry."},
      {title: "Summarize my algebra notes into key formulas."},
    ],
  },
  {
    title: "Frankenstein",
    icon: NewtonIcon,
    desc: "Your Physics tutor with real-time simulations!",
    sampleMessages: [
      {title: "Explain Newton's second law with an example."},
      {title: "Show me a simulation of projectile motion."},
      {title: "Generate a quiz on electricity and magnetism."},
      {title: "Summarize my physics lecture notes into key points."},
    ],
  },
  {
    title: "CoCo",
    icon: CodeIcon,
    desc: "Your AI coding tutor for problem-solving!",
    sampleMessages: [
      {title: "Teach me how to write a basic Python loop."},
      {title: "Explain recursion with a coding example."},
      {title: "Generate a coding quiz on arrays and functions."},
      {title: "Summarize my programming notes into practice problems."},
    ],
  },
  {
    title: "SAT AI",
    icon: SatIcon,
    desc: "Your prep buddy for SAT & A/O Levels!",
    sampleMessages: [
      {title: "Give me a practice question for SAT Math."},
      {title: "Explain the main idea of this reading passage."},
      {title: "Generate a quiz on SAT grammar rules."},
      {title: "Create a study path for improving my weak areas in math."},
    ],
  },
];

// When the session is expired, this function is called
export const removingToken = () => {
  toast.error("Session expired! Please login again.", {
    duration: 5000,
    position: "bottom-right",
  });
  Cookies.remove("serviceToken");
  location.reload();
};

// Getting user type to put limitation
export const getUserType = (store: StateType, request: string) => {
  const user = store.user;

  switch (user?.role) {
    case "user":
      if (request === "chat") {
        if (user.madeTextRequests == user.allowedTextRequests) {
          return false;
        }
        user.madeTextRequests += 1;
        return true;
      } else if (request === "visualize") {
        if (user.madeVisualRequests == user.allowedVisualRequests) {
          return false;
        }
        user.madeVisualRequests += 1;
        return true;
      }

    default:
      return true;
  }
};

export const dropUpOptions = [
  {
    title: "quiz",
    desc: "Generate quiz questions",
  },
  // {
  //   title: "visualize",
  //   desc: "Stuck? Let AI explain visually",
  // },
];

// Get initials from username
export const getInitials = (userName: string) => {
  if (!userName) return "";

  const names = userName.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return userName[0].toUpperCase();
};

// Generate a consistent color based on username
export const generateColor = (name: string) => {
  const colors = [
    "bg-green-100 text-green-600 ",
    "bg-blue-500 text-white ",
    "bg-purple-100 text-purple-600 ",
    "bg-amber-100 text-amber-600 ",
    "bg-rose-100 text-rose-600 ",
    "bg-cyan-100 text-cyan-600 ",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

export const generateSessionId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const oneChabotMessage = ({
  newChat,
  conversation_id,
  role,
  category,
  agentName,
  content,
  internet,
  visualization,
}: {
  newChat: boolean;
  conversation_id: string | undefined;
  role: Role;
  category: string;
  agentName?: string;
  content?: string;
  internet?: boolean;
  visualization?: string;
}) => {
  const date = new Date();
  const message = {
    newChat: newChat,
    conversation_id: conversation_id,
    role: role,
    category: category,
    agentName: agentName,
    content: content,
    internet: internet,
    visualization: visualization,
    createdAt: date,
    updatedAt: date,
  };
  return message;
};

export const createChatAlert = ({
  conversation_id,
  alertType,
  title,
  message,
  score,
}: {
  conversation_id: string | undefined;
  alertType: "success" | "error" | "warning" | "info" | "quiz-complete" | "quiz-cancel";
  title?: string;
  message: string;
  score?: string;
}) => {
  const date = new Date();
  return {
    conversation_id: conversation_id,
    type: "alert",
    alertType: alertType,
    category: "system",
    title: title,
    content: message,
    score: score,
    createdAt: date,
    updatedAt: date,
  };
};
