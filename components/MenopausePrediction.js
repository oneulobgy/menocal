import { useState } from "react";
import Image from "next/image";

export default function MenopausePrediction() {
  const [inputs, setInputs] = useState({
    currentAge: "",
    amh: "",
    fsh: "",
    familyHistory: "No",
    autoimmune: "No",
    chemo: "No",
  });
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const selectOption = (name, value) => {
    setInputs({ ...inputs, [name]: value });
  };

  const calculatePrediction = () => {
    let menopauseBaseAge = 51;
    let adjustments = 0;
    const reasons = [];

    const amh = parseFloat(inputs.amh);
    const fsh = parseFloat(inputs.fsh);
    const age = parseInt(inputs.currentAge, 10);

    if (amh < 0.5) {
      adjustments -= 2;
      reasons.push("AMH 0.5 미만 → -2년");
    }
    if (amh < 0.2) {
      adjustments -= 2;
      reasons.push("AMH 0.2 미만 → 추가 -2년");
    }

    if (fsh > 10) {
      adjustments -= 1;
      reasons.push("FSH 10 초과 → -1년");
    }
    if (fsh > 15) {
      adjustments -= 1;
      reasons.push("FSH 15 초과 → 추가 -1년");
    }
    if (fsh > 20) {
      adjustments -= 1;
      reasons.push("FSH 20 초과 → 추가 -1년");
    }

    if (inputs.familyHistory === "Yes") {
      adjustments -= 2;
      reasons.push("조기폐경 가족력 있음 → -2년");
    }
    if (inputs.autoimmune === "Yes") {
      adjustments -= 2;
      reasons.push("자가면역질환 있음 → -2년");
    }
    if (inputs.chemo === "Yes") {
      adjustments -= 3;
      reasons.push("항암치료력 있음 → -3년");
    }

    const expectedMenopauseAge = menopauseBaseAge + adjustments;
    const yearsRemaining = Math.max(0, expectedMenopauseAge - age);

    let riskLevel = "✅ 정상 범위";
    let riskColor = "text-green-600";
    if (age < 40 && amh <= 0.2) {
      riskLevel = "🚨 조기폐경 매우 높음";
      riskColor = "text-red-600";
    } else if (age < 40 && amh <= 0.5) {
      riskLevel = "⚠️ 조기폐경 위험 있음";
      riskColor = "text-yellow-500";
    }

    setResult({ expectedMenopauseAge, yearsRemaining, adjustments, riskLevel, riskColor, currentAge: age });
    setExplanation(reasons);
  };

  const resetForm = () => {
    setInputs({
      currentAge: "",
      amh: "",
      fsh: "",
      familyHistory: "No",
      autoimmune: "No",
      chemo: "No",
    });
    setResult(null);
    setExplanation([]);
  };

  const renderYesNoButtons = (label, name) => (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <div className="flex space-x-2">
        {["Yes", "No"].map((val) => (
          <button
            key={val}
            onClick={() => selectOption(name, val)}
            className={`flex-1 px-4 py-2 rounded-lg border ${
              inputs[name] === val ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="오늘산부인과 로고" width={180} height={60} />
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">폐경 예상 계산기</h1>
        <div className="flex flex-col items-center space-y-4">
          {[
            { name: "currentAge", label: "현재 나이 (세)" },
            { name: "amh", label: "AMH 수치 (ng/mL)" },
            { name: "fsh", label: "FSH 수치 (IU/L)" },
          ].map((field) => (
            <div key={field.name} className="w-full max-w-xs">
              <label className="block text-sm font-semibold mb-1">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={inputs[field.name]}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </div>
          ))}
          {renderYesNoButtons("조기폐경 가족력", "familyHistory")}
          {renderYesNoButtons("자가면역질환 유무", "autoimmune")}
          {renderYesNoButtons("항암치료력 유무", "chemo")}
        </div>
        <div className="mt-6 flex flex-col items-center space-y-2">
          <div className="flex space-x-4">
            <button onClick={calculatePrediction} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">결과 계산</button>
            <button onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">초기화</button>
          </div>
        </div>
        {result && (
          <div className="mt-8 p-6 max-w-md mx-auto bg-green-100 rounded-2xl shadow-lg text-center">
            <p className={`text-lg font-semibold mb-2 ${result.riskColor}`}>{result.riskLevel}</p>
            <p className="text-lg mb-2">현재 나이: {result.currentAge}세</p>
            <p className="text-lg mb-2">난소 기능 상태: {result.adjustments}년 조정</p>
            <p className="text-2xl font-bold mb-2">👉 예상 폐경 시기: {result.expectedMenopauseAge}세 전후</p>
            <p className="text-md mb-4">(앞으로 약 {result.yearsRemaining}년 이내 폐경 가능성)</p>
            {explanation.length > 0 && (
              <div className="text-left bg-white p-4 rounded-xl border mt-4">
                <p className="font-semibold mb-2">🧾 계산 근거:</p>
                <ul className="list-disc ml-5 text-sm">
                  {explanation.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-xs text-gray-500 mt-6">
              ※ 본 결과는 개인 상담 및 건강 관리 방향 설정을 위한 참고 자료이며,<br />
              실제 진단이나 의학적 결정을 대신하지 않습니다.<br />
              정확한 진단과 치료는 의료진 상담을 통해 진행해 주세요.
              <br />
              <a href="https://naver.me/xJiBlAUU" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">
                더 자세한 상담 예약하기
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}