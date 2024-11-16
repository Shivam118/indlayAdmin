"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdAlternateEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { BiSolidLockAlt } from "react-icons/bi";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import SelectField from "@/components/SelectField";

const inputStyle =
  "text-sm bg-transparent w-full focus:outline-none text-[#000]";
const labelStyle =
  "font-medium text-sm text-black w-full text-left leading-[18px] pb-[18px]";
const inputGroupStyle =
  "rounded-[50px] p-4 h-[52px] border border-borderIndlay flex flex-row items-between justify-center gap-5 bg-white w-full";

const InputField = ({ label, id, type = "text", onChange, colSpan, icon }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full col-span-${colSpan}`}
    >
      <label htmlFor={id} className={labelStyle}>
        {label}:
      </label>
      <div className={inputGroupStyle}>
        <span className="text-indlay">{icon}</span>
        <input
          name={id}
          id={id}
          type={type}
          placeholder={`Enter ${label}`}
          className={inputStyle}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default function Page() {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [role, setRole] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (
        !firstName ||
        !lastName ||
        !phoneNumber ||
        !email ||
        !password ||
        !role
      ) {
        toast.error("Please fill in all fields");
        return;
      }
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
        {
          firstName: firstName?.toLowerCase(),
          lastName: lastName?.toLowerCase(),
          phoneNumber,
          email: email?.toLowerCase(),
          password,
          role,
        }
      );
      if (res.status === 200) {
        toast.success("Registration successful");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Registration failed:" + error.message);
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="bg-bgIndlay w-full min-h-screen px-10 py-5 ">
      <div className="w-4/6 mx-auto flex flex-col items-center justify-center">
        <h2 className="font-youth font-medium text-[32px] text-center">
          Add User
        </h2>
        <form
          onSubmit={handleRegister}
          className="grid grid-cols-2 gap-5 w-full my-14"
        >
          <InputField
            label={"First name"}
            id="first-name"
            onChange={(e) => setFirstName(e.target.value)}
            colSpan={1}
            icon={<CgProfile />}
          />
          <InputField
            label={"Last name"}
            id="last-name"
            onChange={(e) => setLastName(e.target.value)}
            colSpan={1}
            icon={<CgProfile />}
          />
          <InputField
            label={"Phone Number"}
            id="phone-number"
            onChange={(e) => setPhoneNumber(e.target.value)}
            colSpan={1}
            icon={<FiPhone />}
          />
          <InputField
            label={"Email"}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            colSpan={1}
            icon={<MdAlternateEmail />}
          />
          <InputField
            label={"Password"}
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            colSpan={1}
            icon={<BiSolidLockAlt />}
          />
          <SelectField
            label="Role"
            id="role"
            colSpan={1}
            options={["admin", "employee"]}
            handleChange={(e) => setRole(e.target.value)}
            formData={{ role }}
          />
          <br />
          <button
            type="submit"
            className="flex items-center justify-center bg-ctaDarker border border-ctaDarker rounded-[70px] text-white font-banana font-medium h-[56px] w-full col-span-2"
          >
            Add User&nbsp;&nbsp;&nbsp;
            <FaArrowRightLong />
          </button>
        </form>
      </div>
      <div className="">

      </div>
    </div>
  );
}
