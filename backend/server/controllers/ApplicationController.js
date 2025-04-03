import Application from "../models/Application.js";

export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user._id });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addApplication = async (req, res) => {
    try {
        const application = await Application.create({
            ...req.body,
            userId: req.user._id,
        });
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { status: req.body.status },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
