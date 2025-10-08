import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertDialog = ({ isOpen, onClose, onConfirm, title, description }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="bg-neutral-800 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
                        <p className="text-neutral-300 mb-8">{description}</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AlertDialog;