"use client";

export function appendSearchChip(currentValue: string, chipLabel: string) {
  const current = currentValue.trim();
  const chip = chipLabel.trim();

  if (!chip) return currentValue;
  if (!current) return chip;

  const tokens = current
    .split(/\s+/)
    .map((item) => item.toLowerCase());
  const chipTokens = chip.split(/\s+/).map((item) => item.toLowerCase());
  const alreadyIncluded = chipTokens.every((token) => tokens.includes(token));

  return alreadyIncluded ? current : `${current} ${chip}`;
}

export default function PropertySearchChips({
  chips,
  onSelect,
  className = "",
  chipClassName = "",
}: {
  chips: string[];
  onSelect: (label: string) => void;
  className?: string;
  chipClassName?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {chips.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect(label)}
          className={
            chipClassName ||
            "inline-flex h-9 items-center rounded-full border border-zinc-300 bg-white px-4 text-xs text-zinc-700 shadow-sm transition-colors hover:border-purple-400 hover:text-zinc-950 dark:border-white/25 dark:bg-[#0f0f0f] dark:text-white/75 dark:shadow-none dark:hover:border-purple-400 dark:hover:text-white"
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
