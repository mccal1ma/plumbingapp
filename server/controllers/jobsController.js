import Job from "../models/Job.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";
import moment from "moment";

export const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query;

  const queryObject = {};

  // Only contractors see filtered jobs (assigned to them)
  if (req.user.role === "contractor") {
    queryObject.employeeAssigned = req.user.userId;
    queryObject.assignmentStatus = { $in: ["pending", "accepted"] };
  }
  // Admins and receptionists see ALL jobs (no filter)

  // Filter by status
  if (status && status !== "all") {
    queryObject.status = status;
  }

  // Filter by job type
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  // Search by customer name
  if (search) {
    queryObject.customerName = { $regex: search, $options: "i" };
  }

  let result = Job.find(queryObject)
    .populate("employeeAssigned", "firstName lastName email")
    .populate("rejectedBy", "firstName lastName email");

  // Sort
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("customerName");
  }
  if (sort === "z-a") {
    result = result.sort("-customerName");
  }

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject); // Add this line

  res.json({
    jobs,
    totalJobs,
    numOfPages: 1,
  });
};

export const createJob = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      status,
      jobType,
      location,
      date,
      description,
      employeeAssigned,
    } = req.body;

    console.log("Creating job with data:", req.body);

    if (!customerName || !customerPhone || !location || !date) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    // Determine assignmentStatus based on whether employee is assigned
    let assignmentStatus = "unassigned";
    if (employeeAssigned && employeeAssigned !== "") {
      assignmentStatus = "pending";
    }

    const job = await Job.create({
      customerName,
      customerPhone,
      status,
      jobType,
      location,
      date,
      description,
      employeeAssigned: employeeAssigned || null,
      assignmentStatus,
      createdBy: req.user.userId,
    });

    console.log("Job created successfully:", job._id);

    // Create notification if contractor is assigned
    if (employeeAssigned && assignmentStatus === "pending") {
      await Notification.create({
        jobId: job._id,
        userId: employeeAssigned,
        type: "job_assigned",
        message: `You have been assigned to a new job: ${customerName}`,
      });
      console.log("Notification created for contractor:", employeeAssigned);
    }

    const populatedJob = await Job.findById(job._id).populate(
      "employeeAssigned",
      "firstName lastName email",
    );

    res.status(201).json(populatedJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ msg: error.message || "Error creating job" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    let job;

    // Admins can update any job, receptionists only their own, contractors only assigned to them
    if (req.user.role === "admin") {
      job = await Job.findById(jobId);
    } else if (req.user.role === "contractor") {
      job = await Job.findOne({
        _id: jobId,
        employeeAssigned: req.user.userId,
        assignmentStatus: "accepted",
      });
    } else {
      job = await Job.findOne({
        _id: jobId,
        createdBy: req.user.userId,
      });
    }

    if (!job) {
      return res.status(404).json({ msg: "Job not found or not authorized" });
    }

    // Track if employee assignment changed
    const oldEmployeeAssigned = job.employeeAssigned?.toString();
    const newEmployeeAssigned = req.body.employeeAssigned;
    const oldStatus = job.status;
    const newStatus = req.body.status;

    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
      runValidators: true,
    }).populate("employeeAssigned", "firstName lastName email");

    // Create notification if employee was newly assigned or changed
    if (newEmployeeAssigned && newEmployeeAssigned !== oldEmployeeAssigned) {
      await Notification.create({
        jobId: updatedJob._id,
        userId: newEmployeeAssigned,
        type: "job_assigned",
        message: `You have been assigned to job: ${updatedJob.customerName}`,
      });

      // Update assignment status to pending and clear rejection data
      updatedJob.assignmentStatus = "pending";
      updatedJob.rejectionReason = "";
      updatedJob.rejectedBy = null;
      await updatedJob.save();
    }

    // Create notification if status changed to payment pending
    if (newStatus === "payment pending" && oldStatus !== "payment pending") {
      const contractor = await User.findById(req.user.userId).select("firstName lastName");
      await Notification.create({
        jobId: updatedJob._id,
        userId: job.createdBy,
        type: "job_assigned",
        message: `${contractor.firstName} ${contractor.lastName} changed ${updatedJob.customerName}'s "${updatedJob.description}" job to payment pending`,
      });
      console.log(`Notification created for receptionist about payment pending job ${jobId}`);
    }

    res.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ msg: error.message || "Error updating job" });
  }
};

