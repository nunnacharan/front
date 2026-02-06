import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

import {
  FaFolder,
  FaFileAlt,
  FaTrash,
  FaDownload,
  FaEdit,
  FaUserCircle,
  FaHome
} from "react-icons/fa";

export default function Dashboard() {
  const nav = useNavigate();

  /* ================= STATES ================= */
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);

  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentName, setCurrentName] = useState("Home");

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  /* ================= FETCH ================= */
  const fetchFiles = async () => {
    const res = await API.get("/files", {
      params: { parent: currentFolder }
    });
    setFiles(res.data);
  };

  const fetchFolders = async () => {
    const res = await API.get("/files/folders");
    setFolders(res.data);
  };

  useEffect(() => {
    fetchFiles();
    fetchFolders();
  }, [currentFolder]);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    nav("/", { replace: true });
  };

  /* ================= UPLOAD ================= */
  const upload = async (file) => {
    const form = new FormData();
    form.append("file", file);
    if (currentFolder) form.append("parentId", currentFolder);

    await API.post("/files/upload", form);
    toast.success(`Uploaded to ${currentName}`);
    fetchFiles();
  };

  /* ================= CREATE FOLDER ================= */
  const createFolder = async () => {
    const name = prompt("Folder name");
    if (!name) return;

    await API.post("/files/folder", {
      name,
      parentId: currentFolder
    });

    fetchFolders();
  };

  /* ================= DELETE ================= */
  const remove = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?\nThis action cannot be undone.`
    );
    if (!confirmDelete) return;

    await API.delete(`/files/${id}`);
    toast.success("Deleted successfully");
    fetchFiles();
  };

  /* ================= RENAME ================= */
  const rename = async (id, old) => {
    const name = prompt("Rename", old);
    if (!name) return;

    await API.put(`/files/${id}`, { name });
    fetchFiles();
  };

  /* ================= DOWNLOAD (FIXED) ================= */
  const downloadFile = async (url, filename) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch {
      toast.error("Download failed");
    }
  };

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <div className="flex h-screen bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h2 className="text-xl font-bold text-blue-600 mb-6">
          ☁ Cloud Drive
        </h2>

        <div
          onClick={() => {
            setCurrentFolder(null);
            setCurrentName("Home");
          }}
          className={`flex items-center gap-2 p-2 rounded cursor-pointer mb-2
          ${currentFolder === null
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"}`}
        >
          <FaHome /> Home
        </div>

        <p className="text-gray-400 text-xs mt-4 mb-2">FOLDERS</p>

        <div className="flex-1 overflow-auto space-y-1">
          {folders.map((f) => (
            <div
              key={f._id}
              onClick={() => {
                setCurrentFolder(f._id);
                setCurrentName(f.name);
              }}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer
              ${currentFolder === f._id
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"}`}
            >
              <FaFolder className="text-yellow-400" />
              <span className="truncate">{f.name}</span>
            </div>
          ))}
        </div>

        <button
          onClick={createFolder}
          className="bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
        >
          + New Folder
        </button>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-8 overflow-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="flex items-center gap-2 font-semibold text-lg text-gray-700">
            <FaFolder className="text-yellow-400" />
            {currentName}
          </h3>

          <div className="flex gap-4 items-center">
            <input
              placeholder="Search files..."
              className="border px-3 py-2 rounded-lg w-64 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="relative">
              <FaUserCircle
                size={26}
                className="cursor-pointer text-gray-600"
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div className="absolute right-0 mt-2 bg-white shadow rounded w-28">
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* UPLOAD */}
        <div
          className="border-2 border-dashed border-gray-300 bg-white p-10 rounded-xl
                     text-center mb-8 hover:border-blue-400 hover:bg-blue-50
                     transition cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            upload(e.dataTransfer.files[0]);
          }}
        >
          <p className="font-medium">Drag & Drop files here</p>
          <p className="text-sm text-gray-400 mt-1">or click to upload</p>
          <input
            type="file"
            className="block mx-auto mt-4"
            onChange={(e) => upload(e.target.files[0])}
          />
        </div>

        {/* FILE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-400 mt-20">
              <p className="text-lg">No files found</p>
              <p className="text-sm">
                Upload files or create folders to get started
              </p>
            </div>
          )}

          {filtered.map((f) => (
            <div
              key={f._id}
              className="group bg-white p-5 rounded-xl border border-gray-200
                         hover:shadow-lg transition relative"
            >
              <div className="flex items-center gap-3 mb-3">
                {f.isFolder
                  ? <FaFolder className="text-yellow-400 text-xl" />
                  : <FaFileAlt className="text-blue-500 text-xl" />}
                <span className="font-medium text-gray-700 truncate">
                  {f.name}
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-8">
                {new Date(f.createdAt).toLocaleDateString()}
              </p>

              {/* ACTION BAR */}
              <div
                className="absolute bottom-3 left-0 right-0 flex justify-center gap-6
                           opacity-0 group-hover:opacity-100 transition"
              >
                {!f.isFolder && (
                  <button
                    onClick={() => downloadFile(f.url, f.name)}
                    className="text-gray-500 hover:text-blue-600"
                    title="Download"
                  >
                    <FaDownload />
                  </button>
                )}

                <button
                  onClick={() => rename(f._id, f.name)}
                  className="text-gray-500 hover:text-green-600"
                  title="Rename"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => remove(f._id, f.name)}
                  className="text-gray-500 hover:text-red-600"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
