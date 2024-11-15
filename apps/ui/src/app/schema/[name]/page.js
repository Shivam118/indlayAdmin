"use client";
import InputField from "@/components/InputField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdOutlineDataArray, MdOutlineTextFields } from "react-icons/md";
import { TbNumber123 } from "react-icons/tb";
import { HiMinusCircle } from "react-icons/hi2";
import { useParams } from "next/navigation";

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
  const { name } = useParams();
  const [schema, setSchema] = useState({});
  const [fields, setFields] = useState({});
  const [newField, setNewField] = useState({ name: "", type: "text" });

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
          `${process.env.NEXT_PUBLIC_API_URL}/schema?name=${name}`,
          config
        );
        if (res.status !== 200) {
          throw new Error("Failed to fetch fields");
        }
        setSchema(res.data || {});
      } catch (e) {
        console.error(e);
        toast.error("Failed to fetch fields");
      }
    })();
  }, []);

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
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/schema`,
        {
          name,
          schema: {
            ...fields,
          },
        },
        config
      );
      if (res.status !== 200) {
        throw new Error("Failed to save schema");
      }
      toast.success("Schema saved successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save schema");
    }
  };

  useEffect(() => {
    if (schema && schema?.extras)
      if (Object.keys(schema?.extras).length > 0) {
        setFields(schema.extras);
      }
  }, [schema]);

  const handleAddField = () => {
    if (newField.name.trim() === "") {
      alert("Field name cannot be empty!");
      return;
    }

    // Create a new field object with default value based on type
    const defaultValues = {
      text: "",
      number: 0,
      array: [],
      boolean: false,
    };

    setFields((prevFields) => ({
      ...prevFields,
      [newField.name]: defaultValues[newField.type],
    }));

    // Reset the input field
    setNewField({ name: "", type: "text" });
  };

  if (Object.keys(schema)?.length === 0)
    return (
      <div className="w-full h-[70vh] text-xl font-normal flex items-center justify-center">
        No Schema Listed under provided name
      </div>
    );

  return (
    <div className="flex items-center justify-center p-20">
      <div className="border border-borderIndlay max-w-[1200px] rounded-lg px-14 py-10">
        <h1 className="text-2xl font-medium text-ctaDarker capitalize">
          {name} Schema
        </h1>
        <br />
        <br />
        <div className="grid grid-cols-2 gap-5">
          {Object?.keys(schema)?.length > 0 &&
            Object?.keys(schema.schema)?.map((key, index) => (
              <InputField
                key={index}
                label={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                name={key}
                value={typeof schema.schema[key]}
                disabled={true}
                icon={getIcons(schema.schema[key])}
              />
            ))}
        </div>
        <hr className="my-5" />
        <div>
          <div className="flex gap-2 mb-4">
            <input
              value={newField.name}
              onChange={(e) =>
                setNewField({ ...newField, name: e.target.value })
              }
              placeholder="Enter Field Name"
              className="border border-gray-300 p-2 rounded-lg"
            />
            <select
              value={newField.type}
              onChange={(e) =>
                setNewField({ ...newField, type: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg"
            >
              <option value="text">String</option>
              <option value="number">Number</option>
              <option value="array">Array</option>
              <option value="boolean">Boolean</option>
            </select>
            <button
              onClick={handleAddField}
              className="bg-blue-500 text-white p-2 rounded-lg"
            >
              Add Field
            </button>
          </div>

          <div className="mt-4">
            <h3 className="font-bold">Added Fields:</h3>
            {Object.keys(fields).length > 0 ? (
              <ul className="list-disc pl-4">
                {Object.keys(fields)?.map((field, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="capitalize">
                      <strong>{field}</strong>&nbsp;&nbsp; (
                      {typeof fields[field]})
                    </span>
                    <span
                      className="mr-10 cursor-pointer text-red-400"
                      onClick={() => {
                        const { [field]: omit, ...rest } = fields;
                        setFields(rest);
                      }}
                    >
                      <HiMinusCircle />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No fields added yet.</p>
            )}
          </div>
        </div>
        <button
          className="bg-ctaDarker w-full text-white p-2 rounded-[70px] mt-5"
          onClick={handleSubmit}
        >
          Save Schema
        </button>
      </div>
    </div>
  );
};

export default Page;
