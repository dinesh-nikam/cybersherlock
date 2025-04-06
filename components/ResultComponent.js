import React from "react";

export default function ResultComponent({ results }) {
  return (
    <div className="bg-gray-800 p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Scan Results</h2>
      <pre className="text-sm">{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
