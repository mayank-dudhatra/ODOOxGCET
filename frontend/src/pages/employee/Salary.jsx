import { useEffect, useState } from "react";
import { FiCalendar, FiDownload } from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function EmployeeSalary() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeSalary, setEmployeeSalary] = useState(null);
  const [salaryStatement, setSalaryStatement] = useState(null);

  const years = [selectedYear - 1, selectedYear, selectedYear + 1];

  useEffect(() => {
    fetchSalary();
  }, [selectedMonth, selectedYear]);

  const fetchSalary = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/payroll/my", {
        params: { month: selectedMonth, year: selectedYear },
      });

      setEmployeeSalary(data.employee);
      setSalaryStatement(data.statement);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to load salary information";
      setError(message);
      setEmployeeSalary(null);
      setSalaryStatement(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount = 0) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const handleDownloadPayslip = () => {
    if (!salaryStatement) return;

    const employeeId = employeeSalary?.employeeId || user?.loginId || user?.id || "employee";
    const content = `
SALARY STATEMENT
Month: ${selectedMonth} ${selectedYear}
Employee ID: ${employeeId}
Name: ${employeeSalary?.name || user?.name || ""}
Department: ${employeeSalary?.department || ""}

EARNINGS:
Basic Salary: ${formatCurrency(salaryStatement?.basicSalary)}
HRA: ${formatCurrency(salaryStatement?.hra)}
DA: ${formatCurrency(salaryStatement?.da)}
Allowances: ${formatCurrency(salaryStatement?.allowances)}
Total Earnings: ${formatCurrency(salaryStatement?.totalEarnings)}

DEDUCTIONS:
PF Contribution: ${formatCurrency(salaryStatement?.pfContribution)}
TDS: ${formatCurrency(salaryStatement?.tds)}
Other Deductions: ${formatCurrency(salaryStatement?.otherDeductions)}
Total Deductions: ${formatCurrency(salaryStatement?.totalDeductions)}

NET SALARY: ${formatCurrency(salaryStatement?.netSalary)}
    `;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute(
      "download",
      `Payslip_${employeeId}_${selectedMonth}_${selectedYear}.txt`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } h-screen overflow-auto`}
      >
        <div className="bg-white shadow-sm p-6 sticky top-0 z-30">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Salary</h1>
            <p className="text-gray-600 text-sm mt-1">
              View your salary information and download payslips
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-semibold">Unable to load salary details</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-gray-600">Loading salary data...</div>
          ) : !employeeSalary || !salaryStatement ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-gray-700">
              Salary information not available. Please check with your administrator.
            </div>
          ) : (
            <>
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
                      {employeeSalary.department || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-medium">Designation</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {employeeSalary.position || employeeSalary.designation || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-medium">Employee ID</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {employeeSalary.employeeId || user?.loginId || user?.id || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payslip</h2>

                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-5 h-5 text-gray-500" />
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {months.map((monthOption) => (
                        <option key={monthOption} value={monthOption}>
                          {monthOption}
                        </option>
                      ))}
                    </select>
                  </div>

                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {years.map((yearOption) => (
                      <option key={yearOption} value={yearOption}>
                        {yearOption}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Earnings</h3>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-700">Basic Salary</td>
                          <td className="text-right font-semibold text-gray-900">
                            {formatCurrency(salaryStatement.basicSalary)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-700">HRA (House Rent Allowance)</td>
                          <td className="text-right font-semibold text-gray-900">
                            {formatCurrency(salaryStatement.hra)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-700">DA (Dearness Allowance)</td>
                          <td className="text-right font-semibold text-gray-900">
                            {formatCurrency(salaryStatement.da)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-700">Other Allowances</td>
                          <td className="text-right font-semibold text-gray-900">
                            {formatCurrency(salaryStatement.allowances)}
                          </td>
                        </tr>
                        <tr className="bg-blue-50 border-b border-gray-200">
                          <td className="py-3 font-semibold text-gray-900">Gross Earnings</td>
                          <td className="text-right font-bold text-blue-600 text-lg">
                            {formatCurrency(salaryStatement.totalEarnings)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Deductions</h3>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-700">Provident Fund (PF)</td>
                          <td className="text-right font-semibold text-gray-900">
                            {formatCurrency(salaryStatement.pfContribution)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-700">Tax Deducted at Source (TDS)</td>
                          <td className="text-right font-semibold text-gray-900">
                            {formatCurrency(salaryStatement.tds)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-700">Other Deductions</td>
                          <td className="text-right font-semibold text-gray-900">
                            {formatCurrency(salaryStatement.otherDeductions)}
                          </td>
                        </tr>
                        <tr className="bg-red-50 border-b border-gray-200">
                          <td className="py-3 font-semibold text-gray-900">Total Deductions</td>
                          <td className="text-right font-bold text-red-600 text-lg">
                            {formatCurrency(salaryStatement.totalDeductions)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-gray-900">Net Salary</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(salaryStatement.netSalary)}
                      </p>
                    </div>
                  </div>
                </div>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
