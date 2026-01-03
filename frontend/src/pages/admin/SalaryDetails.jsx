import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import { getEmployeeSalaryDetails } from "../../services/dummyData";
import { FiArrowLeft, FiEdit2, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

export default function SalaryDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employeeId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load initial data from dummy service
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
    if (user?.role === "admin") {
      setIsEditMode(!isEditMode);
    } else {
      alert("You do not have permission to edit salary information");
    }
  };

  const handleSave = () => {
    // In a real app, you'd call an API here. 
    // Since we are using dummy data, we just update the local state and exit edit mode.
    setIsEditMode(false);
    alert("Salary information updated successfully (Local Session)!");
  };

  const handleCancel = () => {
    // Reset to original data
    setFormData({
      salaryComponents: salaryData.salaryComponents,
      pfContribution: salaryData.pfContribution,
      taxDeductions: salaryData.taxDeductions,
    });
    setIsEditMode(false);
  };

  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...formData.salaryComponents];
    // Ensure value is a number to prevent .toFixed() crashes
    const numValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    
    updatedComponents[index][field] = numValue;
    
    // Recalculate percentages for all components based on the new total
    const totalSalary = updatedComponents.reduce((sum, comp) => sum + comp.amount, 0);
    
    updatedComponents.forEach((comp) => {
      comp.percentage = totalSalary > 0 ? (comp.amount / totalSalary) * 100 : 0;
    });
    
    setFormData((prev) => ({
      ...prev,
      salaryComponents: updatedComponents,
    }));
  };

  const handleTaxChange = (index, field, value) => {
    const updatedTaxes = [...formData.taxDeductions];
    updatedTaxes[index][field] = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
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
        [field]: isNaN(parseFloat(value)) ? 0 : parseFloat(value),
      },
    }));
  };

  // Calculations for display
  const totalEarnings = formData.salaryComponents.reduce((sum, comp) => sum + comp.amount, 0);
  const totalDeductions =
    (formData.pfContribution.employee || 0) +
    formData.taxDeductions.reduce((sum, tax) => sum + (tax.amount || 0), 0);
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
                <p className="text-sm text-gray-600">View and update employee salary details</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditMode ? (
                user?.role === "admin" && (
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    <FiEdit2 className="w-4 h-4" /> Edit
                  </button>
                )
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                  >
                    <FiCheck className="w-4 h-4" /> Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                  >
                    <FiX className="w-4 h-4" /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* General Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">General Work Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Month Wage</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Yearly Wage</p>
                <p className="text-2xl font-bold text-gray-900">₹{(totalEarnings * 12).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          {/* Salary Components */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Salary Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {formData.salaryComponents.map((component, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <p className="text-sm font-medium text-gray-900 mb-3">{component.name}</p>
                  {isEditMode ? (
                    <div className="space-y-2">
                      <label className="text-xs text-gray-600">Amount (₹)</label>
                      <input
                        type="number"
                        value={component.amount}
                        onChange={(e) => handleComponentChange(idx, "amount", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <p className="text-xs text-blue-600 font-semibold">
                        {Number(component.percentage || 0).toFixed(2)} % of Gross
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-gray-900">₹{component.amount.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-gray-600">{Number(component.percentage || 0).toFixed(2)} %</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50">
              <p className="text-sm font-medium text-gray-900 mb-2">Gross Salary</p>
              <p className="text-3xl font-bold text-blue-600">₹{totalEarnings.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* PF Contribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Provident Fund (PF)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-3">Employee Contribution</p>
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={formData.pfContribution.employee}
                      onChange={(e) => handlePFChange("employee", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-gray-900">₹{formData.pfContribution.employee?.toLocaleString("en-IN")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tax Deductions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Tax Deductions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.taxDeductions.map((tax, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-3">{tax.name}</p>
                  {isEditMode ? (
                    <input
                      type="number"
                      value={tax.amount}
                      onChange={(e) => handleTaxChange(idx, "amount", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">₹{tax.amount?.toLocaleString("en-IN")}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Net Salary Summary */}
          <div className="border-2 border-green-600 rounded-lg p-6 bg-green-50">
            <p className="text-sm font-medium text-gray-900 mb-2">Take Home (Net Salary)</p>
            <p className="text-4xl font-bold text-green-600">₹{calculatedNetSalary.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}