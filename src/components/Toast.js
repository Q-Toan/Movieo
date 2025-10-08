import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="text-green-500" size={24} />,
  error: <XCircle className="text-red-500" size={24} />,
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center gap-4 w-full max-w-sm p-4 bg-neutral-800 text-white rounded-2xl shadow-2xl border border-neutral-700`}
    >
      {icons[type]}
      <p className="flex-grow">{message}</p>
      <button onClick={onClose} className="text-neutral-400 hover:text-white">
        <X size={20} />
      </button>
    </motion.div>
  );
};

export default Toast;
