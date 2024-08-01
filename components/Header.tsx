"use client";
import AuthButton from "./auth/AuthButton";

export default function Header() {
  return (
    <div className="jheader ">
      <div className="animate-in jcontainer flex items-center text-white">
        <h1> BrewTriv </h1>
        <AuthButton />
      </div>
    </div>
  );
}
