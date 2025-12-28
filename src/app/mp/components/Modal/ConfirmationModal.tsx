"use client";

import { ConfirmationModalProps } from "@/types";

const ConfirmationModal = ({ isOpen, onClose, onConfirm }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-white w-full max-w-md mx-4 rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-logo-primary/10 text-logo-primary flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.75 5.25a.75.75 0 1 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm-.75 9a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-neutral-800">
                Leave quiz?
              </h3>
              <p className="mt-1 text-sm text-gray-700">
                Your quiz attempt will be cancelled and your progress will not be saved.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-white flex justify-end gap-3">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg border border-red-600 text-red-700 hover:text-white hover:bg-red-700 transition-colors"
          >
            Leave
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-white bg-logo-primary dark:hover:bg-logo-primary-gradient transition-colors"
          >
            Stay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

// "use client";

// import {ConfirmationModalProps} from "@/types";

// const ConfirmationModal = ({isOpen, onClose, onConfirm}: ConfirmationModalProps) => {
//   if (!isOpen) return null;

//   return (

//   );
// };

// export default ConfirmationModal;
