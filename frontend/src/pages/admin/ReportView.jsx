import { useSearchParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { generateReport } from "../../services/dummyData";
import { useState } from "react";
import { FiArrowLeft, FiPrinter, FiX } from "react-icons/fi";

export default function ReportView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const reportType = searchParams.get("type");
  const employeeId = searchParams.get("employeeId");
  const year = parseInt(searchParams.get("year"));

  const report = generateReport(reportType, employeeId, year);

  if (!report) {
    return (
      <div className="h-screen bg-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-auto flex items-center justify-center`}>
          <p className="text-gray-600">Report not found</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    navigate("/admin/reports");
  };

  return (
    <div className="h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-auto`}>
        {/* Header - Hidden on print */}
        <div className="bg-white shadow-sm p-6 sticky top-0 z-30 print:hidden flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{report.reportType}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              <FiPrinter className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleClose}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-medium transition"
            >
              <FiX className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-8 max-w-4xl mx-auto print:p-0">
          <div className="bg-white rounded-lg shadow-sm p-8 print:shadow-none">
            {/* Report Header */}
            <div className="mb-8 border-b-2 border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {report.reportType}
              </h2>
              <p className="text-sm text-gray-600">
                Generated on: {new Date(report.generatedDate).toLocaleDateString()}
              </p>
            </div>

            {/* Employee Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Employee Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-medium">
                    Employee Name
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {report.employeeDetails.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-medium">
                    Employee ID
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {report.employeeDetails.employeeId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-medium">
                    Department
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {report.employeeDetails.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-medium">
                    Designation
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {report.employeeDetails.designation}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-medium">
                    Date Of Joining
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {report.employeeDetails.dateOfJoining}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-medium">
                    Salary Effective From
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {report.employeeDetails.salaryEffectiveFrom}
                  </p>
                </div>
              </div>
            </div>

            {/* Salary Components */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Salary Components
              </h3>

              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Salary Components
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Monthly Amount
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Yearly Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Earnings */}
                  <tr className="border-b border-gray-200">
                    <td colSpan="3" className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50">
                      Earnings
                    </td>
                  </tr>
                  {report.salaryComponents.map((component, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {component.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        ₹{component.monthlyAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        ₹{component.yearlyAmount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}

                  {/* Deduction */}
                  <tr className="border-b border-gray-200">
                    <td colSpan="3" className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50">
                      Deduction
                    </td>
                  </tr>
                  {report.deductions.map((deduction, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {deduction.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        ₹{deduction.monthlyAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        ₹{deduction.yearlyAmount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}

                  {/* Net Salary */}
                  <tr className="border-b-2 border-gray-900 bg-blue-50">
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">
                      Net Salary
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-blue-600">
                      ₹{report.monthlyNetSalary.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-blue-600">
                      ₹{report.yearlyNetSalary.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Success Message - Hidden on print */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <p className="text-sm font-medium text-green-800">
                  Report generated successfully
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
