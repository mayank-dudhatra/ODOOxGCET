import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import { FiEdit2, FiSave, FiX, FiCamera, FiMail, FiPhone, FiMapPin, FiUser, FiLock, FiSettings } from "react-icons/fi";

export default function Settings() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(user?.role === "admin" ? "company" : "holidays");

  // Company Information State
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "WorkZen",
    email: "admin@workzen.com",
    phone: "+1234567890",
    address: "123 Main Street, City, State",
    website: "www.workzen.com",
    taxId: "TAX123456789",
    registrationNumber: "REG987654321",
  });

  // Personal Information State
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalData, setPersonalData] = useState({
    employeeId: "WOJODO20230001",
    firstName: "John",
    lastName: "Doe",
    email: "admin@workzen.com",
    phone: "+1234567890",
    dateOfBirth: "1989-12-31",
    gender: "Male",
    nationality: "Indian",
    address: "123 Main Street, City, State",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
  });

  // Security State
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // System Settings State
  const [isEditingSystem, setIsEditingSystem] = useState(false);
  const [systemData, setSystemData] = useState({
    companyName: "WorkZen",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24-hour",
    currency: "INR",
    timezone: "Asia/Kolkata",
    language: "English",
    weekStart: "Monday",
  });

  const handleCompanySave = () => {
    console.log("Saving company data:", companyData);
    setIsEditingCompany(false);
    alert("Company information updated successfully!");
  };

  const handlePersonalSave = () => {
    console.log("Saving personal data:", personalData);
    setIsEditingPersonal(false);
    alert("Personal information updated successfully!");
  };

  const handleSecuritySave = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (securityData.newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }
    console.log("Changing password");
    setIsEditingSecurity(false);
    setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    alert("Password changed successfully!");
  };

  const handleSystemSave = () => {
    console.log("Saving system settings:", systemData);
    setIsEditingSystem(false);
    alert("System settings updated successfully!");
  };

  const tabs = [
    { id: "company", label: "Company Info", icon: FiSettings, roles: ["admin"] },
    { id: "personal", label: "Personal Info", icon: FiUser, roles: ["admin"] },
    { id: "roles", label: "Roles & Permissions", icon: FiSettings, roles: ["admin"] },
    { id: "holidays", label: "Holidays & Policies", icon: FiSettings, roles: ["admin", "hr"] },
    { id: "security", label: "Security", icon: FiLock, roles: ["admin", "hr"] },
    { id: "system", label: "System Settings", icon: FiSettings, roles: ["admin"] },
  ];

  const visibleTabs = tabs.filter(tab => tab.roles.includes(user?.role));

  return (
    <div className="h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-auto`}>
        {/* Header */}
        <div className="bg-white shadow-sm p-6 sticky top-0 z-30">
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your company information, personal details, and system settings
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-8 px-6">
                {visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 border-b-2 transition ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Company Information Tab */}
            {activeTab === "company" && user?.role === "admin" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Company Information</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Update your company's basic information and contact details
                    </p>
                  </div>
                  {!isEditingCompany ? (
                    <button
                      onClick={() => setIsEditingCompany(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCompanySave}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      >
                        <FiSave className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingCompany(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition"
                      >
                        <FiX className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Company Logo */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                      {companyData.name.substring(0, 2).toUpperCase()}
                    </div>
                    {isEditingCompany && (
                      <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                        <FiCamera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{companyData.name}</h3>
                    <p className="text-sm text-gray-600">Company Logo</p>
                  </div>
                </div>

                {/* Company Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyData.name}
                      onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                      disabled={!isEditingCompany}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={companyData.email}
                      onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                      disabled={!isEditingCompany}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                      disabled={!isEditingCompany}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      value={companyData.website}
                      onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                      disabled={!isEditingCompany}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={companyData.address}
                      onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                      disabled={!isEditingCompany}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax ID
                    </label>
                    <input
                      type="text"
                      value={companyData.taxId}
                      onChange={(e) => setCompanyData({ ...companyData, taxId: e.target.value })}
                      disabled={!isEditingCompany}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={companyData.registrationNumber}
                      onChange={(e) =>
                        setCompanyData({ ...companyData, registrationNumber: e.target.value })
                      }
                      disabled={!isEditingCompany}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Update your personal information and preferences
                    </p>
                  </div>
                  {!isEditingPersonal ? (
                    <button
                      onClick={() => setIsEditingPersonal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handlePersonalSave}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      >
                        <FiSave className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingPersonal(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition"
                      >
                        <FiX className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Picture */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                      {personalData.firstName.charAt(0)}
                      {personalData.lastName.charAt(0)}
                    </div>
                    {isEditingPersonal && (
                      <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                        <FiCamera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {personalData.firstName} {personalData.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{personalData.email}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {personalData.employeeId}</p>
                  </div>
                </div>

                {/* Personal Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={personalData.employeeId}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={personalData.email}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, email: e.target.value })
                      }
                      disabled={!isEditingPersonal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={personalData.firstName}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, firstName: e.target.value })
                      }
                      disabled={!isEditingPersonal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={personalData.lastName}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, lastName: e.target.value })
                      }
                      disabled={!isEditingPersonal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={personalData.phone}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, phone: e.target.value })
                      }
                      disabled={!isEditingPersonal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={personalData.dateOfBirth}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, dateOfBirth: e.target.value })
                      }
                      disabled={!isEditingPersonal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={personalData.gender}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, gender: e.target.value })
                      }
                      disabled={!isEditingPersonal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={personalData.nationality}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, nationality: e.target.value })
                      }
                      disabled={!isEditingPersonal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={personalData.address}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, address: e.target.value })
                      }
                      disabled={!isEditingPersonal}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={personalData.city}
                      onChange={(e) => setPersonalData({ ...personalData, city: e.target.value })}
                      disabled={!isEditingPersonal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={personalData.state}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, state: e.target.value })
                      }
                      disabled={!isEditingPersonal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={personalData.zipCode}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, zipCode: e.target.value })
                      }
                      disabled={!isEditingPersonal}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Roles & Permissions Tab */}
            {activeTab === "roles" && user?.role === "admin" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Roles & Permissions</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage user roles and their permissions
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Admin Role */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Manage company information</span>
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Manage users and roles</span>
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">View all employee data</span>
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Manage payroll and salary</span>
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* HR Role */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">HR</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">View employee data</span>
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Manage attendance</span>
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Approve leave requests</span>
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">View payroll information</span>
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Employee Role */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">View own profile</span>
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Mark attendance</span>
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Apply for leave</span>
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">View own salary</span>
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Holidays & Policies Tab */}
            {activeTab === "holidays" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Holidays & Policies</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage company holidays and HR policies
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Public Holidays */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Public Holidays 2026</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Republic Day</span>
                        <span className="text-sm font-medium text-gray-900">January 26</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Independence Day</span>
                        <span className="text-sm font-medium text-gray-900">August 15</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Gandhi Jayanti</span>
                        <span className="text-sm font-medium text-gray-900">October 2</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Christmas</span>
                        <span className="text-sm font-medium text-gray-900">December 25</span>
                      </div>
                    </div>
                  </div>

                  {/* Leave Policies */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Policies</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Casual Leave (Annual)</span>
                        <span className="text-sm font-medium text-gray-900">12 days</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Sick Leave (Annual)</span>
                        <span className="text-sm font-medium text-gray-900">7 days</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Earned Leave (Annual)</span>
                        <span className="text-sm font-medium text-gray-900">20 days</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Maternity Leave</span>
                        <span className="text-sm font-medium text-gray-900">90 days</span>
                      </div>
                    </div>
                  </div>

                  {/* Work Policies */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Policies</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Working Hours (Daily)</span>
                        <span className="text-sm font-medium text-gray-900">9:00 AM - 5:30 PM</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Break Time</span>
                        <span className="text-sm font-medium text-gray-900">1 hour</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Week Days</span>
                        <span className="text-sm font-medium text-gray-900">Monday - Friday</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Late Arrival Penalty</span>
                        <span className="text-sm font-medium text-gray-900">After 10:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                    <p className="text-sm text-gray-600 mt-1">Update your password and security preferences</p>
                  </div>
                </div>

                <div className="max-w-2xl">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>Password Requirements:</strong> Minimum 6 characters, include uppercase, lowercase, numbers, and special characters
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={securityData.currentPassword}
                        onChange={(e) =>
                          setSecurityData({ ...securityData, currentPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) =>
                          setSecurityData({ ...securityData, newPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) =>
                          setSecurityData({ ...securityData, confirmPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button
                      onClick={handleSecuritySave}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings Tab */}
            {activeTab === "system" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Configure system preferences and default settings
                    </p>
                  </div>
                  {!isEditingSystem ? (
                    <button
                      onClick={() => setIsEditingSystem(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSystemSave}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      >
                        <FiSave className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingSystem(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition"
                      >
                        <FiX className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select
                      value={systemData.dateFormat}
                      onChange={(e) =>
                        setSystemData({ ...systemData, dateFormat: e.target.value })
                      }
                      disabled={!isEditingSystem}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Format
                    </label>
                    <select
                      value={systemData.timeFormat}
                      onChange={(e) =>
                        setSystemData({ ...systemData, timeFormat: e.target.value })
                      }
                      disabled={!isEditingSystem}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    >
                      <option value="12-hour">12-hour (AM/PM)</option>
                      <option value="24-hour">24-hour</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={systemData.currency}
                      onChange={(e) => setSystemData({ ...systemData, currency: e.target.value })}
                      disabled={!isEditingSystem}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={systemData.timezone}
                      onChange={(e) => setSystemData({ ...systemData, timezone: e.target.value })}
                      disabled={!isEditingSystem}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="America/New_York">America/New York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={systemData.language}
                      onChange={(e) => setSystemData({ ...systemData, language: e.target.value })}
                      disabled={!isEditingSystem}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Week Starts On
                    </label>
                    <select
                      value={systemData.weekStart}
                      onChange={(e) => setSystemData({ ...systemData, weekStart: e.target.value })}
                      disabled={!isEditingSystem}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Sunday">Sunday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
