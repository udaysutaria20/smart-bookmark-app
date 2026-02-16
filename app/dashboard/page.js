"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(null);

  // ✅ Get Logged-in User
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    getUser();

    // Optional: listen to auth changes (logout, login)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Load bookmarks when user changes & setup realtime
  useEffect(() => {
    if (!user) return;

    // Load user bookmarks
    const loadBookmarks = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setBookmarks(data || []);
    };

    loadBookmarks();

    // ✅ Realtime subscription only for this user
    const channel = supabase
      .channel("bookmarks-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // reload bookmarks whenever a change happens
          loadBookmarks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // ✅ Add Bookmark
  const addBookmark = async () => {
    if (!title || !url) return;

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

    setTitle("");
    setUrl("");
  };

  // ✅ Delete Bookmark
  const deleteBookmark = async (id) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  if (!user) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Bookmarks</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-1 rounded"
        />

        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 flex-1 rounded"
        />

        <button
          onClick={addBookmark}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div className="space-y-3">
        {bookmarks.length === 0 && (
          <p className="text-gray-500">No bookmarks yet.</p>
        )}

        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {bookmark.title}
            </a>

            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
