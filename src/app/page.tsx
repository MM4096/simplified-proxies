import Link from "next/link";

export default function Home() {
  return (<div className="flex flex-col items-center h-full justify-center w-max child-w-full gap-2">
	  <h1>Simplified Proxies</h1>
	  <div className="mb-5"/>
	  <Link href="/editor/mtg" className="btn btn-primary">Magic: The Gathering Editor</Link>
	  <Link href="/editor/ptcg" className="btn btn-primary">Pokemon Trading Card Game Editor</Link>
  </div>);
}
