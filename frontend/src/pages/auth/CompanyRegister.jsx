import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Upload, Check } from "lucide-react";

export default function CompanyRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    logo: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check password strength
    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData({
          ...formData,
          logo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate
    if (!formData.companyName.trim()) {
      setError("Company name is required");
      setLoading(false);
      return;
    }
    if (!formData.adminName.trim()) {
      setError("Admin name is required");
      setLoading(false);
      return;
    }
    if (!formData.companyEmail.includes("@")) {
      setError("Invalid company email");
      setLoading(false);
      return;
    }
    if (!formData.adminEmail.includes("@")) {
      setError("Invalid admin email");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/company/register", formData);

      setLoginId(response.data.loginId);
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Success Modal
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600">Company registered successfully</p>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5 mb-6">
            <p className="text-sm text-gray-600 mb-3 font-semibold">Your Admin Login ID:</p>
            <p className="text-3xl font-bold text-green-600 font-mono mb-2 tracking-wider">{loginId}</p>
            <p className="text-xs text-gray-500">📌 Save this ID for login</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              ℹ️ You will be redirected to login page shortly...
            </p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  }

  // Registration Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                🏢
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Register</h1>
            <p className="text-gray-500">Create a new account to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Company Name & Admin Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="e.g., Odoo India"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <p className="text-xs text-gray-500 mt-1">Login ID will be auto-generated using company name</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="adminName"
                  placeholder="Your full name"
                  value={formData.adminName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Row 2: Company Logo & Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Logo <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer block">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-600 mb-1">Upload Logo</p>
                    <p className="text-xs text-gray-500">Recommended: Square image, max 2MB</p>
                  </label>
                </div>
                {logoPreview && (
                  <div className="mt-3 flex items-center">
                    <img src={logoPreview} alt="Logo" className="w-10 h-10 rounded object-cover" />
                    <span className="ml-2 text-sm text-green-600">✓ Logo uploaded</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="adminEmail"
                  placeholder="admin@company.com"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Row 3: Company Email & Admin Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Email
                </label>
                <input
                  type="email"
                  name="companyEmail"
                  placeholder="info@company.com"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="adminPhone"
                  placeholder="+1234567890"
                  value={formData.adminPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Row 4: Company Phone (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Phone <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="tel"
                name="companyPhone"
                placeholder="+1234567890"
                value={formData.companyPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Row 5: Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= passwordStrength ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters with uppercase, number, and special character
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {formData.password && formData.confirmPassword && (
                  <div className="mt-2">
                    {formData.password === formData.confirmPassword ? (
                      <p className="text-xs text-green-600 flex items-center">
                        <Check className="w-4 h-4 mr-1" /> Passwords match
                      </p>
                    ) : (
                      <p className="text-xs text-red-600">Passwords do not match</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Login Here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
