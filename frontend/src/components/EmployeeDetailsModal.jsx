import { useState } from "react";
import { FiX, FiEdit2 } from "react-icons/fi";
import { getEmployeeDetails, getEmployeeSalaryInfo } from "../services/dummyData";

export default function EmployeeDetailsModal({ employeeId, onClose }) {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const employee = getEmployeeDetails(employeeId);
  const salaryInfo = getEmployeeSalaryInfo(employeeId);

  if (!employee) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save to backend
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Employee Details</h2>
            <p className="text-sm text-gray-500 mt-1">View and manage employee information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiX className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab("details");
              setIsEditing(false);
            }}
            className={`px-4 py-3 font-medium transition ${
              activeTab === "details"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => {
              setActiveTab("salary");
              setIsEditing(false);
            }}
            className={`px-4 py-3 font-medium transition ${
              activeTab === "salary"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Salary Info
          </button>
        </div>

        {/* Details Tab */}
        {activeTab === "details" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Employee Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <FiEdit2 className="w-4 h-4" />
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={employee.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    disabled={!isEditing}
                    defaultValue={employee.status}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "bg-white text-gray-900"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={employee.firstName}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={employee.lastName}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={employee.email}
                  disabled={!isEditing}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                    isEditing
                      ? "bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-50 text-gray-900"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={employee.phone}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    defaultValue={employee.department}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    defaultValue={employee.position}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hire Date
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    defaultValue={employee.joinDate}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}

        {/* Salary Tab */}
        {activeTab === "salary" && salaryInfo && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Salary Information - {employee.name}
              </h3>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                <FiEdit2 className="w-4 h-4" />
                Edit
              </button>
            </div>

            {/* General Work Information */}
            <div className="mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                General Work Information
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Month Wage</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₹{salaryInfo.monthWage.toLocaleString()} / Month
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Yearly Wage</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₹{salaryInfo.yearlyWage.toLocaleString()} / Yearly
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">No of working days in a week</p>
                  <p className="text-xl font-bold text-gray-900">{salaryInfo.workingDaysPerWeek}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Break Time</p>
                  <p className="text-xl font-bold text-gray-900">{salaryInfo.breakTime}</p>
                </div>
              </div>
            </div>

            {/* Salary Components */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Salary Components</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Basic Salary</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{salaryInfo.basicSalary.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {((salaryInfo.basicSalary / salaryInfo.grossSalary) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">House Rent Allowance (HRA)</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{salaryInfo.hra.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {((salaryInfo.hra / salaryInfo.grossSalary) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Standard Allowance</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{salaryInfo.standardAllowance.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {((salaryInfo.standardAllowance / salaryInfo.grossSalary) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-gray-600 mb-1">Performance Bonus</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{salaryInfo.performanceBonus.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {((salaryInfo.performanceBonus / salaryInfo.grossSalary) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <p className="text-sm text-gray-600 mb-1">Leave Travel Allowance (LTA)</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{salaryInfo.lta.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {((salaryInfo.lta / salaryInfo.grossSalary) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                  <p className="text-sm text-gray-600 mb-1">Fixed Allowance</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{salaryInfo.fixedAllowance.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {((salaryInfo.fixedAllowance / salaryInfo.grossSalary) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Gross Salary */}
              <div className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90 mb-1">Gross Salary</p>
                <p className="text-2xl font-bold">
                  ₹{salaryInfo.grossSalary.toLocaleString()} / Month
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
