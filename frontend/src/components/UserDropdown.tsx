import { useEffect, useState } from "react";
const apiUrl = process.env.REACT_APP_API_URL;

export interface IUser {
  _id?: string;
  username: string;
  name?: string;
  email: string;
  phone?: string;
  gender?: string;
}

function UserDropdown() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<IUser>({ username: "", email: "" });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // assumed stored during login

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/member`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

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

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="flex text-sm bg-gray-800 rounded-full focus:ring-gray-300 dark:focus:ring-gray-600"
        aria-expanded={open}
      >
        <span className="sr-only">Open user menu</span>
        <svg
          className="w-8 h-8 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 w-auto bg-white divide-y divide-gray-100 rounded-sm shadow-lg dark:bg-gray-700 dark:divide-gray-600">
          <div className="px-4 py-3">
            {loading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </p>
            ) : user ? (
              <>
                <p className="text-sm text-gray-900 dark:text-white capitalize">
                  {user.username}
                </p>
                <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                  {user.email}
                </p>
              </>
            ) : (
              <p className="text-sm text-red-500 dark:text-red-400">
                User not found
              </p>
            )}
          </div>

          <ul className="py-1">
            <li>
              <a
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Settings
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Sign out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
