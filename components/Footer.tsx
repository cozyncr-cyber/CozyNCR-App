"use dom";
import "../src/global.css";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";

const Footer = () => {
  return (
    <div className="flex bg-slate-100 justify-between px-4 md:px-8 py-4 rounded-t-md text-sm">
      <div className="flex gap-2">
        <p className="text-slate-600">&copy; 2025 Cozy NCR</p>
        <p className="text-slate-600">Privacy</p>
        <p className="text-slate-600">Terms</p>
        <p className="text-slate-600">Company Details</p>
      </div>

      <div className="flex gap-4 ">
        <Entypo name="instagram" size={20} color="gray" />
        <div className="text-slate-600">
          <Feather name="mail" size={20} color="gray" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
