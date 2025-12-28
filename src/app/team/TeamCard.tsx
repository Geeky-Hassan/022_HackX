import { motion } from "framer-motion";

interface TeamData {
  role: string;
  name: string;
  img: string;
  scale: number;
  linkedin: string;
}

const TeamCard: React.FC<TeamData> = ({ role, name, img, scale, linkedin }) => {
  return (
    <motion.div
      className="relative w-full md:w-80 h-96 rounded-xl overflow-hidden bg-white shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 4px 20px #1D68FF",
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      <div className="relative w-full h-full cursor-pointer group">
        <img
          loading="lazy"
          src={img}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          style={{ scale }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent z-0 pointer-events-none"></div>

        {/* Bottom Left Info Container */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-10 overflow-visible">
          <div className="flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-4">
            <h3 className="text-xl font-semibold">{name}</h3>
            <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <p>{role}</p>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="text-blue-300 hover:text-white transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 
                      2.239 5 5 5h14c2.761 0 5-2.239 
                      5-5v-14c0-2.761-2.239-5-5-5zm-11 
                      19h-3v-10h3v10zm-1.5-11.268c-.966 
                      0-1.75-.79-1.75-1.764s.784-1.764 
                      1.75-1.764 1.75.79 1.75 
                      1.764-.784 1.764-1.75 
                      1.764zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.867-3.063-1.869 
                      0-2.155 1.46-2.155 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.759 
                      1.379-1.56 2.837-1.56 3.033 
                      0 3.593 1.996 3.593 4.59v5.603z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;
