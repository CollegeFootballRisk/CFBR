import MapIcon from "./MapIcon";

export default function ResetMapIcon() {
  return (
    <MapIcon>
      {/* Reset arrow */}
      <path d="M4 11.5a8 8 0 1 1 2.3 5.7" />
      <path d="M4 5.5v6h6" />

      {/* Clock hands */}
      <path d="M12 8v4l2.5 1.5" />
    </MapIcon>
  );
}
