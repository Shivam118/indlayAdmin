"use client";
import InputField from "@/components/InputField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdOutlineDataArray, MdOutlineTextFields } from "react-icons/md";
import { TbNumber123 } from "react-icons/tb";

const RenderFormFields = ({ data, handleChange, parentKey = "" }) => {
  return Object.keys(data).map((key) => {
    const value = data[key];
    const fieldName = parentKey ? `${parentKey}.${key}` : key;
    const isObject = typeof value === "object" && !Array.isArray(value);
    const isArray = Array.isArray(value);
    const isNumber = typeof value === "number" || typeof value === Number;

    return isObject ? (
      <>
        <div className="font-bold text-lg mt-4 mb-2 capitalize col-span-2">
          {key}
        </div>
        {/* Recursive call for nested objects */}
        <RenderFormFields
          data={value}
          handleChange={handleChange}
          parentKey={fieldName}
        />
      </>
    ) : isArray ? (
      // Render fields for each item in arrays
      value?.map((item, index) => (
        <InputField
          key={`${fieldName}-${index}`}
          label={`${key} Items`}
          name={`${fieldName}[${index}]`}
          type="text"
          value={item}
          handleChange={handleChange}
        />
      ))
    ) : isNumber ? (
      // Render InputField for primitive values
      <InputField
        label={key.charAt(0).toUpperCase() + key.slice(1)}
        name={fieldName}
        value={typeof value}
        disabled={true}
        icon={<TbNumber123 />}
        handleChange={handleChange}
      />
    ) : (
      <InputField
        label={key.charAt(0).toUpperCase() + key.slice(1)}
        name={fieldName}
        value={typeof value}
        disabled={true}
        icon={<MdOutlineTextFields />}
        handleChange={handleChange}
      />
    );
  });
};

const Page = () => {
  const [schema, setSchema] = useState({});

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
        setSchema(res.data);
      } catch (e) {
        console.error(e);
        toast.error("Failed to fetch fields");
      }
    })();
  }, []);

  console.log(schema);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Helper function to update nested values
    const setNestedValue = (obj, path, value) => {
      const keys = path.split(".");
      const lastKey = keys.pop();
      const nestedObj = keys.reduce((o, key) => (o[key] = o[key] || {}), obj);
      nestedObj[lastKey] = value;
    };

    setFormData((prevData) => {
      const newData = { ...prevData };
      setNestedValue(newData, name, value);
      return newData;
    });
  };

  const getIcons = (value) => {
    if (typeof value === "number" || typeof value === Number) {
      return <TbNumber123 />;
    } else if (typeof value === "object" || typeof value === Object) {
      return <MdOutlineDataArray />;
    } else {
      return <MdOutlineTextFields />;
    }
  };

  const handleSubmit = async () => {};

  return (
    <div className="flex items-center justify-center p-20">
      <div className="border border-borderIndlay max-w-[1200px] rounded-lg px-14 py-10">
        <h1 className="text-2xl font-medium text-ctaDarker">Property Schema</h1>
        <br />
        <br />
        <div className="grid grid-cols-2 gap-5">
          {Object?.keys(schema)?.length > 0 &&
            Object?.keys(schema.schema)?.map((key) => (
              <InputField
                label={key}
                name={key}
                value={typeof schema.schema[key]}
                disabled={true}
                icon={getIcons(schema.schema[key])}
              />
            ))}
        </div>
        <hr className="my-5" />
        <div className="">
          <input
            placeholder="Enter Field Name"
            className="border border-borderIndlay p-2 rounded-lg"
          />
          <select>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="array">Array</option>
            <option value="boolean">Boolean</option>
          </select>
        </div>
        <button
          className="bg-ctaDarker w-full text-white p-2 rounded-[70px] mt-5"
          onChange={handleSubmit}
        >
          Save Schema
        </button>
      </div>
    </div>
  );
};

export default Page;
