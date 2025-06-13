import Task from '../models/Task.js';
import User from '../models/User.js';

export const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};

// export const getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({ user: req.user.id });
//     res.status(200).json(tasks);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
//   }
// };

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { user: req.user._id },
        { sharedWith: req.user._id }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};


export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};


// Other controllers (createTask, getTasks, etc.)

export const shareTask = async (req, res) => {
  const { email } = req.body;

  try {
    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $addToSet: { sharedWith: targetUser._id } },
      { new: true }
    );

    if (!task) {
      return res.status(403).json({ error: 'Not authorized to share this task' });
    }

    res.status(200).json({ message: 'Task shared successfully', task });
  } catch (err) {
    console.error('Error sharing task:', err);
    res.status(500).json({ error: 'Server error while sharing task' });
  }
};
