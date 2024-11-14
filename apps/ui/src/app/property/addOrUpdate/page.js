"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/utils";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";

export default function AddProperty() {
  const [formData, setFormData] = useState({
    title: "Title",
    description: "Desc",
    price: "123 CR",
    propertyType: "apartment",
    location: {
      address: "khdoa",
      city: "ghaziabd",
      state: "up",
      country: "india",
      postalCode: "201001",
      coordinates: { lat: "12", lng: "43" },
    },
    size: "2",
    bedrooms: "4",
    bathrooms: "5",
    yearBuilt: "2019",
    amenities: ["ABCD", "PCOD"],
    generalInfo: {
      listingType: "sale",
      status: "available",
      contact: { name: "shivam", phone: "935458784", email: "tex@gmail.cm" },
    },
    mainImage: "ads",
    images: [],
    isReadyForPublish: false,
  });

  const [schema, setSchema] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
            Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmZhMzc5YzVjODdjZGJiNGFlNGM0YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMTM0Njc0MCwiZXhwIjoxNzMxMzUwMzQwfQ.7QC_HqY6GH9ErBaQCLoeZqF4Lwk0rzDhkzH4096OTow`,
          },
        };
        const response = await axios.get(
          `${API_URL}/schema?name=property`,
          config
        );
        if (response.status !== 200) {
          console.error("An error occurred while fetching Fields.");
          return;
        }
        setSchema(response?.data?.schema);
      } catch (error) {
        console.error("An error occurred while fetching Fields.");
      }
    })();
  }, []);

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
      const response = await fetch("/properties", {
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
          mainImage: "",
          images: [],
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
      <h1 className="text-4xl">Add or Update Property</h1>
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

          <SelectField
            label={"Property Type"}
            name={"propertyType"}
            error={errors}
            handleChange={handleChange}
            formData={formData}
            options={["apartment", "house", "villa", "condo", "studio"]}
            className={inputStyle}
          />

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
          <SelectField
            label={"Listing Type"}
            name={"generalInfo.listingType"}
            error={errors}
            handleChange={handleChange}
            formData={formData}
            options={["sale", "rent"]}
            className={inputStyle}
          />
          <SelectField
            label={"Status"}
            name={"generalInfo.status"}
            error={errors}
            handleChange={handleChange}
            formData={formData}
            options={["available", "sold", "rented"]}
            className={inputStyle}
          />
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
        <br />
        <hr className="my-3"></hr>
        <div>
          <h3 className="text-base font-normal mb-10 underline">Location</h3>
          <div className="grid grid-cols-2 gap-10">
            <InputField
              label={"Adddress"}
              name={"address"}
              value={formData.location.address}
              type="text"
              error={errors}
              handleChange={handleChange}
              formData={formData}
            />
            <InputField
              label={"City"}
              name={"city"}
              value={formData.location.city}
              type="text"
              error={errors}
              handleChange={handleChange}
              formData={formData}
            />
            <InputField
              label={"State"}
              name={"state"}
              value={formData.location.state}
              type="text"
              error={errors}
              handleChange={handleChange}
              formData={formData}
            />
            <InputField
              label={"Country"}
              name={"country"}
              value={formData.location.country}
              type="text"
              error={errors}
              handleChange={handleChange}
              formData={formData}
            />
            <InputField
              label={"Postal Code"}
              name={"postalCode"}
              value={formData.location.postalCode}
              type="text"
              error={errors}
              handleChange={handleChange}
              formData={formData}
            />
          </div>
        </div>
        <br />
        <hr className="my-3" />
        <div>
          <h3 className="text-base font-normal mb-10 underline">Coordinates</h3>
          <div className="grid grid-cols-2 gap-10">
            <InputField
              label={"Latitude"}
              name={"lat"}
              value={formData.location.coordinates.lat}
              type="number"
              error={errors}
              handleChange={handleChange}
              formData={formData}
            />
            <InputField
              label={"Longitude"}
              name={"lng"}
              value={formData.location.coordinates.lat}
              type="number"
              error={errors}
              handleChange={handleChange}
              formData={formData}
            />
          </div>
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
          {loading ? "Adding..." : "Add Property"}
        </button>
      </form>
      {errors.general && <div>{errors.general}</div>}
    </div>
  );
}
