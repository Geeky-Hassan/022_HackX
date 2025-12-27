const Button = ({title, place}: {title: string; place: string}) => {
  const handleClick = () => (window.location.href = "/mp/login");
  return (
    <>
      {/* Blue border animation overlay */}
      {place === "Navbar" ? (
        <button
          onClick={handleClick}
          className="group relative overflow-hidden rounded-full border border-dark-logo-primary bg-transparent px-4 py-2 font-poppins font-semibold text-dark-logo-primary transition-colors hover:text-white"
        >
          {/* Blue border animation overlay */}
          <span className="absolute inset-0 -z-10 h-full w-0  transition-all duration-300 ease-out group-hover:w-full"
          style={{
             background: "linear-gradient(180deg, #113E99, #1D68FF)"
          }}></span>

          {title}
        </button>
      ) : (
        <button
          onClick={handleClick}
          className="group flex items-center justify-center gap-2 md:w-fit w-full overflow-hidden rounded-full border border-dark-logo-primary 
      bg-white px-6 py-3 font-poppins text-xl font-semibold text-dark-logo-primary transition-colors"
        >
          {title}
        </button>
      )}
    </>
  );
};

export default Button;
