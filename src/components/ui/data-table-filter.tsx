import * as React from "react";

interface DataTableFilterProps {
  options: string[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function DataTableFilter({
  options,
  placeholder = "Filter",
  onChange,
}: DataTableFilterProps) {
  const [selected, setSelected] = React.useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (onChange) onChange(value);
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      className="block w-full px-3 py-2 border rounded-md text-sm"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
