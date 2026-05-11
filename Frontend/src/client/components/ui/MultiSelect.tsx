export default function MultiSelect({ options }: { options: string[] }) {
  return (
    <select multiple>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
