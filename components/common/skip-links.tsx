"use client";

import { useSkipLink } from "@/hooks/use-focus-trap";
import React from "react";

/**
 * Skip links component for keyboard navigation accessibility
 * Provides quick navigation to main content areas
 */
export function SkipLinks() {
  const { skipToContent, skipToNavigation } = useSkipLink();

  return (
    <div className="skip-links">
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          skipToContent();
        }}
        className="skip-link"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        onClick={(e) => {
          e.preventDefault();
          skipToNavigation();
        }}
        className="skip-link"
      >
        Skip to navigation
      </a>

      <style jsx>{`
        .skip-links {
          position: absolute;
          top: -100px;
          left: 0;
          z-index: 9999;
        }

        .skip-link {
          position: absolute;
          top: -100px;
          left: 0;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 0 0 4px 0;
          font-size: 14px;
          font-weight: 500;
          transition: top 0.2s ease;
          z-index: 10000;
        }

        .skip-link:focus {
          top: 0;
        }

        .skip-link:hover {
          background: #333;
        }

        .skip-link + .skip-link {
          left: 140px;
        }
      `}</style>
    </div>
  );
}

/**
 * Enhanced focus management for modal dialogs
 */
interface FocusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function FocusableModal({
  isOpen,
  onClose,
  children,
  title,
  description,
}: FocusableModalProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  // Use focus trap when modal is open
  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      // Restore body scroll
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Focus management
  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        ref={containerRef}
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 id="modal-title" className="text-lg font-semibold mb-4">
            {title}
          </h2>
        )}

        {description && (
          <p
            id="modal-description"
            className="text-sm text-gray-600 dark:text-gray-400 mb-4"
          >
            {description}
          </p>
        )}

        {children}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <span className="sr-only">Close</span>✕
        </button>
      </div>
    </div>
  );
}

/**
 * Accessible form field with proper labeling and error handling
 */
interface AccessibleFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password" | "textarea";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  description?: string;
}

export function AccessibleField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
  description,
}: AccessibleFieldProps) {
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  const commonProps = {
    id,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    required,
    placeholder,
    "aria-invalid": !!error,
    "aria-describedby":
      [description ? descriptionId : "", error ? errorId : ""]
        .filter(Boolean)
        .join(" ") || undefined,
    className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-blue-500"
    }`,
  };

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {description && (
        <p
          id={descriptionId}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          {description}
        </p>
      )}

      {type === "textarea" ? (
        <textarea {...commonProps} rows={4} />
      ) : (
        <input {...commonProps} type={type} />
      )}

      {error && (
        <p
          id={errorId}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
