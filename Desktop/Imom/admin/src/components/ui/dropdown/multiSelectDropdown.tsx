import { useState, useRef, useEffect } from "react";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  placeholder?: string;
}

export default function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select items",
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const isSelected = (option: Option) =>
    value.some((item) => item.value === option.value);

  const handleSelect = (option: Option) => {
    if (isSelected(option)) {
      onChange(value.filter((item) => item.value !== option.value));
    } else {
      onChange([...value, option]);
    }
  };

  const removeChip = (val: string) => {
    onChange(value.filter((item) => item.value !== val));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>

      {/* Input */}
      <div
        onClick={toggleDropdown}
        className="min-h-10 flex flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 cursor-pointer dark:border-gray-700 dark:bg-gray-900"
      >
        {value.length === 0 && (
          <span className="text-gray-400">{placeholder}</span>
        )}

        {value.map((item) => (
          <div
            key={item.value}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-brand-500 text-white rounded-full"
          >
            {item.label}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeChip(item.value);
              }}
              className="ml-1 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isSelected(option) ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}