
// Hand-built 12x12 sprite grid. 0 = transparent, everything else = a
// palette color. This is the mascot — no data dependency.
const FROG_PALETTE: Record<number, string> = {
  1: "#4CD07D", // leaf green body
  2: "#1B4332", // canopy outline
  3: "#FFFFFF", // eye white
  4: "#1B4332", // pupil
  5: "#FF9EC4", // cheek blush
};

const FROG_SPRITE: number[][] = [
  [0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0],
  [0, 2, 3, 3, 2, 2, 2, 2, 3, 3, 2, 0],
  [0, 2, 3, 4, 2, 1, 1, 2, 4, 3, 2, 0],
  [0, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 0],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 1, 5, 1, 1, 1, 1, 1, 1, 5, 1, 2],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
  [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
  [0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0],
  [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
];

interface PixelFrogProps {
  size?: number; // px per pixel-cell
}

export default function PixelFrog({ size = 6 }: PixelFrogProps) {
  return (
    <div
      className="animate-[frog-bob_2.4s_ease-in-out_infinite]"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(12, ${size}px)`,
        gridTemplateRows: `repeat(12, ${size}px)`,
      }}
    >
      {FROG_SPRITE.flat().map((cell, i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            backgroundColor: cell ? FROG_PALETTE[cell] : "transparent",
          }}
        />
      ))}
    </div>
  );
}