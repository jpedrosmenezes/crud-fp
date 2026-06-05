import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: "#16a34a",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 4,3 L 18,3 L 18,8 L 9,8 L 9,11 L 14,11 L 14,15 L 9,15 L 9,21 L 4,21 Z" />
      </svg>
    </div>,
    { ...size },
  );
}
