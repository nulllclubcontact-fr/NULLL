type MarqueeProps = {
  items: readonly string[];
  inverted?: boolean;
};

export function Marquee({ items, inverted = false }: MarqueeProps) {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      className={`overflow-hidden border-y-2 font-mono text-sm uppercase ${
        inverted ? "border-black bg-white text-black" : "border-white bg-black text-white"
      }`}
    >
      <div className="flex w-max animate-marquee items-center">
        {repeated.map((item, index) => (
          <span className="flex items-center whitespace-nowrap px-6 py-3" key={`${item}-${index}`}>
            <span className="mr-6 h-3 w-3 bg-rust" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
