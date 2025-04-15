import UserDropdown from "./UserDropdown";
import logo from "../assets/logo1.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

function LayoutWrapper({ children }) {
  const [ownedHives, setOwnedHives] = useState([]);
  const [memberHives, setMemberHives] = useState([]);
  const [publicHives, setPublicHives] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [shieldMode, setShieldMode] = useState("private");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHives = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/hive/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch hives");

        const data = await res.json();
        setOwnedHives(data.ownedHives || []);
        setMemberHives(data.memberHives || []);
        setPublicHives(data.publicHives || []);
      } catch (err) {
        console.error("Error fetching hives:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHives();
  }, [token]);

  const createHive = async () => {
    if (!name.trim() || !shieldMode) return;

    try {
      const res = await fetch(`${apiUrl}/api/hive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, shieldMode }),
      });

      if (res.ok) {
        const data = await res.json();
        setShowModal(false);
        setName("");
        navigate(`/dashboard/${data.hive._id}`);
      } else {
        console.error("❌ Failed to create hive");
      }
    } catch (err) {
      console.error("🔥 Error creating hive:", err);
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </button>
              <a href="/" className="flex ms-2 md:me-24">
                <img src={logo} className="h-8 me-3" alt="Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Hives
                </span>
              </a>
            </div>
            <div className="flex items-center ms-3">
              <button
                onClick={() => setShowModal(true)}
                className="mr-5 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-500"
              >
                + Create Hive
              </button>
              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ms-3">Settings</span>
              </a>
            </li>

            {/* Owned Hives */}
            {ownedHives.length > 0 && (
              <>
                <li className="text-xs uppercase text-gray-400 dark:text-gray-500 mt-2 px-2">
                  Your Hives
                </li>
                {ownedHives.map((hive) => (
                  <li key={hive._id}>
                    <a
                      href={`/dashboard/${hive._id}`}
                      className="ml-4 block p-2 text-sm text-gray-800 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {hive.name}
                    </a>
                  </li>
                ))}
              </>
            )}

            {/* Member Hives */}
            {memberHives.length > 0 && (
              <>
                <li className="text-xs uppercase text-gray-400 dark:text-gray-500 mt-2 px-2">
                  Joined Hives
                </li>
                {memberHives.map((hive) => (
                  <li key={hive._id}>
                    <a
                      href={`/dashboard/${hive._id}`}
                      className="ml-4 block p-2 text-sm text-gray-800 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      🌐 {hive.name}
                    </a>
                  </li>
                ))}
              </>
            )}
            {/* Public Hives */}
            {publicHives.length > 0 && (
              <>
                <li className="text-xs uppercase text-gray-400 dark:text-gray-500 mt-2 px-2">
                  Public Hives
                </li>
                {publicHives.map((hive) => (
                  <li key={hive._id}>
                    <a
                      href={`/dashboard/${hive._id}`}
                      className="ml-4 block p-2 text-sm text-gray-800 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {hive.name}
                    </a>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </aside>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Create New Hive
            </h2>
            <input
              type="text"
              placeholder="Enter Hive Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <select
              id="shieldMode"
              value={shieldMode}
              onChange={(e) => setShieldMode(e.target.value)}
              class="w-full px-3 py-2 mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option selected="">Select Visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 text-sm rounded border dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={createHive}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-500"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-4 pt-24 sm:ml-64 min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        {children}
      </main>
    </>
  );
}

export default LayoutWrapper;
