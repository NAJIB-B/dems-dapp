import Link from "next/link";
import ParaModal from "@/components/para/paraModal";
import CounterFeature from "@/components/dems/dems-feature";



export default function Home() {
  return (
	<section className="flex items-center justify-center h-screen bg-blue-600 text-white">
	<div className="text-center">
	  <h1 className="text-5xl font-extrabold mb-4">
		Welcome to <span className="text-blue-200">EstateDAO</span>
	  </h1>
	  <p className="text-lg text-blue-200 mb-8">
		Decentralized estate management made simple.
	  </p>

	  <div className="flex justify-center space-x-4">
		<Link href={"/estates"}>
		<button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-200 transition">
		  Create Estate
		</button>
		</Link>
		<Link href={"/estates"}>
		<button className="px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:bg-blue-900 transition">
		  Join Estate
		</button>
		</Link>
	  </div>
	</div>
  </section>
  );
}
