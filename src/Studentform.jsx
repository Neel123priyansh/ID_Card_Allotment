import { useState } from "react";
import api from "./api";

export default function StudentForm({ epc }) {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const submitForm = async () => {
    if (!epc) {
      showToast("EPC not detected", "error");
      return;
    }

    if (!name.trim() || !rollNumber.trim() || !busNumber.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }

    try {
      setLoading(true);

      const checkResponse = await api.get(`/students/check-epc/${epc}`);
      if (checkResponse.data.exists) {
        showToast("Student with this EPC already exists", "error");
        return;
      }

      await api.post("/students/register", {
        name: name.trim(),
        rollNumber: rollNumber.trim(),
        busNumber: busNumber.trim(),
        epc: epc.toUpperCase(),
      });

      showToast("Student info saved");
      setName("");
      setRollNumber("");
      setBusNumber("");
    } catch (error) {
      if (error?.response?.data?.code === 11000) {
        showToast("EPC already registered", "error");
        return;
      }
      showToast(
        error?.response?.data?.message || "Failed to save student information",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Keyframe animations — Tailwind doesn't cover custom ones like pulse-opacity and spin variants */}
      <style>{`
        @keyframes sf-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes sf-spin  { to{transform:rotate(360deg)} }
        @keyframes sf-fadein {
          from { opacity:0; transform:translateX(-50%) translateY(6px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        .animate-sf-pulse { animation: sf-pulse 2s infinite; }
        .animate-sf-spin  { animation: sf-spin 0.7s linear infinite; }
        .animate-sf-fadein{ animation: sf-fadein 0.2s ease; }
      `}</style>

      {/* Page wrapper */}
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#f5f5f3]">

        {/* Card */}
        <div className="w-full max-w-[440px] bg-white border border-black/10 rounded-2xl p-8">

          {/* Header */}
          <div className="mb-7">
            <h2 className="text-[18px] font-medium text-[#111] mb-1">
              Register student
            </h2>
            <p className="text-[13px] text-[#888]">
              Scan an RFID tag, then fill in the details below.
            </p>
          </div>

          {/* EPC badge */}
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-[10px] border border-black/[0.08] bg-[#f9f9f8] mb-7">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                epc
                  ? "bg-[#1D9E75] animate-sf-pulse"
                  : "bg-[#bbb]"
              }`}
            />
            <span className="text-[12px] text-[#888] uppercase tracking-[0.06em] font-medium">
              EPC tag
            </span>
            <span
              className={`ml-auto text-[13px] font-medium font-mono tracking-[0.05em] ${
                epc ? "text-[#111]" : "text-[#aaa]"
              }`}
            >
              {epc ? epc.toUpperCase() : "Waiting..."}
            </span>
          </div>

          {/* Fields */}
          {[
            { label: "Name",        id: "name",       value: name,       setter: setName,       placeholder: "Full name" },
            { label: "Roll number", id: "roll",       value: rollNumber, setter: setRollNumber, placeholder: "e.g. 2024-CS-042" },
            { label: "Bus number",  id: "bus",        value: busNumber,  setter: setBusNumber,  placeholder: "e.g. BUS-07" },
          ].map(({ label, id, value, setter, placeholder }) => (
            <div key={id} className="mb-4">
              <label
                htmlFor={id}
                className="flex items-center gap-1.5 text-[12px] text-[#888] uppercase tracking-[0.05em] font-medium mb-1.5"
              >
                {label}
              </label>
              <input
                id={id}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="
                  w-full px-3.5 py-2.5 text-[15px]
                  border border-black/[0.15] rounded-lg
                  bg-white text-[#111] placeholder-[#bbb]
                  outline-none transition-all duration-150
                  focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10
                "
              />
            </div>
          ))}

          {/* Submit button */}
          <button
            onClick={submitForm}
            disabled={loading || !epc}
            className="
              w-full mt-6 py-3 rounded-[10px]
              flex items-center justify-center gap-2
              text-[15px] font-medium text-white
              bg-[#1D9E75] transition-all duration-150
              hover:enabled:opacity-90
              active:enabled:scale-[0.98]
              disabled:opacity-45 disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <>
                <span
                  className="
                    w-4 h-4 rounded-full shrink-0
                    border-2 border-white/35 border-t-white
                    animate-sf-spin
                  "
                />
                Saving...
              </>
            ) : (
              "Save student"
            )}
          </button>

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`
            fixed bottom-6 left-1/2 -translate-x-1/2
            flex items-center gap-2 px-4 py-2.5
            rounded-[10px] text-[14px] font-medium
            whitespace-nowrap z-[999] pointer-events-none
            animate-sf-fadein
            ${
              toast.type === "success"
                ? "bg-[#EAF3DE] text-[#3B6D11] border border-[#97C459]"
                : "bg-[#FCEBEB] text-[#A32D2D] border border-[#F09595]"
            }
          `}
        >
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}
    </>
  );
}