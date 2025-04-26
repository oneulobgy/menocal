import dynamic from "next/dynamic";
const MenopausePrediction = dynamic(() => import("../components/MenopausePrediction"), { ssr: false });

export default function Home() {
  return <MenopausePrediction />;
}