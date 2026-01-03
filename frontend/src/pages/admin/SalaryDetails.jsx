import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getEmployeeSalaryDetails } from "../../services/dummyData";
import { FiArrowLeft, FiEdit2, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

export default function SalaryDetails() {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const salaryData = getEmployeeSalaryDetails(employeeId);

  const [formData, setFormData] = useState({
    salaryComponents: salaryData?.salaryComponents || [],
    pfContribution: salaryData?.pfContribution || {},
    taxDeductions: salaryData?.taxDeductions || [],
  });

  if (!salaryData) {
    return (
      <div className="h-screen bg-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-auto flex items-center justify-center`}>
          <div className="text-center">
            <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Salary details not found</p>
          </div>
        </div>
      </div>
    );
  }

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    console.log("Saving salary details:", formData);
    setIsEditMode(false);
    alert("Salary information updated successfully!");
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...formData.salaryComponents];
    updatedComponents[index][field] = value;
    
    // Auto-calculate percentage if amount changes
    if (field === "amount") {
      const totalSalary = updatedComponents.reduce((sum, comp) => sum + comp.amount, 0);
      updatedComponents[index].percentage = (value / totalSalary * 100).toFixed(2);
    }
    
    setFormData((prev) => ({
      ...prev,
      salaryComponents: updatedComponents,
    }));
  };

  const handleTaxChange = (index, field, value) => {
    const updatedTaxes = [...formData.taxDeductions];
    updatedTaxes[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      taxDeductions: updatedTaxes,
    }));
  };

  const handlePFChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      pfContribution: {
        ...prev.pfContribution,
        [field]: value,
      },
    }));
  };

  const totalEarnings = formData.salaryComponents.reduce(
    (sum, comp) => sum + comp.amount,
    0
  );
  const totalDeductions =
    formData.pfContribution.employee +
    formData.taxDeductions.reduce((sum, tax) => sum + tax.amount, 0);
  const calculatedNetSalary = totalEarnings - totalDeductions;

  return (
    <div className="h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-auto`}>
        {/* Header */}
        <div className="bg-white shadow-sm p-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/salary-management")}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Salary Information - {salaryData.name}
                </h1>
                <p className="text-sm text-gray-600">
                  View and update employee salary details
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditMode ? (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                  >
                    <FiCheck className="w-4 h-4" />
                    Save Changes
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
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* General Work Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              General Work Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Month Wage
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{salaryData.monthWage.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })} / Month
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Yearly Wage
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{salaryData.yearlyWage.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })} / Yearly
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  No of working days in a week
                </p>
                <p className="text-lg text-gray-900">{salaryData.workingDaysPerWeek}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Break Time
                </p>
                <p className="text-lg text-gray-900">{salaryData.breakTime}</p>
              </div>
            </div>
          </div>

          {/* Salary Components */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Salary Components
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {formData.salaryComponents.map((component, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    {component.name}
                  </p>

                  {isEditMode ? (
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-600">Amount</label>
                        <input
                          type="number"
                          value={component.amount}
                          onChange={(e) =>
                            handleComponentChange(idx, "amount", parseFloat(e.target.value))
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <p className="text-xs text-gray-600">
                        ₹/month {component.percentage.toFixed(2)} %
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                      ₹{component.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                        })}
                      </p>
                      <p className="text-xs text-gray-600">
                        ₹/month {component.percentage.toFixed(2)} %
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Gross Salary */}
            <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50 mb-6">
              <p className="text-sm font-medium text-gray-900 mb-2">Gross Salary</p>
              <p className="text-3xl font-bold text-blue-600">
                ₹{(totalEarnings / 100).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* Provident Fund Contribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Provident Fund (PF) Contribution
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-3">Employee</p>
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={formData.pfContribution.employee}
                      onChange={(e) =>
                        handlePFChange("employee", parseFloat(e.target.value))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <div>
                      <input
                        type="number"
                        value={formData.pfContribution.percentage}
                        onChange={(e) =>
                          handlePFChange("percentage", parseFloat(e.target.value))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <p className="text-xs text-gray-600 mt-1">%</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formData.pfContribution.employee}
                    </p>
                    <p className="text-xs text-gray-600">
                      ₹/month {formData.pfContribution.percentage}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tax Deductions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Tax Deductions
            </h2>

            <div className="space-y-4">
              {formData.taxDeductions.map((tax, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    {tax.name}
                  </p>

                  {isEditMode ? (
                    <input
                      type="number"
                      value={tax.amount}
                      onChange={(e) =>
                        handleTaxChange(idx, "amount", parseFloat(e.target.value))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{tax.amount}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">₹/month</p>
                </div>
              ))}
            </div>
          </div>

          {/* Net Salary */}
          <div className="border-2 border-blue-600 rounded-lg p-6 bg-blue-50">
            <p className="text-sm font-medium text-gray-900 mb-2">Net Salary</p>
            <p className="text-4xl font-bold text-blue-600">
              ₹{calculatedNetSalary.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
