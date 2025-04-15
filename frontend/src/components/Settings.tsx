import { useEffect, useState } from "react";
import LayoutWrapper from "../components/LayoutWrapper";
import { IUser } from "./UserDropdown";
const apiUrl = process.env.REACT_APP_API_URL;

function Settings() {
  const [user, setUser] = useState<IUser>({
    username: "",
    name: "",
    email: "",
    phone: "",
    gender: "Other",
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/member`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/member`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        alert("✅ Profile updated successfully!");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to save changes.");
    }
  };

  const handleChange = (field: keyof IUser) => (e: any) =>
    setUser({ ...user, [field]: e.target.value });

  return (
    <LayoutWrapper>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Your Settings!
      </h1>
      <div className="w-1/2">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            disabled
            value={user.username}
            className="block py-2.5 px-0 w-full text-sm text-gray-400 bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600"
            placeholder="Username"
          />
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            value={user.name || ""}
            onChange={handleChange("name")}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 peer"
            placeholder="Name"
            required
          />
        </div>

        <fieldset>
          <legend className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-300">
            Gender
          </legend>
          {["Male", "Female", "Other"].map((g) => (
            <div className="flex items-center mb-4" key={g}>
              <input
                type="radio"
                id={`gender-${g}`}
                name="gender"
                value={g}
                checked={user.gender === g}
                onChange={handleChange("gender")}
                className="w-4 h-4 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor={`gender-${g}`}
                className="ml-2 text-sm text-gray-900 dark:text-gray-300"
              >
                {g}
              </label>
            </div>
          ))}
        </fieldset>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            value={user.email}
            onChange={handleChange("email")}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 peer"
            placeholder="Email address"
            required
          />
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="tel"
            value={user.phone || ""}
            onChange={handleChange("phone")}
            placeholder="123-456-7890"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 peer"
          />
        </div>

        <button
          onClick={handleSave}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Save
        </button>
      </div>
    </LayoutWrapper>
  );
}

export default Settings;
