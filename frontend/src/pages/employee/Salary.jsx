import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import { getAllEmployeeSalaries, getSalaryStatementReport } from "../../services/dummyData";
import { FiDownload, FiCalendar } from "react-icons/fi";

export default function EmployeeSalary() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState("January");

  // Get current employee's salary
  const allSalaries = getAllEmployeeSalaries();
  const employeeSalary = allSalaries.find(
    (s) => s.employeeId === user?.employeeId
  );

  // Get salary statement
  const salaryStatement = getSalaryStatementReport(user?.employeeId, selectedYear);

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = [2024, 2025, 2026];

  const handleDownloadPayslip = () => {
    // Create a simple PDF-like download functionality
    const content = `
SALARY STATEMENT
Month: ${selectedMonth} ${selectedYear}
Employee ID: ${user?.employeeId}
Name: ${employeeSalary?.name}
Department: ${employeeSalary?.department}

EARNINGS:
Basic Salary: ${formatCurrency(salaryStatement?.basicSalary || 0)}
HRA: ${formatCurrency(salaryStatement?.hra || 0)}
DA: ${formatCurrency(salaryStatement?.da || 0)}
Allowances: ${formatCurrency(salaryStatement?.allowances || 0)}
Total Earnings: ${formatCurrency(salaryStatement?.totalEarnings || 0)}

DEDUCTIONS:
PF Contribution: ${formatCurrency(salaryStatement?.pfContribution || 0)}
TDS: ${formatCurrency(salaryStatement?.tds || 0)}
Other Deductions: ${formatCurrency(salaryStatement?.otherDeductions || 0)}
Total Deductions: ${formatCurrency(salaryStatement?.totalDeductions || 0)}

NET SALARY: ${formatCurrency(salaryStatement?.netSalary || 0)}
    `;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", `Payslip_${user?.employeeId}_${selectedMonth}_${selectedYear}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!employeeSalary) {
    return (
      <div className="h-screen bg-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-auto flex items-center justify-center`}>
          <div className="text-center">
            <p className="text-gray-600 text-lg">Salary information not available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-auto`}>
        {/* Header */}
        <div className="bg-white shadow-sm p-6 sticky top-0 z-30">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Salary</h1>
            <p className="text-gray-600 text-sm mt-1">
              View your salary information and download payslips
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Salary Overview Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Current Salary Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 text-sm font-medium">Basic Salary</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(employeeSalary.basicSalary)}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 text-sm font-medium">CTC (Annual)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(employeeSalary.ctc)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <p className="text-gray-600 text-sm font-medium">Department</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {employeeSalary.department}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm font-medium">Designation</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {employeeSalary.designation}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm font-medium">Employee ID</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {employeeSalary.employeeId}
                </p>
              </div>
            </div>
          </div>

          {/* Payslip View Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payslip</h2>

            {/* Month and Year Selection */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FiCalendar className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Payslip Details */}
            <div className="space-y-6">
              {/* Earnings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Earnings</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">Basic Salary</td>
                      <td className="text-right font-semibold text-gray-900">
                        {formatCurrency(salaryStatement?.basicSalary || 0)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">HRA (House Rent Allowance)</td>
                      <td className="text-right font-semibold text-gray-900">
                        {formatCurrency(salaryStatement?.hra || 0)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">DA (Dearness Allowance)</td>
                      <td className="text-right font-semibold text-gray-900">
                        {formatCurrency(salaryStatement?.da || 0)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">Other Allowances</td>
                      <td className="text-right font-semibold text-gray-900">
                        {formatCurrency(salaryStatement?.allowances || 0)}
                      </td>
                    </tr>
                    <tr className="bg-blue-50 border-b border-gray-200">
                      <td className="py-3 font-semibold text-gray-900">Gross Earnings</td>
                      <td className="text-right font-bold text-blue-600 text-lg">
                        {formatCurrency(salaryStatement?.totalEarnings || 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deductions</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">Provident Fund (PF)</td>
                      <td className="text-right font-semibold text-gray-900">
                        {formatCurrency(salaryStatement?.pfContribution || 0)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">Tax Deducted at Source (TDS)</td>
                      <td className="text-right font-semibold text-gray-900">
                        {formatCurrency(salaryStatement?.tds || 0)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">Other Deductions</td>
                      <td className="text-right font-semibold text-gray-900">
                        {formatCurrency(salaryStatement?.otherDeductions || 0)}
                      </td>
                    </tr>
                    <tr className="bg-red-50 border-b border-gray-200">
                      <td className="py-3 font-semibold text-gray-900">Total Deductions</td>
                      <td className="text-right font-bold text-red-600 text-lg">
                        {formatCurrency(salaryStatement?.totalDeductions || 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Net Salary */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-900">Net Salary</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(salaryStatement?.netSalary || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="mt-6">
              <button
                onClick={handleDownloadPayslip}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                <FiDownload className="w-5 h-5" />
                Download Payslip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
