import Hero from "./components/Hero";

// Set VITE_PREVIEW=1 for shareable previews that still carry placeholder content.
const preview = import.meta.env.VITE_PREVIEW === "1";

export default function App() {
  return (
    <>
      {preview && (
        <div className="relative z-30 bg-sky-400 text-black text-center text-xs px-4 py-2">
          プレビュー版：導入企業名・お客様の声・一部の数値と料金は仮のものです
        </div>
      )}
      <Hero />
    </>
  );
}
