
import React, { useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Upload image first");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/detect", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    setLoading(false);
  };

  const downloadJSON = () => {
    const blob = new Blob([result], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "detection_result.json";
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-cyan-400">K-AI Ultra Premium Detection</h1>

      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-lg">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 w-full text-white"
        />

        <button
          onClick={handleUpload}
          className="bg-cyan-500 hover:bg-cyan-400 px-4 py-2 rounded-xl w-full mb-4"
        >
          {loading ? "Processing..." : "Run AI Detection"}
        </button>

        {result && (
          <>
            <pre className="bg-black p-4 rounded-xl text-sm overflow-auto">{result}</pre>
            <button
              onClick={downloadJSON}
              className="mt-4 bg-green-500 hover:bg-green-400 px-4 py-2 rounded-xl w-full"
            >
              Download JSON
            </button>
          </>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
