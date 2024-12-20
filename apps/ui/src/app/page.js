"use client";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [token] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(null);

  if (!token) {
    window.location.href = "/login";
  }

  useEffect(() => {
    const decoded = jwtDecode(token);
    setRole(decoded.role);
  }, [token]);

  return (
    <div className="bg-bgIndlay w-full min-h-screen px-10 py-5">
      <div className="flex items-center justify-center h-full">
        <div className="grid grid-cols-4 gap-7 w-[800px]">
          <Link
            href="/property"
            className="col-span-2 row-span-2 w-full min-w-[200px] h-full min-h-[200px] bg-gradient-to-br from-[#E6E6FA] to-[#FADADD] rounded-[30px] text-2xl flex items-center justify-center"
          >
            Properties
          </Link>
          <Link
            href="/schema/property"
            className="col-span-1 row-span-1 w-full min-w-[200px] h-full min-h-[200px] bg-gradient-to-br from-[#E6E6FA] to-[#FADADD] rounded-[30px] text-2xl flex items-center justify-center"
          >
            Property Schema
          </Link>
          <Link
            href="/schema/service"
            className="col-span-1 row-span-1 w-full min-w-[200px] h-full min-h-[200px] bg-gradient-to-br from-[#E6E6FA] to-[#FADADD] rounded-[30px] text-2xl flex items-center justify-center"
          >
            Service Schema
          </Link>
          <Link
            href="/services"
            className="col-span-1 w-full min-w-[200px] h-full min-h-[200px] bg-gradient-to-br from-[#CCFFCC] to-[#B0E0E6] rounded-[30px] text-2xl flex items-center justify-center"
          >
            Services
          </Link>
          <Link
            href="/amenities"
            className="col-span-1 w-full min-w-[200px] h-full min-h-[200px] bg-gradient-to-br from-[#F7DAD9] to-[#DCC5E1] rounded-[30px] text-2xl flex items-center justify-center"
          >
            Amenities
          </Link>
          {role === "admin" && (
            <>
              <Link
                href="/requests"
                className="col-span-1 w-full min-w-[200px] h-full min-h-[200px] bg-gradient-to-br from-[#F7DAD9] to-[#DCC5E1] rounded-[30px] text-2xl flex items-center justify-center"
              >
                Pending Requests
              </Link>
              <Link
                href="/users"
                className="col-span-1 w-full min-w-[200px] h-full min-h-[200px] bg-gradient-to-br from-[#FFF8E1] to-[#E8D3C5] rounded-[30px] text-2xl flex items-center justify-center"
              >
                Users
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
