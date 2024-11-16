"use client";
import InputField from "@/components/InputField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdOutlineDataArray, MdOutlineTextFields } from "react-icons/md";
import { TbNumber123 } from "react-icons/tb";
import { HiMinusCircle } from "react-icons/hi2";
import { useParams } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import { CgAdd } from "react-icons/cg";
import SelectField from "@/components/SelectField";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";

const Page = () => {
  const [schema, setSchema] = useState({});
  const [fields, setFields] = useState({});
  const [addProperty, setAddProperty] = useState(false);
  const [properties, setProperties] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    (async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/schema?name=property`,
          config
        );
        if (res.status !== 200) {
          throw new Error("Failed to fetch fields");
        }
        setSchema({ ...res?.data?.schema, ...res?.data?.extras } || {});
      } catch (e) {
        console.error(e);
        toast.error("Failed to fetch fields");
      }
    })();
    (async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/amenities/all`,
          config
        );
        if (res.status !== 200) {
          throw new Error("Failed to fetch Amenities");
        }
        setAmenities(res?.data || {});
      } catch (e) {
        console.error(e);
        toast.error("Failed to fetch Amenities");
      }
    })();
    (async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/properties`,
          config
        );
        if (res.status !== 200) {
          throw new Error("Failed to fetch fields");
        }
        setProperties(res?.data || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to fetch Properties");
      }
    })();
  }, []);

  useEffect(() => {
    if (Object.keys(schema).length > 0) {
      setFields(schema);
    }
  }, [schema]);

  const getIcons = (value) => {
    if (typeof value === "number" || typeof value === Number) {
      return <TbNumber123 />;
    } else if (typeof value === "object" || typeof value === Object) {
      return <MdOutlineDataArray />;
    } else {
      return <MdOutlineTextFields />;
    }
  };

  const handleSubmit = async () => {
    try {
      if (Object.keys(fields).length !== 0) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        if (fields?.hasOwnProperty("_id") && fields?._id !== "") {
          const { _id, title, slug, mainImage, images, ...rest } = fields;
          const res = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/property/update`,
            {
              id: _id,
              title,
              slug,
              details: rest,
              mainImage: "google.mainImage.com",
              images: "google.images.com",
            },
            config
          );
          if (res.status !== 200) {
            throw new Error("Failed to save property");
          }
          toast.success("Property saved successfully");
        } else {
          const { title, slug, mainImage, images, ...rest } = fields;
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/property/add`,
            {
              title,
              slug,
              details: rest,
              mainImage: "google.mainImage.com",
              images: "google.images.com",
            },
            config
          );
          if (res.status !== 201) {
            throw new Error("Failed to save property");
          }
          toast.success("Property saved successfully");
        }
      }
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save property");
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    console.log(e);
    if (e.target.name === "id") return;
    else if (e.target.name === "tags") {
      const tags = e.target.value.split(",");
      setFields((prev) => ({ ...prev, tags }));
    } else {
      setFields((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSelect = (amenity) => {
    const existing = fields?.amenities;
    if (existing?.includes(amenity)) {
      setFields((prev) => ({
        ...prev,
        amenities: existing.filter((a) => a !== amenity),
      }));
    } else {
      setFields((prev) => ({
        ...prev,
        amenities: [...existing, amenity],
      }));
    }
  };

  if (Object.keys(fields)?.length === 0)
    return (
      <div className="w-full h-[70vh] text-xl font-normal flex items-center justify-center">
        Please Provide Schema for provided name
      </div>
    );

  return (
    <div className="flex items-center justify-center p-20 scroll-smooth">
      <div className="border border-borderIndlay max-w-[1200px] rounded-lg px-14 py-10">
        <h1 className="font-youth font-medium text-[32px] text-center mb-10">
          Listed Properties
        </h1>
        <div className="flex items-center justify-between flex-wrap gap-5">
          {addProperty ? (
            <div className="w-full grid grid-cols-3 gap-5">
              {Object?.keys(fields)?.length > 0 &&
                Object?.keys(fields)?.map((key, index) =>
                  key === "_id" || key === "images" || key === "mainImage" ? (<></>) : 
                  key === "amenities" ? (
                    <div
                      className="flex flex-col items-center justify-center w-full col-span-1 relative"
                      key={index}
                    >
                      <label className="font-medium text-sm text-black w-full text-left leading-[18px] pb-[18px] capitalize">
                        Amenities :
                      </label>
                      <div
                        onClick={toggleDropdown}
                        onBlur={() => setIsOpen(false)}
                        className="rounded-[50px] relative p-4 h-[52px] border border-borderIndlay flex flex-row items-center gap-5 bg-white w-full truncate cursor-pointer"
                      >
                        <span className="text-sm bg-transparent capitalize w-full focus:outline-none text-[#000]">
                          {fields?.amenities?.length > 0
                            ? amenities
                                .filter((a) =>
                                  fields?.amenities?.includes(a?._id)
                                )
                                .map((a) => a?.name)
                                .join(", ")
                            : "Select amenities"}
                        </span>
                        <div className="absolute right-5 cursor-pointer">
                          {isOpen ? <BiUpArrow /> : <BiDownArrow />}
                        </div>
                      </div>
                      {isOpen && (
                        <div className="absolute top-24 z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                          {amenities.map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                id={amenity?._id}
                                checked={fields?.amenities?.includes(
                                  amenity?._id
                                )}
                                onChange={() => handleSelect(amenity?._id)}
                                className="form-checkbox h-4 w-4 text-blue-600"
                              />
                              <label
                                className="ml-2 text-sm text-gray-700"
                                htmlFor={amenity?._id}
                              >
                                {amenity?.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <InputField
                      key={index}
                      label={key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      name={key}
                      value={fields[key]}
                      icon={getIcons(fields[key])}
                      handleChange={handleChange}
                    />
                  )
                )}
              <div className="col-span-3 grid grid-cols-3 gap-5">
                <button
                  className="bg-ctaDarker w-full text-white p-2 rounded-[70px] mt-5 h-[56px] mb-20 col-span-2"
                  onClick={handleSubmit}
                >
                  Save Property
                </button>
                <button
                  className="bg-red-500 w-full text-white p-2 rounded-[70px] mt-5 h-[56px] mb-20 col-span-1"
                  onClick={() => {
                    setAddProperty(!addProperty);
                    setFields(schema);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <span
              onClick={() => setAddProperty(!addProperty)}
              className="min-w-[300px] cursor-pointer min-h-[250px] h-full border border-borderIndlay rounded-[20px] text-4xl flex items-center justify-center shadow-md"
            >
              <CgAdd />
            </span>
          )}
          {properties?.map((property, i) => (
            <div
              className="relative min-w-[300px] border border-borderIndlay rounded-[20px] overflow-hidden shadow-md"
              key={i}
              onClick={() => {
                setFields({
                  _id: property?._id,
                  title: property?.title,
                  amenities: property?.amenities?.map((a) => a?._id),
                  images: property?.images,
                  mainImage: property?.mainImage,
                  ...property.details,
                });
                window.scrollTo(0, 0);
                setAddProperty(true);
              }}
            >
              {properties?.details?.tags?.includes("best-seller") && (
                <span className="absolute top-3 left-4 text-sm bg-green-300 px-2 border border-green-800 rounded-xl">
                  BestSeller
                </span>
              )}
              <div className="h-[150px] w-full bg-black" />
              <div className="px-4 pb-5">
                <h3 className="text-base font-medium font-banana mt-3">
                  {property?.title}
                </h3>
                <h6 className="text-xs font-normal font-banana text-indlay mt-1">
                  {property?.details?.price}
                </h6>
                <div className="grid grid-cols-2 gap-5 mt-4">
                  {property.amenities?.slice(0, 4).map((amenity, i) => (
                    <span
                      span
                      className="text-indlay text-xs font-normal font-banana"
                      key={i}
                    >
                      {amenity?.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
