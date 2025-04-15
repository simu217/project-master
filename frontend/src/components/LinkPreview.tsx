import { useEffect, useState } from "react";
import axios from "axios";
import { ICrystal } from "./Dashboard";
import CrystalDropdown from "./CrystalDropdown";
import logo from "../assets/logo1.png";
const apiUrl = process.env.REACT_APP_API_URL;

interface LinkPreviewProps {
  hiveId: string;
  crystal: ICrystal;
  onReload: any;
}

interface IMeta {
  title: string;
  description: string;
  image?: string;
}

function LinkPreview({ hiveId, crystal, onReload }: LinkPreviewProps) {
  const token = localStorage.getItem("token");

  crystal.meta = crystal.meta || {
    title: "Unknown",
    description: "Unknown",
  };

  const deleteCrystal = async (crystalId: string) => {
    try {
      const res = await fetch(
        `${apiUrl}/api/hive/${hiveId}/crystals/${crystalId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const updated = await res.json();
        onReload();
        alert("Deleted successfully!");
      } else {
        if (res.status === 403) {
          alert("Not authorized to delete this crystal");
        }
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <>
      <div className="flex items-start gap-2.5">
        <svg
          className="w-8 h-8 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
        </svg>
        <div className="flex flex-col gap-1 w-full max-w-[320px]">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
              {crystal.addedBy?.username || "Unknown"}
            </span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {new Date(crystal.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
            <p className="text-sm font-normal pb-2.5 text-gray-900 dark:text-white">
              <a
                href={crystal.url}
                className="text-blue-700 dark:text-blue-500 underline hover:no-underline font-medium break-all"
              >
                {new URL(crystal.url).hostname}
              </a>
            </p>
            <a
              href={crystal.url}
              className="bg-gray-50 dark:bg-gray-600 rounded-xl p-4 mb-2 hover:bg-gray-200 dark:hover:bg-gray-500"
            >
              <img
                src={crystal.meta.image || logo}
                alt={crystal.meta.title}
                className="rounded-lg mb-2"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {crystal.meta.description}
              </span>
              <br />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                {crystal.meta.title}
              </span>
            </a>
          </div>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {/* Delivered */}
          </span>
        </div>
        <CrystalDropdown
          onDelete={() => deleteCrystal(crystal._id)}
          onView={() => window.open(crystal.url, "_blank")}
        />
      </div>
    </>
  );
}

export default LinkPreview;
