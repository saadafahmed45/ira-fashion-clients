import React from "react";

export const ConfirmDialog = ({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDangerous = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100] p-4 animate-fadeIn">
      <div className="bg-white rounded-md p-6 max-w-sm w-full shadow-2xl border border-stone-200">
        <h3 className="text-lg font-serif text-stone-900 mb-1">{title}</h3>
        <p className="text-stone-500 text-sm mb-5 leading-relaxed">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-stone-300 text-stone-700 rounded-sm text-xs font-medium hover:bg-stone-50 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-stone-50 rounded-sm text-xs font-semibold transition ${
              isDangerous ? "bg-red-600 hover:bg-red-700" : "bg-stone-900 hover:bg-stone-800"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
