export default function StrengthMeter({ value }: { value: number }) {
  const items = [0, 1, 2, 3];
  return (
    <div className="mt-2 flex gap-1">
      {items.map((i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded ${i < value ? "bg-pink-500" : "bg-white/15"}`}
        />
      ))}
    </div>
  );
}
