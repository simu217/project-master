import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

function JoinHive() {
  const { code } = useParams(); // the invitation key
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // On load, check if logged in, else redirect to login
  useEffect(() => {
    if (!token) {
      localStorage.setItem("redirectAfterLogin", window.location.href); // save for after login
      // navigate("/login");
      window.location.pathname = "/login";
    } else {
      setIsLoggedIn(true);
      setLoading(false);
    }
  }, [token, navigate]);

  const handleAccept = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/hive/accept/${code}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("✅ You’ve joined the Hive!");
        navigate("/dashboard");
      } else {
        const err = await res.json();
        alert("❌ Failed to accept invite: " + err.message);
      }
    } catch (err) {
      console.error("Error accepting invite:", err);
      alert("🔥 Error while joining the hive.");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (loading) return <p className="p-4">Checking invite...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Join Hive 🐝</h2>
      <p className="text-gray-600 mb-6">
        You’ve been invited to join a Hive. Would you like to accept the
        invitation?
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleAccept}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          Accept Invite
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default JoinHive;
