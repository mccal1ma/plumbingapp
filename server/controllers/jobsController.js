import Job from "../models/Job.js";

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("-createdAt");

  res.json({
    jobs,
    totalJobs: jobs.length,
    numOfPages: 1,
  });
};

export const createJob = async (req, res) => {
  const {
    customerName,
    status,
    jobType,
    location,
    date,
    description,
    employeeAssigned,
  } = req.body;

  if (!customerName || !location || !date) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  const job = await Job.create({
    customerName,
    status,
    jobType,
    location,
    date,
    description,
    employeeAssigned,
    createdBy: req.user.userId,
  });

  res.status(201).json(job);
};

export const updateJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: req.user.userId,
  });

  if (!job) {
    return res.status(404).json({ msg: "Job not found" });
  }

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.json(updatedJob);
};

export const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: req.user.userId,
  });

  if (!job) {
    return res.status(404).json({ msg: "Job not found" });
  }

  await job.deleteOne();

  res.json({ msg: "Job removed" });
};
