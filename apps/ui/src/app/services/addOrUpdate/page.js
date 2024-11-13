"use client";
import { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";

const inputStyle =
  "text-sm bg-transparent w-full focus:outline-none text-[#000]";
const labelStyle =
  "font-medium text-sm text-black w-full text-left leading-[18px] pb-[18px]";
const inputGroupStyle =
  "rounded-[50px] p-4 h-[52px] border border-borderIndlay flex flex-row items-between justify-center gap-5 bg-white w-full";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  error,
  handleChange,
  formData,
  colSpan = 1,
  icon = <MdAlternateEmail />,
}) => {
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
          value={value ? value : formData[name]}
          onChange={handleChange}
          className={inputStyle}
        />
        {error[name] && <span>{error[name]}</span>}
      </div>
    </div>
  );
};

const SelectField = ({
  label,
  name,
  type = "text",
  error,
  handleChange,
  formData,
  options,
}) => {
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
        {error[name] && <span>{error[name]}</span>}
      </div>
    </div>
  );
};

export default function AddProperty() {
  const [formData, setFormData] = useState({
    name: "Title",
    description: "Desc",
    image: "",
    price: "123 CR",
    generalInfo: {
      listingType: "sale",
      status: "available",
      contact: { name: "shivam", phone: "935458784", email: "tex@gmail.cm" },
    },
    listedBy: "123",
    isReadyForPublish: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name.includes(".")) {
        const [field, subField] = name.split(".");
        return {
          ...prevData,
          [field]: {
            ...prevData[field],
            [subField]: value,
          },
        };
      }
      return { ...prevData, [name]: value };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors
    console.log(formData);
    return;
    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
      } else {
        alert("Property added successfully!");
        setFormData({
          name: "",
          description: "",
          image: "",
          price: "",
          generalInfo: {
            listingType: "sale",
            status: "available",
            contact: { name: "", phone: "", email: "" },
          },
          listedBy: "123",
          isReadyForPublish: false,
        });
      }
    } catch (error) {
      setErrors({ general: "An error occurred while adding the property." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto my-14 border-[#EDF0EF] border rounded-lg p-10">
      <h1 className="text-4xl">Add or Update Service</h1>
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-10">
          <InputField
            label={"Name"}
            name={"name"}
            type="text"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
          <InputField
            label={"Price"}
            name={"price"}
            type="text"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
          <InputField
            label={"Description"}
            name={"description"}
            type="text"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
        </div>
        <br />
        <hr className="my-3" />
        <div>
          <h3 className="text-base font-normal mb-10 underline">
            Contact Info
          </h3>
          <div className="grid grid-cols-2 gap-10">
            <InputField
              label={"Name"}
              name={"name"}
              value={formData.generalInfo.contact.name}
              type="text"
              error={errors}
              handleChange={handleChange}
              formData={formData}
            />
            <InputField
              label={"Phone"}
              name={"phone"}
              value={formData.generalInfo.contact.phone}
              type="text"
              error={errors}
              handleChange={handleChange}
              formData={formData}
            />
            <InputField
              label={"Email"}
              name={"email"}
              value={formData.generalInfo.contact.email}
              type="email"
              error={errors}
              handleChange={handleChange}
              formData={formData}
            />
          </div>
        </div>
        <br />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#074A6A] text-white font-medium py-2 rounded-[70px] col-span-6 h-[56px]"
        >
          {loading ? "Adding..." : "Add Service"}
        </button>
      </form>
      {errors.general && <div>{errors.general}</div>}
    </div>
  );
}
