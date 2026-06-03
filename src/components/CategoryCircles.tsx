interface Props {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

const EMOJI: Record<string, string> = {
  "cuidado de la piel": "🧴",
  maquillaje: "💄",
  perfumes: "🌸",
  "cuidado del cabello": "🧖",
  uñas: "💅",
  herramientas: "🪮",
  ofertas: "🏷️",
};

function emojiFor(name: string): string {
  return EMOJI[name.toLowerCase()] ?? "✨";
}

/** Fila de categorías en círculos (estilo portada). Cada círculo filtra por categoría. */
export function CategoryCircles({ categories, selected, onSelect }: Props) {
  if (categories.length === 0) return null;

  return (
    <div className="flex gap-6 overflow-x-auto pb-2">
      {categories.map((name) => {
        const active = selected === name;
        return (
          <button
            key={name}
            onClick={() => onSelect(active ? "" : name)}
            className="flex shrink-0 flex-col items-center gap-2"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl transition ${
                active
                  ? "bg-pink-600 ring-2 ring-pink-300"
                  : "bg-pink-100 hover:bg-pink-200"
              }`}
            >
              {emojiFor(name)}
            </span>
            <span
              className={`max-w-20 text-center text-xs ${
                active ? "font-semibold text-pink-600" : "text-slate-600"
              }`}
            >
              {name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
