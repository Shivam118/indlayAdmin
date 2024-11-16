const inputStyle =
  "text-sm bg-transparent w-full focus:outline-none text-[#000]";
const labelStyle =
  "font-medium text-sm text-black w-full text-left leading-[18px] pb-[18px]";
const inputGroupStyle =
  "rounded-[50px] p-4 h-[52px] border border-borderIndlay flex flex-row items-between justify-center gap-5 bg-white w-full";

export default function SelectField({
  label,
  name,
  type = "text",
  error,
  handleChange,
  formData,
  options,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full col-span-1`}
    >
      <label htmlFor={name} className={labelStyle}>
        {label}:
      </label>
      <div className={inputGroupStyle}>
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={inputStyle}
        >
          {options.map((val, index) => (
            <option value={val} key={index} className="capitalize">
              {val}
            </option>
          ))}
        </select>
        {error && error[name] && <span>{error[name]}</span>}
      </div>
    </div>
  );
}
