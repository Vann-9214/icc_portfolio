// components/background-blobs.tsx

export function BackgroundBlobs() {
  return (
    // Added 'fixed' and high 'z-index' context to ensure it stays behind everything else
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Increased opacity to 40% so it is definitely visible */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500 opacity-40 blur-[128px]" />
    </div>
  );
}