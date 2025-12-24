import Log from '../models/Log.js';

export const logAction = async (req, action, entity, entityId, details = {}) => {
    try {
        await Log.create({
            admin: req.user._id,
            action,
            entity,
            entityId,
            details,
            ip: req.ip
        });
    } catch (error) {
        console.error('Logging failed:', error);
    }
};
