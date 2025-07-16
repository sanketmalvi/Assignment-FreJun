import { useState } from "react";
import Navbar from "./components/Navbar";
import Table from "./components/Table";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="max-w-6xl mx-auto mt-6">
        <Table searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export default App;
