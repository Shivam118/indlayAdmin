"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [role, setRole] = useState(null);
  const [services, setServices] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
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

  return (
    <div>
      <h1>Requests</h1>
      <div>
        <h2>Properties</h2>
        <ul>
          {properties.map((property) => (
            <li key={property._id}>
              <h3>{property.title}</h3>
              <p>{property.details.description}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Services</h2>
        <ul>
          {services.map((service) => (
            <li key={service._id}>
              <h3>{service.title}</h3>
              <p>{service.details.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
