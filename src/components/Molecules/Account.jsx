import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Avatar from "./Avatar";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [description, setDescription] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  //get profile of current user.
  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, description, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setDescription(data.description);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  //on change in profile section, update profile.
  async function updateProfile({ username, description, avatar_url }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username,
        description,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });
      //console.log("profile got updated");

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-white flex flex-col items-center content-evenly md:content-none gap-1 md:gap-2 max-h-screen max-w-lg w-full">
      <Avatar
        url={avatar_url}
        size={150}
        //on Upload of new image set avatar to it and update Profile.
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ username, description, avatar_url: url });
        }}
      />
      <div className="w-fit">
        <p>Email:</p>
        <input
          id="email"
          type="text"
          className="bg-black border-2 border-gray-800 focus:outline-none rounded-lg p-1 disabled:bg-gray-400"
          value={session.user.email}
          disabled
        />
      </div>
      <div>
        <p>Name:</p>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-black border-2 border-gray-800 focus:outline-none rounded-lg p-1"
        />
      </div>
      <div>
        <p>Description:</p>
        <input
          id="description"
          type="description"
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-black border-2 border-gray-800 focus:outline-none rounded-lg p-1"
        />
      </div>

      <div>
        <button
          className="bg-black border-2 border-gray-800 focus:outline-none rounded-lg p-2 px-4 hover:bg-gray-900 active:bg-gray-800 focus:bg-gray-900 disabled:bg-gray-400"
          onClick={() => updateProfile({ username, description, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="bg-black border-2 border-gray-800 focus:outline-none rounded-lg p-2 hover:bg-gray-900 active:bg-gray-800 focus:bg-gray-900 disabled:bg-gray-400"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
