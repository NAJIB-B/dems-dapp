
import Link from "next/link";
import ParaModal from "@/components/para/paraModal";
import CounterFeature from "@/components/dems/dems-feature";


const links = ["Estates", "Your Estate", "About us"]

export default function Home() {
  return (
  <div>
	<div className="flex bg-base-300 dark:text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0 py-4 bg-slate-500">
        <div className="flex-1">
          <Link className="btn btn-ghost normal-case text-xl" href="/">
            Counter
          </Link>
          <ul className="flex flex-row px-1 space-x-2">
            {links.map((link, key) => (
              <li key={key}>
                <Link  href={link}>
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-none space-x-2">
	
		<ParaModal></ParaModal>
	
		
        </div>
      </div>
	  <CounterFeature></CounterFeature>

  </div>
  );
}
