"use client";
import { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";


const labelInputStyle = "col-span-1";
const inputStyle =
  "text-sm bg-transparent w-full focus:outline-none text-[#000]";
const labelStyle =
  "font-medium text-sm text-black w-full text-left leading-[18px] pb-[18px]";
const inputGroupStyle =
  "rounded-[50px] p-4 h-[52px] border border-borderIndlay flex flex-row items-between justify-center gap-5 bg-white w-full";


 const icon = <MdAlternateEmail />
const InputField = ({
  label,
  name,
  type = "text",
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
          value={formData[name]}
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
      <div className="">
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
    title: "",
    description: "",
    price: "",
    propertyType: "apartment",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      coordinates: { lat: "", lng: "" },
    },
    size: "",
    bedrooms: "",
    bathrooms: "",
    yearBuilt: "",
    amenities: [],
    generalInfo: {
      listingType: "sale",
      status: "available",
      contact: { name: "", phone: "", email: "" },
    },
    images: [{ url: "", description: "" }],
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

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log(formData);

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
      } else {
        alert("Property added successfully!");
        setFormData({
          title: "",
          description: "",
          price: "",
          propertyType: "apartment",
          location: {
            address: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            coordinates: { lat: "", lng: "" },
          },
          size: "",
          bedrooms: "",
          bathrooms: "",
          yearBuilt: "",
          amenities: [],
          generalInfo: {
            listingType: "sale",
            status: "available",
            contact: { name: "", phone: "", email: "" },
          },
          images: [{ url: "", description: "" }],
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
    <div className="m-14 border-[#EDF0EF] border rounded-lg p-10">
      <h1 className="text-4xl">Add Property</h1>
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-10">
          <InputField
            label={"Title"}
            name={"title"}
            type="text"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
          <InputField
            label={"Price"}
            name={"price"}
            type="number"
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
          <div className={inputGroupStyle}>
          <SelectField
            label={"Property Type"}
            name={"propertyType"}
            error={errors}
            handleChange={handleChange}
            formData={formData}
            options={["apartment", "house", "villa", "condo", "studio"]}
            className={inputStyle}
          />
          </div>
          <InputField
            label={"Size (sqft)"}
            name={"size"}
            type="text"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
          <InputField
            label={"Bedrooms"}
            name={"bedrooms"}
            type="number"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
          <InputField
            label={"Bathrooms"}
            name={"bathrooms"}
            type="number"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
          <InputField
            label={"Year Built"}
            name={"yearBuilt"}
            type="number"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
          <div className={labelInputStyle}>
            <label className={labelStyle}>Listing Type:</label>
            <select
              name="generalInfo.listingType"
              value={formData.generalInfo.listingType}
              onChange={handleChange}
              className={inputGroupStyle}
            >
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          <div className={labelInputStyle}>
            <label className={labelStyle}>Status:</label>
            <select
              name="generalInfo.status"
              value={formData.generalInfo.status}
              onChange={handleChange}
              className={inputGroupStyle}
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
          {/* <div className="col-span-1 mb-4">
            <label className={labelStyle}>Amenities:</label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              className={inputGroupStyle}
              icon={icon}
              
            />
          </div> */}
          <InputField
            label={"Amenities"}
            name={"amenities"}
            type="text"
            error={errors}
            handleChange={handleChange}
            formData={formData}
            placeholder="Enter amenity IDs (comma separated)"
          />
        </div>

        <div>
          <h3>Location</h3>
          <hr className="my-3"></hr>
          <div className="grid grid-cols-2 gap-10">
            <div className={labelInputStyle}>
              {/* <label className={labelStyle}>Address:</label> */}
              {/* <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                className={inputGroupStyle}
              /> */}
               <InputField
            label={"Adddress"}
            name={"location.address"}
            type="text"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
              {errors.location && <span>{errors.location}</span>}
            </div>
            <div className={labelInputStyle}>
              {/* <label className={labelStyle}>City:</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className={inputGroupStyle}
              /> */}
              <InputField
            label={"City"}
            name={"location.city"}
            type="text"
            error={errors}
            handleChange={handleChange}
            formData={formData}
            />
            </div>
            <div className={labelInputStyle}>
              {/* <label className={labelStyle}>State:</label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                className={inputGroupStyle}
              /> */}
              <InputField
            label={"State"}
            name={"location.state"}
            type="text"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
            </div>
            <div className={labelInputStyle}>
              {/* <label className={labelStyle}>Country:</label>
              <input
                type="text"
                name="location.country"
                value={formData.location.country}
                onChange={handleChange}
                className={inputGroupStyle}
              /> */}
              <InputField
            label={"Country"}
            name={"location.country"}
            type="text"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />

            </div>
            <div className="col-span-1 mb-4">
              {/* <label className={labelStyle}>Postal Code:</label>
              <input
                type="text"
                name="location.postalCode"
                value={formData.location.postalCode}
                onChange={handleChange}
                className={inputGroupStyle}
              /> */}
              <InputField
            label={"Postal Code"}
            name={"location.postalCode"}
            type="text"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
            </div>
          </div>
        </div>

        <div>
          <h4>Coordinates</h4>
          <hr className="my-3"></hr>
          <div className="grid grid-cols-2 gap-10">
            <div className={labelInputStyle}>
              {/* <label className={labelStyle}>Latitude:</label>
              <input
                type="number"
                name="location.coordinates.lat"
                value={formData.location.coordinates.lat}
                onChange={handleChange}
                className={inputGroupStyle}
              /> */}
              <InputField
            label={"Latitude"}
            name={"location.coordinates.lat"}
            type="number"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
            </div>
            <div className="col-span-1 mb-4">
              {/* <label className={labelStyle}>Longitude:</label>
              <input
                type="number"
                name="location.coordinates.lng"
                value={formData.location.coordinates.lng}
                onChange={handleChange}
                className={inputGroupStyle}
              /> */}
              <InputField
            label={"Longitude"}
            name={"location.coordinates.lng"}
            type="number"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
            </div>
          </div>
        </div>
         
        <div>
        <h3>Contact Info</h3>
        <hr className="my-3"></hr>
        <div className="grid grid-cols-2 gap-10">
          <div className={labelInputStyle}>
           
            {/* <label className={labelStyle}>Name:</label>
            <input
              type="text"
              name="generalInfo.contact.name"
              value={formData.generalInfo.contact.name}
              onChange={handleChange}
              className={inputGroupStyle}
            /> */}
            <InputField
            label={"Name"}
            name={"generalInfo.contact.name"}
            type="text"
              
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
            </div>
            <div className={labelInputStyle}>
            {/* <label className={labelStyle}>Phone:</label>
            <input
              type="text"
              name="generalInfo.contact.phone"
              value={formData.generalInfo.contact.phone}
              onChange={handleChange}
              className={inputGroupStyle}
            /> */}
            <InputField
            label={"Phone"}
            name={"generalInfo.contact.phone"}
            type="text"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
            </div>
            <div className="col-span-1 mb-4">
            {/* <label className="font-medium text-sm text-black w-full text-left leading-[18px] mb-6">Email:</label>
            <input
              type="email"
              name="generalInfo.contact.email"
              value={formData.generalInfo.contact.email}
              onChange={handleChange}
              className={inputGroupStyle}
            /> */}
            <InputField
            label={"Email"}
            name={"generalInfo.contact.email"}
            type="email"
            error={errors}
            handleChange={handleChange}
            formData={formData}
          />
          </div>
        </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#074A6A] text-white font-medium py-2 rounded-md col-span-6"
        >
          {loading ? "Adding..." : "Add Property"}
        </button>
      </form>
      {errors.general && <div>{errors.general}</div>}
    </div>
  );
}
