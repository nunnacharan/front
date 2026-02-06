import { useEffect, useState, useCallback } from "react";
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

const BACKEND_URL = "https://backend-2-up29.onrender.com";

export default function Dashboard() {
  const nav = useNavigate();

  /* ================= STATES ================= */
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);

  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentName, setCurrentName] = useState("Home");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");
  const [open, setOpen] = useState(false);

  /* ================= FETCH ================= */
  const fetchFiles = useCallback(async () => {
    const res = await API.get("/files", {
      params: { parent: currentFolder }
    });
    setFiles(res.data);
  }, [currentFolder]);

  const fetchFolders = useCallback(async () => {
    const res = await API.get("/files/folders");
    setFolders(res.data);
  }, []);

  useEffect(() => {
    fetchFiles();
    fetchFolders();
  }, [fetchFiles, fetchFolders]);

  /* ================= ACTIONS ================= */
  const logout = () => {
    localStorage.clear();
    nav("/", { replace: true });
  };

  const upload = async (file) => {
    const form = new FormData();
    form.append("file", file);
    if (currentFolder) form.append("parentId", currentFolder);

    await API.post("/files/upload", form);
    toast.success(`Uploaded to ${currentName}`);
    fetchFiles();
  };

  const createFolder = async () => {
    const name = prompt("Folder name");
    if (!name) return;

    await API.post("/files/folder", { name, parentId: currentFolder });
    toast.success("Folder created");
    fetchFolders();
  };

  const remove = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await API.delete(`/files/${id}`);
    toast.success("Deleted");
    fetchFiles();
  };

  const rename = async (id, old) => {
    const name = prompt("Rename", old);
    if (!name) return;
    await API.put(`/files/${id}`, { name });
    toast.success("Renamed");
    fetchFiles();
  };

  /* ================= FILE OPEN / DOWNLOAD (FIXED) ================= */

  const openFileInNewTab = async (fileId) => {
    try {
      const res = await API.get(`/files/open/${fileId}`);
      window.open(res.data.url, "_blank");
    } catch {
      toast.error("Unable to open file");
    }
  };

  const downloadFile = async (fileId) => {
    try {
      const res = await API.get(`/files/open/${fileId}`);
      window.location.href = res.data.url;
    } catch {
      toast.error("Download failed");
    }
  };

  /* ================= HELPERS ================= */
  const getFileType = (name) => name.split(".").pop().toUpperCase();

  const sortedFiles = [...files]
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  const recentFiles = sortedFiles.filter(f => !f.isFolder).slice(0, 4);

  const usedStorageMB = files.length * 5;
  const totalStorageMB = 15000;

  /* ================= UI ================= */
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-white shadow-md p-4 md:p-6">
        <h2 className="text-xl font-bold text-blue-600 mb-4">☁ Cloud Drive</h2>

        <div
          onClick={() => {
            setCurrentFolder(null);
            setCurrentName("Home");
          }}
          className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100"
        >
          <FaHome /> Home
        </div>

        <p className="text-gray-400 text-xs mt-4 mb-2">FOLDERS</p>

        <div className="space-y-1 max-h-40 md:max-h-full overflow-auto">
          {folders.map((f) => (
            <div
              key={f._id}
              onClick={() => {
                setCurrentFolder(f._id);
                setCurrentName(f.name);
              }}
              className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100"
            >
              <FaFolder className="text-yellow-400" />
              <span className="truncate">{f.name}</span>
            </div>
          ))}
        </div>

        {/* STORAGE */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 mb-1">Storage used</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(usedStorageMB / totalStorageMB) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {usedStorageMB} MB of {totalStorageMB / 1000} GB
          </p>
        </div>

        <button
          onClick={createFolder}
          className="bg-blue-600 text-white py-2 rounded-lg mt-4 w-full hover:bg-blue-700"
        >
          + New Folder
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Home / {currentName}</p>
            <h3 className="text-lg font-semibold">{currentName}</h3>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <select
              onChange={(e) => setSort(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>

            <input
              placeholder="Search files..."
              className="border px-3 py-2 rounded-lg"
              onChange={(e) => setSearch(e.target.value)}
            />

            <FaUserCircle
              size={26}
              className="cursor-pointer"
              onClick={() => setOpen(!open)}
            />

            {open && (
              <button onClick={logout} className="text-sm text-red-600">
                Logout
              </button>
            )}
          </div>
        </div>

        {/* RECENT FILES (FIXED) */}
        {recentFiles.length > 0 && (
          <>
            <h4 className="font-semibold mb-3">Recent files</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {recentFiles.map((f) => (
                <div
                  key={f._id}
                  onClick={() => openFileInNewTab(f._id)}
                  className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition"
                >
                  <FaFileAlt className="text-blue-500 mb-2" />
                  <p className="text-sm truncate">{f.name}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* UPLOAD */}
        <div
          className="border-2 border-dashed border-gray-300 bg-white p-6 md:p-10 rounded-xl
                     text-center mb-8 hover:border-blue-400 hover:bg-blue-50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            upload(e.dataTransfer.files[0]);
          }}
        >
          Drag & Drop files here or click to upload
          <input
            type="file"
            className="block mx-auto mt-3"
            onChange={(e) => upload(e.target.files[0])}
          />
        </div>

        {/* FILE GRID */}
        {sortedFiles.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <FaFolder size={48} className="mx-auto mb-4" />
            <p>No files here yet</p>
            <p className="text-sm">Upload files to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedFiles.map((f) => (
              <div
                key={f._id}
                className="group bg-white p-5 rounded-xl border hover:shadow-lg relative"
              >
                <div className="flex items-center gap-2 mb-2">
                  {f.isFolder
                    ? <FaFolder className="text-yellow-400" />
                    : <FaFileAlt className="text-blue-500" />}
                  <span className="truncate font-medium">{f.name}</span>
                </div>

                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {getFileType(f.name)}
                </span>

                <p className="text-xs text-gray-400 mt-2">
                  Modified {new Date(f.createdAt).toLocaleDateString()}
                </p>

                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-5 opacity-0 group-hover:opacity-100">
                  {!f.isFolder && (
                    <FaDownload
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => downloadFile(f._id)}
                    />
                  )}
                  <FaEdit
                    className="cursor-pointer hover:text-green-600"
                    onClick={() => rename(f._id, f.name)}
                  />
                  <FaTrash
                    className="cursor-pointer hover:text-red-600"
                    onClick={() => remove(f._id, f.name)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
