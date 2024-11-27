"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  RefreshCw,
  Menu,
  X,
  ChevronRight,
  Users,
  Lock,
  Coins,
  Image as ImageIcon,
} from "lucide-react";
import Marquee from "./components/landingPage/Marquee";
import Link from "next/link";
import Image from "next/image";

const IconWrapper = ({ children }) => (
  <div className="bg-gradient-to-r from-[#29FF81] to-yellow-300 rounded-full p-3 max-w-max">
    {children}
  </div>
);

const ScrollReveal = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMilestone((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const useCases = [
    {
      title: "High-Value Token Transfers",
      description:
        "Ensure the security of large token transfers between individuals or organizations with our double confirmation process.",
    },
    {
      title: "NFT Marketplace Integrations",
      description:
        "Provide an extra layer of security for NFT sales and transfers, protecting both buyers and sellers.",
    },
    {
      title: "DeFi Protocol Interactions",
      description:
        "Safeguard interactions with DeFi protocols by confirming the exact terms of token swaps or liquidity provisions.",
    },
    // {
    //   title: "Cross-Chain Asset Transfers",
    //   description:
    //     "Facilitate secure cross-chain transfers of tokens and NFTs with mutual consent verification on both chains.",
    // },
    // {
    //   title: "Corporate Treasury Management",
    //   description:
    //     "Implement additional security measures for managing and transferring corporate digital assets.",
    // },
    {
      title: "Escrow Services",
      description:
        "Create secure, decentralized escrow services for complex transactions involving multiple parties.",
    },
  ];
  const reasonToChooseHS = [
    {
      icon: <Lock className="w-8 h-8 text-black" />,
      title: "Unparalleled Security",
      description:
        "Our double confirmation process and advanced security measures significantly reduce the risk of errors, fraud, and unauthorized transfers for both tokens and NFTs.",
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "Enhanced User Experience",
      description:
        "Intuitive interface and flexible gas payment options make it easy and cost-effective for users of all levels to securely transfer digital assets.",
    },
    {
      icon: <Coins className="w-8 h-8 text-black" />,
      title: "Versatility",
      description:
        "Support for both fungible tokens and NFTs makes HandShake a one-stop solution for all your digital asset transfer needs.",
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Regulatory Compliance",
      description:
        "Our protocol is designed with regulatory considerations in mind, helping users stay compliant with evolving digital asset regulations.",
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-black" />,
      title: "Scalability",
      description:
        "Built on efficient smart contracts, HandShake can handle high volumes of transfers without compromising on speed or security.",
    },
    {
      icon: <Zap className="w-8 h-8 text-black" />,
      title: "Innovation-Driven",
      description:
        "We continuously evolve our protocol to incorporate the latest advancements in blockchain technology and security practices.",
    },
  ];
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Mutual Consent Transfers",
      description:
        "Both parties must agree before any transfer occurs, eliminating errors and enhancing security for both tokens and NFTs.",
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-black" />,
      title: "Flexible Gas Payments",
      description:
        "Choose who pays the gas fee - sender, recipient, or even a third party. Supports sponsored transactions for a seamless user experience.",
    },
    {
      icon: <Zap className="w-8 h-8 text-black" />,
      title: "EIP-712 Integration",
      description:
        "Leverage clear, structured data for enhanced security and transparency in every transaction, ensuring users understand what they're signing.",
    },
    {
      icon: <ImageIcon className="w-8 h-8 text-black" />,
      title: "NFT Transfer Support",
      description:
        "Securely transfer NFTs with the same level of protection and consent as fungible tokens, preserving the value of your digital collectibles.",
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "User-Friendly Interface",
      description:
        "Intuitive design makes it easy for both beginners and experienced users to securely transfer tokens and NFTs.",
    },
    {
      icon: <Lock className="w-8 h-8 text-black" />,
      title: "Advanced Security Measures",
      description:
        "Implement multi-factor authentication and real-time transaction monitoring to further enhance the security of your transfers.",
    },
  ];

  const howHSWorks = [
    {
      title: "1. Initiation",
      description:
        "Sender initiates the transfer by signing a digital proposal for tokens or NFTs.",
    },
    {
      title: "2. Recipient's Consent",
      description:
        "Recipient reviews the details and signs to accept the transfer, ensuring full agreement.",
    },
    {
      title: "3. Smart Contract Execution",
      description:
        "Our advanced smart contract verifies both signatures and executes the transfer securely.",
    },
    {
      title: "4. On-Chain Verification",
      description:
        "The transaction is verified and recorded on the blockchain, providing immutable proof of the transfer.",
    },
    {
      title: "5. Gas Fee Handling",
      description:
        "Flexible options allow for sender, recipient, or third-party payment of gas fees, including sponsored transactions.",
    },
    {
      title: "6. NFT Metadata Verification",
      description:
        "For NFT transfers, additional checks ensure the integrity and authenticity of the NFT's metadata.",
    },
  ];
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="relative z-10">
        <main>
          <div className="relative min-h-screen overflow-hidden">
            <header className="sticky top-0 container mx-auto p-5 md:p-10 flex gap-2 justify-between items-center z-20">
              <Link
                href="/"
                className="bg-white text-gray-800 font-bold py-2 px-3 md:py-3 md:px-8 rounded-lg transition-all duration-300 flex items-center border-2 border-gray-200 hover:border-gray-300 shadow-lg"
              >
                <div className="flex items-center">
                  <Image
                    width={35}
                    height={35}
                    src="/handshake.png"
                    className="logoImage w-[20px] md:w-full h-[20px] md:h-full"
                    alt=""
                  />
                  <span className="font-dmsans font-bold ml-2 text-[0.865rem] md:text-[1.2rem] ld:text-[1.2rem]">
                    Handshake
                  </span>
                </div>
              </Link>
              <Link
                href="/dashboard"
                className="bg-[#29FF81] text-[0.865rem] md:text-[1rem] text-black font-bold py-2 px-3 md:py-3 md:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 text-black" />
                <span className="ml-2">Launch App</span>
              </Link>
            </header>
            {/* Dot pattern background */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/img/dots.png"
                alt="Background pattern"
                layout="fill"
                objectFit="cover"
                quality={100}
              />
            </div>
            {/* Green blob */}
            <div className="absolute -right-20 top-0 z-0">
              <Image
                src="/img/green_blob.png"
                alt="Green blob"
                width={1000}
                height={1000}
                objectFit="cover"
              />
            </div>
            <section className="container mt-10 space-y-10 mx-auto p-14 md:p-20 text-center z-20 relative">
              <motion.h2
                className="text-4xl md:text-7xl font-bold mb-6 max-w-3xl text-left text-gray-900 bg-clip-text text-black z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Revolutionizing Token and NFT Transfers
              </motion.h2>
              <motion.p
                className="text-xl md:text-2xl mb-8 text-left text-gray-600 max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                HandShake Protocol ensures secure, consensual transfers of both
                fungible tokens and NFTs. Experience the future of digital asset
                exchanges with unparalleled security and flexibility.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row justify-start items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link
                  className="bg-[#29FF81] text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
                  href="/dashboard"
                >
                  <ArrowRight className="w-5 h-5 text-black" />
                  <span className="ml-2">Get Started</span>
                </Link>
              </motion.div>
            </section>
          </div>
          <ScrollReveal>
            <section
              id="features"
              className="features container mx-auto px-4 py-20"
            >
              <h3 className="text-4xl font-bold mb-12 text-center text-gray-900">
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 1,
                      staggerChildren: 0.5,
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <IconWrapper>{feature.icon}</IconWrapper>
                    <h4 className="text-2xl font-bold mb-2 mt-4 text-gray-900">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section
              id="how-it-works"
              className="how-it-works container mx-auto px-4 py-20 bg-black "
            >
              <h3 className="text-4xl font-bold mb-12 text-center text-[#29FF81]">
                How HandShake Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {howHSWorks.map((step, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative overflow-hidden"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#29FF81]"></div>
                    <h4 className="text-2xl font-bold mb-4 text-black">
                      {step.title}
                    </h4>
                    <p className="text-gray-600">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section
              id="benefits"
              className="benefits container mx-auto px-4 py-20"
            >
              <h3 className="text-4xl font-bold mb-12 text-center text-gray-900">
                Why Choose HandShake
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {reasonToChooseHS.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <IconWrapper>{benefit.icon}</IconWrapper>
                    <h4 className="text-2xl font-bold mb-2 mt-4 text-gray-900">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section
              id="use-cases"
              className="use-cases container mx-auto px-4 py-20  bg-black"
            >
              <h3 className="text-4xl font-bold mb-12 text-center text-[#29FF81]">
                Use Cases
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {useCases.map((useCase, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative overflow-hidden"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#29FF81]"></div>
                    <h4 className="text-2xl font-bold mb-4 text-black">
                      {useCase.title}
                    </h4>
                    <p className="text-gray-600">{useCase.description}</p>
                  </motion.div>
                ))}
              </div>
              <h3 className="text-2xl font-bold my-12 text-center text-[#29FF81]">
                & many more...
              </h3>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section className="cta container mx-auto px-4 py-24 text-center flex flex-col items-center justify-center">
              <h3 className="text-4xl font-bold mb-6 text-gray-900">
                Ready to Revolutionize Your Token and NFT Transfers?
              </h3>
              <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
                Join thousands of users and businesses who trust HandShake for
                their digital asset transfers. Experience the peace of mind that
                comes with our secure, user-friendly platform.
              </p>
              <Link
                href="/dashboard"
                className="bg-[#29FF81] text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 text-black" />
                <span className="ml-2">Get Started Now</span>
              </Link>
            </section>
          </ScrollReveal>

          <Marquee />
        </main>

        <footer className="bg-black text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center">
              {/* <h5 className="text-2xl font-bold mb-4">HandShake</h5> */}
              <Link
                href="/"
                className="mb-6 bg-white text-gray-800 font-bold py-3 px-8 rounded-lg transition-all duration-300 flex items-center border-2 border-gray-200 hover:border-gray-300 shadow-lg"
              >
                <div className="flex items-center">
                  <Image
                    width={35}
                    height={35}
                    src="/handshake.png"
                    className="logoImage "
                    alt=""
                  />
                  <span className="logoText md:text-1rem ld:text-[1.2rem]">
                    Handshake
                  </span>
                </div>
              </Link>
              <p className="text-gray-400 text-center max-w-md">
                Revolutionizing token and NFT transfers with unparalleled
                security and user experience. Ensuring safe, consensual, and
                efficient digital asset exchanges for a decentralized future.
              </p>
              <div className="mt-8 text-sm text-gray-400">
                © 2024 HandShake Protocol. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
