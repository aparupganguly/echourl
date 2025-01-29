import Image from "next/image";
import logo from "@/public/logo.svg"
export default function Header() {
  return (
    <header className=" text-white py-8 px-8">
      {/* <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center">EchoURL</h1>
        <p className="text-center mt-2">Generate podcasts from changelogs and topics with ease.</p>
      </div> */}
      <Image src={logo} alt="EchoURL" />

    </header>
  );
}