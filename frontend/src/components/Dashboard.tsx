import { useEffect, useState } from "react";
import LayoutWrapper from "./LayoutWrapper";
import { useParams } from "react-router-dom";
import Hives from "./Hives";
import HiveMembers, { IHiveMember } from "./HiveMembers";
import LinkPreview from "./LinkPreview";
import { IUser } from "./UserDropdown";
const apiUrl = process.env.REACT_APP_API_URL;

export interface ICrystal {
  _id: string;
  title: string;
  url: string;
  createdAt: string;
  addedBy: any;
  meta: {
    title: string;
    description: string;
    image?: string;
  };
}

export interface IHive {
  _id?: string;
  name: string;
  crystals: ICrystal[];
  members: IHiveMember[];
  queen: { username: string };
}

function Dashboard() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [hive, setHive] = useState<IHive>({
    name: "",
    crystals: [],
    members: [],
    queen: { username: "" },
  });

  const [ownedHives, setOwnedHives] = useState<IHive[]>([]);
  const [memberHives, setMemberHives] = useState<IHive[]>([]);
  const [publicHives, setPublicHives] = useState<IHive[]>([]);

  const [loading, setLoading] = useState<boolean>(!!id);

  const [inviteModal, setInviteModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const [user, setUser] = useState<IUser>({ username: "", email: "" });

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

  const fetchMyHives = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/hive/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user hives");
      const data = await res.json();
      setOwnedHives(data.ownedHives || []);
      setMemberHives(data.memberHives || []);
      setPublicHives(data.publicHives || []);
    } catch (err) {
      console.error("❌ Error fetching hives:", err);
    }
  };

  const fetchHive = async () => {
    if (!id) return;

    try {
      const res = await fetch(`${apiUrl}/api/hive/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch hive");
      const data = await res.json();
      setHive(data);
    } catch (err) {
      console.error("❌ Error loading hive:", err);
    } finally {
      setLoading(false);
    }
  };

  const invite = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/hive/${id}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (res.ok) {
        alert("✅ Invite sent successfully!");
      } else {
        const err = await res.json();
        alert("❌ Failed to send invite: " + err.message);
      }
    } catch (error) {
      alert("🔥 Error sending invite");
    } finally {
      setInviteModal(false);
      setInviteEmail("");
    }
  };

  useEffect(() => {
    if (id) fetchHive();
    else fetchMyHives();
  }, [id]);

  useEffect(() => {
    const handlePaste = async (event: any) => {
      const pastedText = event.clipboardData.getData("text");
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = pastedText.match(urlRegex);

      if (!urls || urls.length === 0) return;

      const url = urls[0];
      const title = new URL(url).hostname;

      try {
        const response = await fetch(`${apiUrl}/api/hive/${id}/crystals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            crystals: [{ title, url }],
          }),
        });

        if (response.ok) {
          console.log("✅ Crystal added from paste!");
          fetchHive();
        } else {
          console.error("❌ Failed to add pasted crystal");
        }
      } catch (err) {
        console.error("🔥 Error posting pasted crystal:", err);
      }
    };

    if (id) {
      document.addEventListener("paste", handlePaste);
      return () => document.removeEventListener("paste", handlePaste);
    }
  }, [id, token]);

  return (
    <LayoutWrapper>
      {!id ? (
        <div className="mb-6">
          <Hives hives={ownedHives} name="Your own Hives" />
          <Hives hives={memberHives} name="Hives you are Member of" />
          <Hives hives={publicHives} name="All Public Hives" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {hive.name}
            </h2>

            <div>
              <button
                onClick={() => setMemberModal(true)}
                className="mr-5 text-sm px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
              >
                Members
              </button>
              <button
                onClick={() => {
                  (hive.crystals || []).forEach((crystal: ICrystal) => {
                    if (crystal.url) {
                      window.open(crystal.url, "_blank", "noopener,noreferrer");
                    }
                  });
                }}
                className="text-sm px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
              >
                🔗 Open All
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading hive...</p>
          ) : hive ? (
            <div className="grid">
              {hive.crystals && hive.crystals.length > 0 ? (
                <div className="grid gap-4">
                  {(hive.crystals || [])
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((crystal: ICrystal) => {
                      const isMine = crystal.addedBy._id === user._id;
                      return (
                        <div
                          key={crystal._id}
                          className={`p-4 flex ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <LinkPreview
                            hiveId={hive._id || ""}
                            crystal={crystal}
                            onReload={fetchHive}
                          />
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No crystals found in this hive.
                </p>
              )}
            </div>
          ) : (
            <p className="text-red-500">Hive not found.</p>
          )}
        </>
      )}

      {inviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md w-full max-w-sm shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Invite someone to your Hive 🐝
            </h3>

            <input
              type="email"
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setInviteModal(false)}
                className="text-gray-500 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={async () => invite()}
                className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-500"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {memberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md w-full shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Members in {hive.name}
            </h3>

            <div className="flex justify-end gap-2 mb-5">
              <HiveMembers
                members={hive.members}
                username={hive.queen.username}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMemberModal(false)}
                className="text-gray-500 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setMemberModal(false);
                  setInviteModal(true);
                }}
                className="mr-5 text-sm px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
              >
                + Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
}

export default Dashboard;
