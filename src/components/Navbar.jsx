export default function Navbar({ searchQuery, setSearchQuery }) {
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
  <nav className="bg-white shadow-md p-4 flex flex-col sm:flex-row justify-end items-center gap-3 sm:gap-2">
    <div className="flex items-center w-full sm:w-auto gap-2">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={handleInputChange}
        className="px-4 py-2 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
      >
        Search
      </button>
    </div>
  </nav>
);
}
