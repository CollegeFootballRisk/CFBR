import MapControls from "@/features/map/components/MapControls";

export default function Home() {
  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <MapControls />

      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-semibold">College Football Risk</h1>
          <p className="mt-2">Map coming soon.</p>
        </div>
      </div>
    </div>
  );
}
