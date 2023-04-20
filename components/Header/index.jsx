import { useRouter } from "next/router";

export function Header(props) {
  const router = useRouter();
  const backgroundColor = props.backgroundColor || "bg-[#2475c0]";
  const component = props.component;
  const hideLogo = props.hideLogo || false;
  const handleBack = props.handleBack;

  if (component) {
    return (
      <header
        className={`inline-flex items-center w-full px-5 py-4 space-x-4 ${backgroundColor}`}
      >
        {component}
      </header>
    );
  }

  return (
    <header
      className={`inline-flex items-center w-full px-5 py-4 space-x-4 ${backgroundColor}`}
    >
      <div className="inline-flex items-center justify-between w-full h-auto">
        <div
          onClick={() => (handleBack ? handleBack() : router.back())}
          className="inline-flex items-center justify-center space-x-3"
        >
          <svg
            className="h-5 w-5 text-gray-200"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-gray-200 text-md">Back</span>
        </div>
        {!hideLogo && (
          <img
            src="https://pwip.co/assets/web/img/web/whiteness-meter-lp/logo-white.png"
            className="h-5"
          />
        )}
      </div>
    </header>
  );
}
