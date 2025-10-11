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
                                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="bg-transparent border border-destructive text-destructive hover:bg-destructive hover:text-white font-bold py-2 px-4 rounded shadow-lg shadow-destructive/50"
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