import Payroll from "../models/Payroll.js";
import User from "../models/User.js";

// Create a simple payroll statement using the user's base salary
const buildSalaryStatement = (baseSalary, overrides = {}) => {
  const basicSalary = Math.max(0, overrides.basicSalary ?? baseSalary ?? 0);
  const hra = overrides.hra ?? Math.round(basicSalary * 0.4);
  const da = overrides.da ?? Math.round(basicSalary * 0.1);
  const allowances = overrides.allowances ?? Math.round(basicSalary * 0.15);
  const totalEarnings = overrides.totalEarnings ?? basicSalary + hra + da + allowances;

  const pfContribution = overrides.pfContribution ?? Math.round(basicSalary * 0.12);
  const tds = overrides.tds ?? Math.round(basicSalary * 0.05);
  const otherDeductions = overrides.otherDeductions ?? Math.round(basicSalary * 0.02);
  const totalDeductions = overrides.totalDeductions ?? pfContribution + tds + otherDeductions;

  const netSalary = overrides.netSalary ?? Math.max(totalEarnings - totalDeductions, 0);

  return {
    basicSalary,
    hra,
    da,
    allowances,
    totalEarnings,
    pfContribution,
    tds,
    otherDeductions,
    totalDeductions,
    netSalary,
  };
};

const normalizePeriod = (month, year) => {
  const now = new Date();
  const targetYear = Number(year) || now.getFullYear();
  const monthNames = [
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
  const targetMonth =
    month && monthNames.includes(month)
      ? month
      : monthNames[now.getMonth()];

  const periodKey = `${targetYear}-${String(monthNames.indexOf(targetMonth) + 1).padStart(2, "0")}`;

  return { targetMonth, targetYear, periodKey };
};

export const getMyPayroll = async (req, res) => {
  try {
    const { month, year } = req.query;
    const { targetMonth, targetYear, periodKey } = normalizePeriod(month, year);

    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If a payroll record exists for the period, use its overrides; otherwise derive from base salary
    const payrollRecord = await Payroll.findOne({ userId: user._id, month: periodKey }).lean();
    const statement = buildSalaryStatement(user.salary, {
      basicSalary: payrollRecord?.baseSalary,
      allowances: payrollRecord?.allowances,
      totalDeductions: payrollRecord?.deductions,
      netSalary: payrollRecord?.netSalary,
    });

    res.json({
      month: targetMonth,
      year: targetYear,
      employee: {
        id: user._id,
        employeeId: user.loginId,
        name: user.name,
        department: user.department || "Not set",
        position: user.position || "Not set",
        basicSalary: statement.basicSalary,
        ctc: statement.basicSalary * 12,
      },
      statement,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPayroll = async (req, res) => {
  try {
    const { month, year } = req.query;
    const { targetMonth, targetYear, periodKey } = normalizePeriod(month, year);

    const users = await User.find({ companyId: req.user.companyId }).lean();
    const payrolls = await Promise.all(
      users.map(async (user) => {
        const payrollRecord = await Payroll.findOne({ userId: user._id, month: periodKey }).lean();
        const statement = buildSalaryStatement(user.salary, {
          basicSalary: payrollRecord?.baseSalary,
          allowances: payrollRecord?.allowances,
          totalDeductions: payrollRecord?.deductions,
          netSalary: payrollRecord?.netSalary,
        });

        return {
          userId: user._id,
          employeeId: user.loginId,
          name: user.name,
          department: user.department || "Not set",
          position: user.position || "Not set",
          month: targetMonth,
          year: targetYear,
          statement,
          ctc: statement.basicSalary * 12,
          status: payrollRecord?.status || "pending",
        };
      })
    );

    res.json({ month: targetMonth, year: targetYear, payrolls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePayroll = async (req, res) => {
  try {
    const { empId } = req.params;
    const { month, year, baseSalary, allowances, deductions, netSalary, status } = req.body;
    const { targetMonth, targetYear, periodKey } = normalizePeriod(month, year);

    const user = await User.findOne({ $or: [{ _id: empId }, { loginId: empId }] });
    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const normalizedBase = baseSalary ?? user.salary ?? 0;
    const normalizedAllowances = allowances ?? 0;
    const normalizedDeductions = deductions ?? 0;
    const normalizedNet =
      netSalary ?? normalizedBase + normalizedAllowances - normalizedDeductions;

    let payroll = await Payroll.findOne({ userId: user._id, month: periodKey });
    if (!payroll) {
      payroll = new Payroll({
        userId: user._id,
        month: periodKey,
        baseSalary: normalizedBase,
      });
    }

    payroll.baseSalary = normalizedBase;
    payroll.allowances = normalizedAllowances;
    payroll.deductions = normalizedDeductions;
    payroll.netSalary = normalizedNet;
    if (status) {
      payroll.status = status;
    }

    await payroll.save();

    res.json({
      message: "Payroll updated successfully",
      payroll,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
