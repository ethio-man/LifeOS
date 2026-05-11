interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function MultiSelect({ options, selected, onChange }: MultiSelectProps) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 bg-bg-3 border border-white/10 rounded-r p-2 min-h-[42px]">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-2.5 py-1 rounded-full text-[11.5px] font-medium border transition-all duration-100 cursor-pointer ${
              isSelected
                ? 'bg-accent/20 border-accent text-accent-2'
                : 'bg-transparent border-white/10 text-text-3 hover:border-text-3 hover:text-text-2'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
