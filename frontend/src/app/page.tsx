import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold text-black mb-2">Trading Bot Platform</h1>
      <p className="text-lg text-accent mb-6">Automate your trading with style and security.</p>
      <button className="px-6 py-3 rounded-lg bg-black text-white font-semibold shadow-subtle hover:shadow-strong transition-all">Get Started</button>
    </div>
  );
}