export const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  let job;

  // Admins can delete any job, others only their own
  if (req.user.role === "admin") {
    job = await Job.findById(jobId);
  } else {
    job = await Job.findOne({
      _id: jobId,
      createdBy: req.user.userId,
    });
  }

  if (!job) {
    return res.status(404).json({ msg: "Job not found" });
  }

  await job.deleteOne();

  res.json({ msg: "Job removed" });
};

export const showStats = async (req, res) => {
  try {
    // Both admins and receptionists see all jobs
    let stats = await Job.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    stats = stats.reduce((acc, curr) => {
      const { _id: title, count } = curr;
      acc[title] = count;
      return acc;
    }, {});

    // Calculate total jobs excluding cancelled
    const totalJobs = (stats.active || 0) + 
                      (stats['in progress'] || 0) + 
                      (stats.completed || 0) + 
                      (stats['payment pending'] || 0);

    const defaultStats = {
      totalJobs: totalJobs,
      active: stats.active || 0,
      'in progress': stats['in progress'] || 0,
      completed: stats.completed || 0,
      'payment pending': stats['payment pending'] || 0,
      cancelled: stats.cancelled || 0,
    };

    let monthlyAppointments = await Job.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);

    monthlyAppointments = monthlyAppointments
      .map((item) => {
        const { _id: { year, month }, count } = item;
        const date = moment()
          .month(month - 1)
          .year(year)
          .format("MMM Y");
        return { date, count };
      })
      .reverse();

    res.status(200).json({ stats: defaultStats, monthlyAppointments });
  } catch (error) {
    console.error('showStats error:', error);
    res.status(500).json({ msg: 'Error fetching stats' });
  }
};

// Get list of all contractors
export const getContractorsList = async (req, res) => {
  try {
    const contractors = await User.find({ role: "contractor" }).select(
      "firstName lastName email",
    );

    res.status(200).json({ contractors });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Accept job (contractor only)
export const acceptJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    const job = await Job.findOne({
      _id: jobId,
      employeeAssigned: req.user.userId,
    });

    if (!job) {
      return res
        .status(404)
        .json({ msg: "Job not found or not assigned to you" });
    }

    if (job.assignmentStatus !== "pending") {
      return res.status(400).json({ msg: "Job is not in pending status" });
    }

    job.assignmentStatus = "accepted";
    await job.save();

    // Mark related notification as read
    const updateResult = await Notification.updateMany(
      {
        jobId: jobId,
        userId: req.user.userId,
        type: "job_assigned",
      },
      { isRead: true }
    );
    
    console.log(`Marked ${updateResult.modifiedCount} notifications as read for job ${jobId}`);

    const populatedJob = await Job.findById(jobId).populate(
      "employeeAssigned",
      "firstName lastName email",
    );

    res
      .status(200)
      .json({ job: populatedJob, msg: "Job accepted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Reject job (contractor only)
export const rejectJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { rejectionReason } = req.body;

    const job = await Job.findOne({
      _id: jobId,
      employeeAssigned: req.user.userId,
    });

    if (!job) {
      return res
        .status(404)
        .json({ msg: "Job not found or not assigned to you" });
    }

    if (job.assignmentStatus !== "pending") {
      return res.status(400).json({ msg: "Job is not in pending status" });
    }

    job.assignmentStatus = "rejected";
    job.rejectionReason = rejectionReason || "";
    job.rejectedBy = req.user.userId;
    await job.save();

    // Mark the original job_assigned notification as read
    await Notification.updateMany(
      {
        jobId: jobId,
        userId: req.user.userId,
        type: "job_assigned",
      },
      { isRead: true }
    );

    // Notify receptionist about rejection
    await Notification.create({
      jobId: job._id,
      userId: job.createdBy,
      type: "job_rejected",
      message: `Contractor rejected job: ${job.customerName}`,
      rejectionReason: rejectionReason || "",
    });

    const populatedJob = await Job.findById(jobId).populate(
      "employeeAssigned",
      "firstName lastName email",
    );

    res
      .status(200)
      .json({ job: populatedJob, msg: "Job rejected successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
