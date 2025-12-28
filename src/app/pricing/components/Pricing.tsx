// ---------------------
// Imports
// ---------------------
import Plans from "./Plans";

export default function PricingTables() {
  return (
    <>
      <section className="my-0 z-0">
        <div className="heading my-6 text-center">
          <h1
            className="h1 text-4xl text-black dark:text-dark"
            style={{
              fontWeight: "800",
              fontSize: "48px",
            }}
          >
            Flexible Pricing for Everyone
          </h1>
          <p className="span text-xl text-center pt-5 text-gray-500"
           style={{
            fontWeight: "500",
            fontSize: "20px",
          }}>
            Choose a plan that works best for your learning style and budget.
          </p>
        </div>
        {/* <!-- Pricing toggle --> */}
        <div className="flex justify-center max-w-[14rem] m-auto my-2 lg:mb-16">
             <button
                className="relative z-10 overflow-hidden rounded-full px-6 py-2 text-base md:text-lg font-semibold text-white"
                style={{
                  background: "linear-gradient(180deg, #113E99, #1D68FF)",
                  border: "none",
                }}
              >
                <span className="relative z-10">Monthly</span>
              </button>
        </div>
        <Plans />
      </section>
    </>
  );
}
