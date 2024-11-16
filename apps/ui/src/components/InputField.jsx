import { MdAlternateEmail } from "react-icons/md";

const inputStyle =
  "text-sm bg-transparent w-full focus:outline-none text-[#000]";
const labelStyle =
  "font-medium text-sm text-black w-full text-left leading-[18px] pb-[18px] capitalize";
const inputGroupStyle =
  "rounded-[50px] p-4 h-[52px] border border-borderIndlay flex flex-row items-between justify-center gap-5 bg-white w-full";

export default function InputField({
  label,
  name,
  type = "text",
  value,
  error = "",
  handleChange = () => {},
  formData = {},
  colSpan = 1,
  icon = <MdAlternateEmail />,
  disabled = false,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full col-span-${colSpan}`}
    >
      <label htmlFor={name} className={labelStyle}>
        {label}:
      </label>
      <div className={inputGroupStyle}>
        <span className="text-indlay">{icon}</span>
        <input
          type={type}
          name={name}
          id={name}
          disabled={disabled}
          value={value ? value : formData[name]}
          onChange={handleChange}
          className={inputStyle}
        />
        {error[name] && <span>{error[name]}</span>}
      </div>
    </div>
  );
}
