import { Cpu, Code2, Gamepad2, Wifi } from "lucide-react";

export const HERO_DATA = {
  name: {
    first: "Ivan Clement",
    last: "Cañete",
  },
  role: "- Computer Engineering Student",
  description:
    "Building complex systems from the ground up — engineering everything from physical circuits to polished web interfaces.",
  socials: {
    github: {
      url: "https://github.com/Vann-9214",
      handle: "@Vann-9214",
    },
    linkedin: {
      url: "https://www.linkedin.com/in/ivan-canete/",
      label: "LinkedIn",
    },
    resume: {
      url: "/Ivan Cañete, Resume.pdf",
      label: "Resume",
    },
  },
};

export const SPECIALTIES = [
  {
    label: "Hardware",
    icon: Cpu,
    style: "text-amber-700 border-amber-700/30 bg-amber-700/10",
    dot: "bg-amber-700",
  },
  {
    label: "Software",
    icon: Code2,
    style: "text-blue-700 border-blue-700/30 bg-blue-700/10",
    dot: "bg-blue-700",
  },
  {
    label: "Game Dev",
    icon: Gamepad2,
    style: "text-purple-700 border-purple-700/30 bg-purple-700/10",
    dot: "bg-purple-700",
  },
  {
    label: "IoT",
    icon: Wifi,
    style: "text-teal-700 border-teal-700/30 bg-teal-700/10",
    dot: "bg-teal-700",
  },
];

export const ABOUT_DATA = {
  heading: "About",
  paragraphs: [
    "I am a 3rd-year Computer Engineering student at Cebu Institute of Technology – University. I specialize in software architecture, AI integration, and building robot projects.",
    "I design full-scale solutions—from writing the logic to wiring custom PCBs.",
  ],
};

export const TECH_STACK = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "TS" },
  { name: "Node.js", icon: "⬢" },
  { name: "Python", icon: "🐍" },
  { name: "Arduino", icon: "◉" },
  { name: "C++", icon: "C++" },
  { name: "Figma", icon: "◈" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "TailwindCSS", icon: "💨" },
  { name: "Git", icon: "⎇" },
  { name: "Docker", icon: "🐳" },
];