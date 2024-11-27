import dynamic from "next/dynamic";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
});

const SponsorSignUp = dynamic(
  () => import("../components/sponsor-signup/SponsorSignup"),
  {
    ssr: false,
  }
);

export default function SponsorSignup() {
  return (
    <div className="main-dashboard">
      <Header />
      <SponsorSignUp />
    </div>
  );
}
