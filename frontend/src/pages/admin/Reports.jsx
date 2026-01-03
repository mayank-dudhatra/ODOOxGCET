import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getAllEmployeeSalaries, getReportTypes } from "../../services/dummyData";
import { FiPrinter } from "react-icons/fi";

export default function Reports() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState("Salary Statement Report");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedYear, setSelectedYear] = useState(2025);

  const reportTypes = getReportTypes();
  const employees = getAllEmployeeSalaries();
  const years = [2023, 2024, 2025, 2026];

  const handleGenerateReport = () => {
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }

    // Navigate to report view
    const employeeId = selectedEmployee.split("|")[0].trim();
    navigate(
      `/admin/reports/view?type=${selectedReportType}&employeeId=${employeeId}&year=${selectedYear}`
    );
  };

  return (
    <div className="h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-auto`}>
        {/* Header */}
        <div className="bg-white shadow-sm p-6 sticky top-0 z-30">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 text-sm mt-1">
            The Reports menu is accessible only to users with Admin or Payroll Officer access rights
          </p>
          <p className="text-gray-600 text-sm mt-2">
            To print the Salary Statement report, select the employee and the year for which you want to generate the report
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Generate Report Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Generate Report</h2>
            <p className="text-sm text-gray-600">
              Select report type, employee, and year
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {reportTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.employeeId} value={`${emp.employeeId} | ${emp.name}`}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Print Button */}
              <div>
                <button
                  onClick={handleGenerateReport}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  <FiPrinter className="w-5 h-5" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
