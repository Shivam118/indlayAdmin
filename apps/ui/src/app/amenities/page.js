"use client";
import InputField from "@/components/InputField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdAddCircleOutline, MdCancel } from "react-icons/md";
import { toast } from "react-toastify";

const Page = () => {
  const initialValues = {
    id: "",
    iconUrl: "",
    name: "",
    description: "",
  };
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [addAmenity, setAddAmenity] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/amenities/all`
        );
        if (response.data) {
          setAmenities(response.data);
        } else {
          throw new Error("Failed to fetch amenities");
        }
      } catch (error) {
        console.error("Error adding amenity:", error);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (!formData.id) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/amenity/add`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data) {
          setFormData(initialValues);
          setAmenities([...amenities, response.data]);
          toast.success("Amenity added successfully");
          location.reload();
        } else {
          throw new Error("Failed to add amenity");
        }
      } else {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/amenity/update?id=${formData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data) {
          setFormData(initialValues);
          setAmenities(
            amenities.map((amenity) =>
              amenity._id === response.data._id ? response.data : amenity
            )
          );
          toast.success("Amenity updated successfully");
          location.reload();
        } else {
          throw new Error("Failed to update amenity");
        }
      }
    } catch (error) {
      console.error("Error adding amenity:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bgIndlay min-h-[90vh]">
      <div className="mx-auto w-4/6 p-5 grid grid-cols-2 gap-5">
        <form
          className={`relative w-full h-full p-8 rounded-xl shadow-md mx-auto border-borderIndlay bg-white ${
            addAmenity ? "col-span-2" : "col-span-1"
            }`}
          onSubmit={handleSubmit}
        >
          {addAmenity ? (
            <div className="col-span-2 grid grid-cols-2 gap-5">
              <span
                className="absolute top-5 right-5 text-xl text-cta cursor-pointer transition"
                onClick={() => {
                  setAddAmenity(false);
                  setFormData(initialValues);
                }}
              >
                <MdCancel />
              </span>
              <h1 className="text-2xl font-medium text-ctaDarker col-span-2">
                Add Amenity
              </h1>
              <InputField
                label={"Icon URL"}
                name={"iconUrl"}
                type="text"
                error={errors}
                handleChange={handleChange}
                formData={formData}
              />
              <InputField
                label={"Name"}
                name={"name"}
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#074A6A] text-white font-medium py-2 rounded-[70px] col-span-2 h-[56px]"
              >
                {loading ? "Adding..." : "Add Amenity"}
              </button>
            </div>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center transition cursor-pointer text-2xl"
              onClick={() => setAddAmenity(true)}
            >
              <MdAddCircleOutline />
            </div>
          )}
        </form>
        {amenities?.map((amenity, index) => (
          <div
            key={index}
            className="flex items-center justify-between border border-borderIndlay rounded-[20px] p-5"
          >
            <div className="flex items-center gap-5">
              <img
                src={amenity.iconUrl}
                alt={amenity.name}
                className="w-[50px] h-[50px] object-cover rounded-lg"
              />
              <div>
                <h2 className="text-lg font-medium text-ctaDarker">
                  {amenity.name}
                </h2>
                <p className="text-sm text-ctaLight">{amenity.description}</p>
              </div>
            </div>
            <button
              className="text-white bg-[#074A6A] px-4 py-2 rounded-[20px]"
              onClick={() => {
                setFormData({
                  id: amenity._id,
                  iconUrl: amenity.iconUrl,
                  name: amenity.name,
                  description: amenity.description,
                });
                setAddAmenity(true);
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
