import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getPayslipDetailsByEmployeeAndPeriod } from "../../services/dummyData";
import {
  FiArrowLeft,
  FiEdit2,
  FiCheck,
  FiX,
  FiPrinter,
  FiAlertCircle,
} from "react-icons/fi";

export default function PayslipDetails() {
  const navigate = useNavigate();
  const { employeeId, month, year } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("worked-days");

  const payslipData = getPayslipDetailsByEmployeeAndPeriod(
    employeeId,
    month,
    parseInt(year)
  );

  const [formData, setFormData] = useState({
    basicSalary: payslipData?.basicWage || 0,
    grossSalary: payslipData?.grossWage || 0,
    netSalary: payslipData?.netWage || 0,
    attendanceDays: payslipData?.workedDays?.[0]?.days || 5,
    paidLeaveDays: payslipData?.workedDays?.[1]?.days || 0,
  });

  if (!payslipData) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-auto flex items-center justify-center`}>
          <div className="text-center">
            <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Payslip not found</p>
          </div>
        </div>
      </div>
    );
  }

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    // Save logic here
    console.log("Saving payslip:", formData);
    setIsEditMode(false);
    alert("Payslip updated successfully!");
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const totalWorkedDays =
    formData.attendanceDays + formData.paidLeaveDays;

  return (
    <div className="h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-auto`}>
        {/* Header */}
        <div className="bg-white shadow-sm p-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/payroll")}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Payslip Details</h1>
            </div>

            <div className="flex items-center gap-2">
              {!isEditMode ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Payslip
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                  >
                    <FiCheck className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              )}
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition"
              >
                <FiPrinter className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Employee & Payrun Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 font-medium mb-4">Employee</p>
              <h2 className="text-xl font-bold text-gray-900">
                {payslipData.employeeDetails.name}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Salary Structure:</span>
              </p>
              <p className="text-gray-900">{payslipData.salaryStructure}</p>
            </div>

            {/* Payrun Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 font-medium mb-4">Payrun</p>
              <p className="text-xl font-bold text-gray-900">
                Payrun {payslipData.payrunInfo.month} {payslipData.payrunInfo.year}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Period:</span>
              </p>
              <p className="text-gray-900">{payslipData.payrunInfo.period}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200 px-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("worked-days")}
                  className={`py-4 px-2 font-medium transition border-b-2 ${
                    activeTab === "worked-days"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Worked Days
                </button>
                <button
                  onClick={() => setActiveTab("salary-computation")}
                  className={`py-4 px-2 font-medium transition border-b-2 ${
                    activeTab === "salary-computation"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Salary Computation
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "worked-days" ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Salary is calculated based on the employee's monthly attendance. Paid leaves are
                      included in the total payable days, while unpaid leaves are deducted from the salary.
                    </p>
                  </div>

                  {/* Worked Days Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Type
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                            Days
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {payslipData.workedDays.map((day, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {day.type}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {day.description}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              {isEditMode && idx === 0 ? (
                                <input
                                  type="number"
                                  value={formData.attendanceDays}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "attendanceDays",
                                      parseFloat(e.target.value)
                                    )
                                  }
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                                  step="0.5"
                                />
                              ) : isEditMode && idx === 1 ? (
                                <input
                                  type="number"
                                  value={formData.paidLeaveDays}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "paidLeaveDays",
                                      parseFloat(e.target.value)
                                    )
                                  }
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                                  step="0.5"
                                />
                              ) : (
                                <p className="text-sm font-medium text-gray-900">
                                  {day.days.toFixed(2)}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <p className="text-sm font-medium text-gray-900">
                                ₹{day.amount.toLocaleString("en-IN", {
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </td>
                          </tr>
                        ))}
                        {/* Total Row */}
                        <tr className="bg-blue-50 border-t-2 border-blue-200">
                          <td className="px-4 py-4">
                            <p className="text-sm font-bold text-gray-900">Total</p>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <p className="text-sm font-bold text-gray-900">
                              {totalWorkedDays.toFixed(2)}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <p className="text-sm font-bold text-gray-900">
                              ₹
                              {(
                                payslipData.workedDays[0].amount +
                                payslipData.workedDays[1].amount
                              ).toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-6">
                      Salary breakdown showing all components contributing to the gross and net salary.
                    </p>
                  </div>

                  {/* Salary Components */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Earnings */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Earnings</h3>
                      <div className="space-y-3">
                        {payslipData.salaryComponents
                          .filter((comp) => comp.amount > 0)
                          .map((comp, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center py-2 border-b border-gray-100"
                            >
                              <div>
                                <p className="text-sm text-gray-700">
                                  {comp.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {comp.percentage}%
                                </p>
                              </div>
                              <p className="text-sm font-medium text-green-600">
                                +₹
                                {comp.amount.toLocaleString("en-IN", {
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Deductions */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Deductions</h3>
                      <div className="space-y-3">
                        {payslipData.salaryComponents
                          .filter((comp) => comp.amount < 0)
                          .map((comp, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center py-2 border-b border-gray-100"
                            >
                              <div>
                                <p className="text-sm text-gray-700">
                                  {comp.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {comp.percentage}%
                                </p>
                              </div>
                              <p className="text-sm font-medium text-red-600">
                                ₹
                                {Math.abs(comp.amount).toLocaleString("en-IN", {
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Total Earnings:</span>
                      <span className="font-semibold text-gray-900">
                        ₹
                        {payslipData.salaryComponents
                          .filter((c) => c.amount > 0)
                          .reduce((sum, c) => sum + c.amount, 0)
                          .toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-gray-700">Total Deductions:</span>
                      <span className="font-semibold text-gray-900">
                        ₹
                        {Math.abs(
                          payslipData.salaryComponents
                            .filter((c) => c.amount < 0)
                            .reduce((sum, c) => sum + c.amount, 0)
                        ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg border-t-2 pt-2 mt-2">
                      <span className="font-bold text-gray-900">Net Salary:</span>
                      <span className="font-bold text-blue-600">
                        ₹
                        {payslipData.netWage.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
