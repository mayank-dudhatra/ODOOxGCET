import Leave from "../models/Leave.js";
import User from "../models/User.js";

// Apply for leave
export const applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { leaveType, startDate, endDate, reason } = req.body;

    // Validation
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // For sick leave, document is required
    if (leaveType.toLowerCase() === "sick" && !req.file) {
      return res.status(400).json({ error: "Document is required for Sick Leave" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ error: "Start date must be before end date" });
    }

    // Check for overlapping leaves
    const overlappingLeaves = await Leave.find({
      userId,
      status: { $in: ["pending", "approved"] },
      $or: [
        // New leave starts during existing leave
        { startDate: { $lte: end }, endDate: { $gte: start } },
        // Existing leave starts during new leave
        { startDate: { $gte: start, $lte: end } },
        // New leave is completely within existing leave
        { startDate: { $lte: start }, endDate: { $gte: end } }
      ]
    });

    if (overlappingLeaves.length > 0) {
      const existingLeave = overlappingLeaves[0];
      return res.status(400).json({ 
        error: `You already have a ${existingLeave.status} leave from ${new Date(existingLeave.startDate).toLocaleDateString("en-IN")} to ${new Date(existingLeave.endDate).toLocaleDateString("en-IN")}. Cannot apply for overlapping dates.` 
      });
    }

    // Calculate days
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Create leave request
    const leave = new Leave({
      userId,
      leaveType: leaveType.toLowerCase(),
      startDate: start,
      endDate: end,
      reason,
      status: "pending",
    });

    // Add document if provided
    if (req.file) {
      leave.document = {
        filename: req.file.originalname,
        data: req.file.buffer,
        contentType: req.file.mimetype,
        uploadedAt: new Date(),
      };
    }

    await leave.save();

    // Populate user details
    await leave.populate("userId", "name loginId email");

    res.status(201).json({
      message: "Leave request submitted successfully",
      leave: {
        id: leave._id,
        type: leaveType,
        fromDate: start.toLocaleDateString("en-IN"),
        toDate: end.toLocaleDateString("en-IN"),
        days,
        reason,
        status: "Pending",
        appliedOn: leave.createdAt.toLocaleDateString("en-IN"),
        hasDocument: !!req.file,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get my leaves
export const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;

    const leaves = await Leave.find({ userId }).sort({ createdAt: -1 });

    // Calculate leave balance
    const leaveTypes = ["sick", "casual", "earned", "unpaid"];
    const leaveBalance = {
      totalLeaves: 18,
      usedLeaves: 0,
      remainingLeaves: 18,
      leaveTypes: [
        { type: "Sick Leave", total: 5, used: 0, remaining: 5 },
        { type: "Casual Leave", total: 8, used: 0, remaining: 8 },
        { type: "Earned Leave", total: 5, used: 0, remaining: 5 },
      ],
    };

    // Calculate used leaves for each type
    leaves.forEach((leave) => {
      if (leave.status === "approved") {
        const days = Math.ceil(
          (new Date(leave.endDate) - new Date(leave.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1;

        const typeLabel =
          leave.leaveType.charAt(0).toUpperCase() +
          leave.leaveType.slice(1) +
          " Leave";
        const typeObj = leaveBalance.leaveTypes.find((t) => t.type === typeLabel);

        if (typeObj) {
          typeObj.used += days;
          typeObj.remaining = typeObj.total - typeObj.used;
        }

        leaveBalance.usedLeaves += days;
      }
    });

    leaveBalance.remainingLeaves = leaveBalance.totalLeaves - leaveBalance.usedLeaves;

    // Format leave requests
    const leaveRequests = leaves.map((leave) => {
      const days =
        Math.ceil(
          (new Date(leave.endDate) - new Date(leave.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      const typeLabel =
        leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1) + " Leave";
      const statusLabel =
        leave.status.charAt(0).toUpperCase() + leave.status.slice(1);

      return {
        id: leave._id,
        type: typeLabel,
        fromDate: new Date(leave.startDate).toLocaleDateString("en-IN"),
        toDate: new Date(leave.endDate).toLocaleDateString("en-IN"),
        days,
        reason: leave.reason,
        status: statusLabel,
        appliedOn: leave.createdAt.toLocaleDateString("en-IN"),
        approvedBy: leave.approvedBy ? "Manager" : null,
        rejectionReason: null,
      };
    });

    res.json({
      leaveBalance,
      leaveRequests,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all leaves (for admin/managers)
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("userId", "name loginId email department")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 });

    // Map leave types to display names
    const leaveTypeMap = {
      sick: "Sick Leave",
      casual: "Casual Leave",
      earned: "Earned Leave",
      unpaid: "Unpaid Leave",
    };

    const formattedLeaves = leaves.map((leave) => {
      const days =
        Math.ceil(
          (new Date(leave.endDate) - new Date(leave.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      const typeLabel = leaveTypeMap[leave.leaveType] || leave.leaveType;
      const statusLabel =
        leave.status.charAt(0).toUpperCase() + leave.status.slice(1);

      return {
        id: leave._id,
        employeeName: leave.userId.name,
        employeeId: leave.userId.loginId,
        department: leave.userId.department || "N/A",
        leaveType: typeLabel,
        startDate: new Date(leave.startDate).toLocaleDateString("en-IN"),
        endDate: new Date(leave.endDate).toLocaleDateString("en-IN"),
        days,
        reason: leave.reason,
        status: statusLabel,
        appliedOn: leave.createdAt.toLocaleDateString("en-IN"),
        approvedBy: leave.approvedBy ? leave.approvedBy.name : null,
        hasDocument: !!leave.document,
      };
    });

    res.json(formattedLeaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve leave
export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status: "approved", approvedBy: managerId },
      { new: true }
    ).populate("userId", "name email");

    if (!leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    res.json({
      message: "Leave approved successfully",
      leave: {
        id: leave._id,
        status: "Approved",
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject leave
export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status: "rejected", approvedBy: null },
      { new: true }
    ).populate("userId", "name email");

    if (!leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    res.json({
      message: "Leave rejected successfully",
      leave: {
        id: leave._id,
        status: "Rejected",
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Download leave document
export const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    if (!leave.document || !leave.document.data) {
      return res.status(404).json({ error: "No document attached to this leave request" });
    }

    // Set response headers
    res.setHeader("Content-Type", leave.document.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${leave.document.filename}"`);
    
    // Send the buffer data
    res.send(leave.document.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
