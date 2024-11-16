"use client";
import InputField from "@/components/InputField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdOutlineDataArray, MdOutlineTextFields } from "react-icons/md";
import { TbNumber123 } from "react-icons/tb";
import { CgAdd } from "react-icons/cg";

const Page = () => {
  const [schema, setSchema] = useState({});
  const [fields, setFields] = useState({});
  const [addService, setAddService] = useState(false);
  const [services, setServices] = useState([]);

  console.log(fields);

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
          `${process.env.NEXT_PUBLIC_API_URL}/schema?name=service`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/services`,
          config
        );
        if (res.status !== 200) {
          throw new Error("Failed to fetch fields");
        }
        setServices(res?.data || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to fetch Services");
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
            `${process.env.NEXT_PUBLIC_API_URL}/service/update`,
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
            throw new Error("Failed to update service");
          }
          toast.success("Service Updated successfully");
        } else {
          const { title, slug, mainImage, images, ...rest } = fields;
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/service/add`,
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
            throw new Error("Failed to add service");
          }
          toast.success("Service saved successfully");
        }
      }
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save service");
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
          Listed Services
        </h1>
        <div className="flex items-center justify-between flex-wrap gap-5">
          {addService ? (
            <div className="w-full grid grid-cols-3 gap-5">
              {Object?.keys(fields)?.length > 0 &&
                Object?.keys(fields)?.map((key, index) =>
                  key === "_id" || key === "images" || key === "mainImage" ? (
                    <></>
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
                  Save Service
                </button>
                <button
                  className="bg-red-500 w-full text-white p-2 rounded-[70px] mt-5 h-[56px] mb-20 col-span-1"
                  onClick={() => {
                    setAddService(!addService);
                    setFields(schema);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <span
              onClick={() => setAddService(!addService)}
              className="min-w-[300px] cursor-pointer min-h-[250px] h-full border border-borderIndlay rounded-[20px] text-4xl flex items-center justify-center shadow-md"
            >
              <CgAdd />
            </span>
          )}
          {services?.map((service, i) => (
            <div
              className="relative min-w-[300px] border border-borderIndlay rounded-[20px] overflow-hidden shadow-md"
              key={i}
              onClick={() => {
                setFields({
                  _id: service?._id,
                  title: service?.title,
                  images: service?.images,
                  mainImage: service?.mainImage,
                  ...service.details,
                });
                window.scrollTo(0, 0);
                setAddService(true);
              }}
            >
              {services?.details?.tags?.includes("best-seller") && (
                <span className="absolute top-3 left-4 text-sm bg-green-300 px-2 border border-green-800 rounded-xl">
                  BestSeller
                </span>
              )}
              <div className="h-[150px] w-full bg-black" />
              <div className="px-4 pb-5">
                <h3 className="text-base font-medium font-banana mt-3">
                  {service?.title}
                </h3>
                <h6 className="text-xs font-normal font-banana text-indlay mt-1">
                  {service?.details?.price}
                </h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
