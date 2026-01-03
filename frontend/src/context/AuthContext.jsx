import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getPermissions } from "../config/permissions";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // User authentication state
  const [user, setUser] = useState(null);
  
  // Permissions for the current user
  const [permissions, setPermissions] = useState({});
  
  // Global shared company data (Single Source of Truth)
  const [companyData, setCompanyData] = useState({
    employees: [],
    attendance: [],
    leaves: [],
    payroll: [],
    departments: [],
  });

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Set permissions based on role
      setPermissions(getPermissions(userData.role));
    }
  }, []);

  // Login function - sets user and permissions
  const login = useCallback((userData) => {
    setUser(userData);
    setPermissions(getPermissions(userData.role));
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setPermissions({});
    setCompanyData({
      employees: [],
      attendance: [],
      leaves: [],
      payroll: [],
      departments: [],
    });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  // Update global company data (ANY ROLE can update, all see the same data)
  const updateCompanyData = useCallback((dataType, newData) => {
    setCompanyData((prevData) => ({
      ...prevData,
      [dataType]: newData,
    }));
  }, []);

  // Add item to company data (for create operations)
  const addCompanyData = useCallback((dataType, item) => {
    setCompanyData((prevData) => ({
      ...prevData,
      [dataType]: [...(prevData[dataType] || []), item],
    }));
  }, []);

  // Remove item from company data (for delete operations)
  const removeCompanyData = useCallback((dataType, itemId) => {
    setCompanyData((prevData) => ({
      ...prevData,
      [dataType]: (prevData[dataType] || []).filter((item) => item._id !== itemId && item.id !== itemId),
    }));
  }, []);

  // Update single item in company data (for update operations)
  const updateCompanyItem = useCallback((dataType, itemId, updates) => {
    setCompanyData((prevData) => ({
      ...prevData,
      [dataType]: (prevData[dataType] || []).map((item) => 
        (item._id === itemId || item.id === itemId) 
          ? { ...item, ...updates }
          : item
      ),
    }));
  }, []);

  const value = {
    // Authentication
    user,
    login,
    logout,
    
    // Permissions (single source of truth)
    permissions,
    
    // Global shared data (Admin and HR both read/write to this)
    companyData,
    updateCompanyData,
    addCompanyData,
    removeCompanyData,
    updateCompanyItem,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

