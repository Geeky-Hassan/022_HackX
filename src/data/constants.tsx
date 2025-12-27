import {MessageSquare, BookOpen, Heart, Users, FileText, Briefcase, Calendar} from "lucide-react";
import pla from "../assets/images/AllFeatures/pla.webp";
import aibr from "../assets/images/AllFeatures/aibr.webp";
import aih from "../assets/images/AllFeatures/aih.webp";
import chatbot from "../assets/images/AllFeatures/chatbot.webp";
import events from "../assets/images/AllFeatures/events.webp";
import job from "../assets/images/AllFeatures/job.webp";
import sco from "../assets/images/AllFeatures/sco.webp";
import {Card} from "@/types";
import axios from "axios";

export const NavItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/#about",
  },
  {
    label: "Features",
    href: "/features",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  // {
  //   label: "Blogs",
  //   href: "/redirect",
  // },
  {
    label: "Meet Our Team",
    href: "/team",
  },
];

export const HomeHeroContent = {
  title1: "Your Personalized",
  title2: "Learning Companion",
  description:
    "MyPath is your personalized education companion, guiding students from Grade 9 to PhD with AI-powered tools. Whether you need learning support, mental wellness resources, accommodation details, or career-building features, MyPath is here to help you succeed at every step of your journey. Together, we pave the way to a brighter future.",
  Button1: "Book a Demo",
  Button2: "Join Waitlist",
};

const styles = {
  icons: {
    width: "5em",
    height: "5em",
  },
  socialIcons: {
    width: "2.5em",
    height: "2.5em",
  },
};

export const AboutHeroContent = {
  title: "Partnering for Innovation and Trust",
  acheivement: [
    {
      image: pla,
      id: 1,
      name: "Client 1",
    },
    {
      image: pla,
      id: 2,
      name: "Client 2",
    },
    {
      image: pla,
      id: 3,
      name: "Client 3",
    },
    {
      image: pla,
      id: 4,
      name: "Client 4",
    },
    {
      image: pla,
      id: 5,
      name: "Client 5",
    },
    {
      image: pla,
      id: 6,
      name: "Client 6",
    },
    {
      image: pla,
      id: 7,
      name: "Client 7",
    },
    {
      image: pla,
      id: 8,
      name: "Client 8",
    },
  ],
};

export const featureContent = {
  featureTitle: "Features",
  mainHeading: "Features That Boost Your Productivity",
  subHeading: "And Features That Foster Collaboration and Success",
  feature: [
    {
      title: "Subject Specific AI Tutor",
      description:
        "Instant, structured help for Math, Physics, Coding, SAT, and A/O Levels. Tutors provide step by step explanations, not just answers.",
      icon: <MessageSquare style={styles.icons} />,
      img: "/lottieFiles/Teacher.json",
    },
    {
      title: "Interactive Videos & Animations",
      description: "Real-time, AI-generated animated explanations for complex concepts.",
      icon: <Users style={styles.icons} />,
      img: "/lottieFiles/TeacherPythagorasTheorem.json",
    },
    {
      title: "Adaptive Learning Paths",
      description:
        "AI tracks progress, identifies weak areas, and recommends custom learning journeys.",
      icon: <Heart style={styles.icons} />,
      img: "/lottieFiles/BooQooLottieLearningPath.json",
    },
    {
      title: "Voice Support in Local Languages",
      description: "Learn in your preferred language for better understanding.",
      icon: <Briefcase style={styles.icons} />,
      img: "/lottieFiles/chatbot.json",
    },
    {
      title: "Personalized Persona",
      description:
        "Create and customize learning avatars that guide students through lessons and adapt to their learning pace.",
      icon: <Briefcase style={styles.icons} />,
      img: "/lottieFiles/avatar.json",
    },
    {
      title: "Interactive Stories",
      description:
        "Engage learners with branching stories and scenarios that reinforce concepts through play and exploration.",
      icon: <Briefcase style={styles.icons} />,
      img: "/lottieFiles/storyicon.json",
    },
  ],
};

export const quickLinks = [
  {
    title: "Try MyPath",
    href: "/mp",
  },
  {
    title: "Privacy Policy",
    href: "privacy-policy",
  },
  {
    title: "Terms & Conditions",
    href: "terms&Conditions",
  },
];

