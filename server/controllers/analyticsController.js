import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';


export const getJobStatusBreakdown = async (req, res) => {
  const stats = await Job.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const total = stats.reduce((acc, curr) => acc + curr.count, 0);
  const breakdown = stats.map((stat) => ({
    status: stat._id,
    count: stat.count,
    percentage: ((stat.count / total) * 100).toFixed(1),
  }));

  res.status(StatusCodes.OK).json({ breakdown });
};

export const getContractorWorkload = async (req, res) => {
  const workload = await Job.aggregate([
    {
      $match: { employeeAssigned: { $ne: null } },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'employeeAssigned',
        foreignField: '_id',
        as: 'contractor',
      },
    },
    { $unwind: '$contractor' },
    {
      $group: {
        _id: '$employeeAssigned',
        contractorName: { 
          $first: { 
            $concat: ['$contractor.firstName', ' ', '$contractor.lastName'] 
          } 
        },
        totalJobs: { $sum: 1 },
        accepted: {
          $sum: { $cond: [{ $eq: ['$assignmentStatus', 'accepted'] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$assignmentStatus', 'pending'] }, 1, 0] },
        },
        rejected: {
          $sum: { $cond: [{ $eq: ['$assignmentStatus', 'rejected'] }, 1, 0] },
        },
      },
    },
    { $sort: { totalJobs: -1 } },
  ]);

  res.status(StatusCodes.OK).json({ workload });
};

export const getJobsByDate = async (req, res) => {
  const jobs = await Job.find({ date: { $ne: null, $exists: true } });
  
  // Group jobs by date string
  const jobsByDate = jobs.reduce((acc, job) => {
    // date is stored as string, extract just the date part (YYYY-MM-DD)
    const dateStr = job.date.split('T')[0]; // handles both 'YYYY-MM-DD' and ISO format
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  res.status(StatusCodes.OK).json({ jobsByDate });
};

export const getAssignmentStatusBreakdown = async (req, res) => {
  const stats = await Job.aggregate([
    { $match: { employeeAssigned: { $ne: null } } },
    { $group: { _id: '$assignmentStatus', count: { $sum: 1 } } },
  ]);

  const total = stats.reduce((acc, curr) => acc + curr.count, 0);
  const breakdown = stats.map((stat) => ({
    status: stat._id,
    count: stat.count,
    percentage: total > 0 ? ((stat.count / total) * 100).toFixed(1) : 0,
  }));

  res.status(StatusCodes.OK).json({ breakdown });
};

export const getJobsForDate = async (req, res) => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Date is required' });
  }

  try {
    // Since date is stored as string, match based on string prefix
    const jobs = await Job.find({
      date: { $regex: `^${date}` } // Matches dates starting with YYYY-MM-DD
    })
    .populate('employeeAssigned', 'firstName lastName email')
    .sort({ date: 1 });

    res.status(StatusCodes.OK).json({ jobs });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Error fetching jobs' });
  }
};


/* export const getJobsByDate = async (req, res) => {
  const jobs = await Job.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        count: { $sum: 1 },
      },
    },
  ]);

  const jobsByDate = jobs.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  res.status(StatusCodes.OK).json({ jobsByDate });
}; */
