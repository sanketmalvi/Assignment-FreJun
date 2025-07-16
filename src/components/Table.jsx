import { useEffect, useState } from "react";
import { fetchCommentsWithPostTitles } from "../data/fetchComments";

const PAGE_SIZE = 10;
const PAGE_BLOCK_SIZE = 10;
const LOCAL_STORAGE_KEY = "comment_edits";

const loadEditsFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const saveEditToStorage = (id, field, value) => {
  const edits = loadEditsFromStorage();
  const updated = {
    ...edits,
    [id]: {
      ...edits[id],
      [field]: value,
    },
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
};

export default function CommentTable({ searchQuery }) {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState({});
  const [pageBlockStart, setPageBlockStart] = useState(1);

  useEffect(() => {
    fetchCommentsWithPostTitles().then((data) => {
      const localEdits = loadEditsFromStorage();
      const merged = data.map((comment) =>
        localEdits[comment.id] ? { ...comment, ...localEdits[comment.id] } : comment
      );
      setComments(merged);
    });
  }, []);

  const handleEdit = (id, field) => {
    setEditing({ id, field });
  };

  const handleChange = (id, field, value) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, [field]: value } : comment
      )
    );
    saveEditToStorage(id, field, value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") setEditing({});
  };

  const handleBlur = () => setEditing({});

  const filtered = comments.filter((comment) =>
    comment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextBlock = () => {
    const newStart = pageBlockStart + PAGE_BLOCK_SIZE;
    if (newStart <= totalPages) {
      setPageBlockStart(newStart);
      setCurrentPage(newStart);
    }
  };

  const goToPrevBlock = () => {
    const newStart = pageBlockStart - PAGE_BLOCK_SIZE;
    if (newStart > 0) {
      setPageBlockStart(newStart);
      setCurrentPage(newStart);
    }
  };

  const visiblePages = Array.from({ length: PAGE_BLOCK_SIZE }, (_, i) => pageBlockStart + i).filter(
    (page) => page <= totalPages
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Comments Table</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full table-auto border border-gray-200">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Body</th>
              <th className="border px-4 py-2 text-left">Post</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((comment) => (
                <tr key={comment.id} className="hover:bg-blue-50 transition-all">
                  <td className="border px-4 py-2 text-sm text-gray-700">{comment.email}</td>

                  <td
                    className="border px-4 py-2 cursor-pointer text-sm text-gray-800"
                    onClick={() => handleEdit(comment.id, "name")}
                  >
                    {editing.id === comment.id && editing.field === "name" ? (
                      <input
                        type="text"
                        className="w-full p-1 border rounded focus:outline-blue-400"
                        value={comment.name}
                        onChange={(e) => handleChange(comment.id, "name", e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyPress}
                        autoFocus
                      />
                    ) : (
                      comment.name
                    )}
                  </td>

                  <td
                    className="border px-4 py-2 cursor-pointer text-sm text-gray-800"
                    onClick={() => handleEdit(comment.id, "body")}
                  >
                    {editing.id === comment.id && editing.field === "body" ? (
                      <textarea
                        className="w-full p-1 border rounded focus:outline-blue-400"
                        value={comment.body}
                        onChange={(e) => handleChange(comment.id, "body", e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        rows={2}
                      />
                    ) : (
                      comment.body
                    )}
                  </td>

                  <td className="border px-4 py-2 text-sm text-gray-700">{comment.postTitle}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
          <button
            onClick={goToPrevBlock}
            disabled={pageBlockStart === 1}
            className="px-4 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 text-sm"
          >
            Prev
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === page ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={goToNextBlock}
            disabled={pageBlockStart + PAGE_BLOCK_SIZE > totalPages}
            className="px-4 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
