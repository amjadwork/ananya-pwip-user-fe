import { useRouter } from "next/router";

export function BottomNavBar(props) {
  const router = useRouter();

  return (
    <nav
      className={`inline-flex items-center w-full px-5 py-4 space-x-4 bg-pwip-white-100 h-[88px] fixed bottom-0`}
      style={{
        boxShadow: "12px -3px 29px 17px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/*  */}
    </nav>
  );
}
