"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [role, setRole] = useState(null);
  const [services, setServices] = useState([]);
  const [properties, setProperties] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
    const decoded = jwtDecode(token);
    setRole(decoded.role);
  }, []);

  useEffect(() => {
    if (role && role !== "admin") {
      window.location.href = "/";
    }
  }, [role]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/service/nonPublished`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const services = response.data;
        setServices(services);
      } catch (error) {
        console.error(error);
      }
    })();
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/property/nonPublished`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProperties(response.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleSubmit = async ({ name, id }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${name}/publish`,
        { id },
        config
      );
      if (response.status !== 200) {
        throw new Error("Failed to publish");
      }
      if (name === "service") {
        setServices((prev) => prev.filter((service) => service._id !== id));
      } else {
        setProperties((prev) => prev.filter((property) => property._id !== id));
      }
      toast.success(`${name} published successfully`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-bold text-cta py-4">Requests</h1>
      <div className="w-5/6  mx-auto border border-borderIndlay rounded-[20px] py-5 px-10">
        <h2 className="text-ctaDarker text-xl font-medium pb-4">Properties</h2>
        <ul className="grid-cols-3 grid gap-5">
          {properties.map((property) => (
            <li
              key={property._id}
              className="border border-borderIndlay rounded-2xl p-5"
            >
              <h3 className="py-2">{property.title}</h3>
              <p className="text-sm pb-2">{property.details.description}</p>
              <button
                onClick={() =>
                  handleSubmit({ name: "property", id: property._id })
                }
                className="bg-cta text-white px-4 py-1 text-sm rounded-md"
              >
                Publish
              </button>
            </li>
          ))}
        </ul>
      </div>
      <br />
      <br />
      <div className="w-5/6  mx-auto border border-borderIndlay rounded-[20px] py-5 px-10">
        <h2 className="text-ctaDarker text-xl font-medium pb-4">Services</h2>
        <ul className="grid-cols-3 grid gap-5">
          {services.map((service) => (
            <li
              key={service._id}
              className="border border-borderIndlay rounded-2xl p-5"
            >
              <h3 className="py-2">{service.title}</h3>
              <p className="text-sm pb-2">{service.details.description}</p>
              <button
                onClick={() =>
                  handleSubmit({ name: "property", id: property._id })
                }
                className="bg-cta text-white px-4 py-1 text-sm rounded-md"
              >
                Publish
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
