import Link from "next/link";

// Heading: It is being used at Settings & User Profile to display links.
const Heading = ({title}: {title: string}) => {
  return (
    <>
      <div className="text-dark-custom-dark-blue mx-2">
        <Link
          href={{
            query: {get: title.toLowerCase()},
          }}
        >
          {title}
        </Link>
      </div>
    </>
  );
};
export default Heading;