export const pricingPlans = [
  {
    title: "Chill Plan",
    price: 0,
    features: [
      "ChatBot (15 requests/day)",
      "1 video/day",
      "3 quizes/day",
      "Deep Thinking",
      "Internet Access",
      "Subject Specific AI Tutor",
    ],
    buttonText: "Get Started",
  },
  {
    title: "Exam Plan",
    price: 1500,
    features: [
      "All the Features",
      "5 videos/day",
      "Unlimited quizes/day",
      "Deep Thinking",
      "Internet Access",
    ],
    buttonText: "Get Started",
    highlighted: true,
    recommended: true,
  },
  {
    title: "Institutional Plan",
    features: [
      "Bulk access to AI Tutors for Math, Physics & Coding",
      "Central dashboard to manage student progress",
      "API integration into school platforms",
      "Curriculum-aligned content & progress tracking",
    ],
    buttonText: "Contact Us",
  },
];
export const BannerContent = [
  {
    title: "Facebook",
    image: "/assets/images/socials/facebook.svg",
    href: "https://www.facebook.com/profile.php?id=61566506248800",
  },
  {
    title: "Instagram",
    image: "/assets/images/socials/instagram.svg",
    href: "https://www.instagram.com/mypath_ai",
  },
  {
    title: "YouTube",
    image: "/assets/images/socials/youtube.svg",
    href: "https://www.youtube.com/@mypathai",
  },
  {
    title: "LinkedIn",
    image: "/assets/images/socials/linkedin.svg",
    href: "https://www.linkedin.com/company/mypathai",
  },
];
export const slider = [
  {
    key: "Maths",
    title: "What's the best way to teach someone about momentum?",
    description: "Give them a push 🫸! Similarly, let MyPath give your studies a little push.",
    buttonText: "Try MyPath!",
    images: [
      "/assets/images/hero/physics/PI.svg",
      "/assets/images/hero/physics/ALPHA.svg",
      "/assets/images/hero/physics/LAMBDA.svg",
      "/assets/images/hero/physics/SIGMA.svg",
    ],
  },
  {
    key: "Physics",
    title: "π π ka hisaab loun ga",
    description: "Hisaab seekhny ky baad😉",
    buttonText: "Try MyPath!",
    images: [
      "/assets/images/hero/physics/PI.svg",
      "/assets/images/hero/physics/ALPHA.svg",
      "/assets/images/hero/physics/LAMBDA.svg",
      "/assets/images/hero/physics/SIGMA.svg",
    ],
  },
  {
    key: "CompSci",
    title: "HTML, CSS seekh kr khud ko Web Developer samajhnay walon!",
    description: "MyPath pr ao, aur actual mein Web Development seekho!",
    buttonText: "Try MyPath!",
    images: [
      "/assets/images/hero/physics/PI.svg",
      "/assets/images/hero/physics/ALPHA.svg",
      "/assets/images/hero/physics/LAMBDA.svg",
      "/assets/images/hero/physics/SIGMA.svg",
    ],
  },
];
export const cards: Card[] = [
  {
    id: 1,
    title: "Personalized AI Chatbot",
    content: "Your 24/7 personal tutor that adapts to your learning style and needs.",
    description:
      "Meet your always-available study buddy! Whether you're stuck on a tricky equation or need a step-by-step breakdown, our AI tutor adapts to your learning style and explains concepts in a way that makes sense to you. No more confusion, no more wasted time—just instant, expert help whenever you need it.",
  },
  {
    id: 2,
    title: "Video Visualization",
    content: "Turn abstract concepts into interactive visual stories powered by AI.",
    description:
      "Some things are easier to understand when you can see them in action. Our AI brings your lessons to life with real-time animations, diagrams, and interactive simulations. Watch equations move, graphs transform, and concepts unfold visually to help you truly understand—not just memorize.",
  },
  {
    id: 3,
    title: "Interactive Quizzes",
    content: "Practice smarter with adaptive quizzes that evolve as you learn.",
    description:
      "No more one-size-fits-all tests! Our AI generates adaptive quizzes based on your progress and learning patterns. Get instant feedback, identify weak areas, and watch yourself improve with every question—turning revision into a fun, personalized challenge.",
  },
  {
    id: 4,
    title: "Flashcards",
    content: "Master key concepts faster with AI-generated, smart revision flashcards.",
    description:
      "Revision made effortless! MyPath’s AI automatically creates flashcards from your notes, lectures, or lessons—helping you retain important definitions, formulas, and concepts. Perfect for exam prep or quick study sessions, anytime, anywhere.",
  },
  {
    id: 5,
    title: "Storybooks",
    content: "Learn STEM through storytelling—where science meets imagination.",
    description:
      "Who said learning can’t be fun? Dive into interactive storybooks that explain complex STEM ideas through creative, real-world narratives. Each story simplifies big ideas—from motion to coding—so students can connect theory with everyday life in a relatable, engaging way.",
  },
  {
    id: 6,
    title: "PPT Videos",
    content: "AI-generated animated slides that turn your notes into visual lectures.",
    description:
      "Transform your study materials into dynamic, auto-animated video lectures! Just upload your notes or slides, and let MyPath’s AI convert them into captivating visual explanations. Ideal for both self-study and classroom teaching—making content creation effortless and engaging.",
  },
];

export const getUserLocation = async () => {
  const res = await axios.get("https://ipinfo.io/json?token=5755adbf32fc7b");

  if (res.status === 200) {
    return res.data;
  }
};

export const getUSDPrice = async (amount: number) => {
  const res = await axios.get(
    `https://v6.exchangerate-api.com/v6/d98e121f0841ca92e1727c1a/pair/PKR/USD/${amount}`,
  );
  if (res.status === 200) {
    return res.data;
  }
};

export const ALLOWED_FILE_TYPES = [".jpg", ".jpeg", ".png", ".pdf", ".docx"];
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
