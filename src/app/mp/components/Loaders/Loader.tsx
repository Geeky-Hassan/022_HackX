import {Loader2} from "lucide-react";

interface LoaderProps {
  color?: string;
  size?: number;
}
const Loader = ({size = 16, color = "#83AADF"}: LoaderProps) => {
  return <Loader2 size={size} color={color} className="animate-spin" />;
};

export default Loader;
