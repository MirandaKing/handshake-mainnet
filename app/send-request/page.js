import dynamic from "next/dynamic";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
});
const SendRequest = dynamic(
  () => import("../components/sendRequest/SendRequest"),
  {
    ssr: false,
  }
);

export default function SendRequestPage() {
  return (
    <div className="main-dashboard">
      <Header />
      {/* <Marquee /> */}
      <SendRequest />
    </div>
  );
}
