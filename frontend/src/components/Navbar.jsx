export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dayflow HRMS</h1>
        <ul className="flex gap-4">
          <li><a href="/">Home</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>
    </nav>
  );
}
