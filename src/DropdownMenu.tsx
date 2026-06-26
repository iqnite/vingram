import { useState } from "react";

export default function DropdownMenu({
  title,
  options,
}: {
  title: string;
  options: { name: string; callback: () => void }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="drawing-control-section">
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li key={option.name}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  option.callback();
                }}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
