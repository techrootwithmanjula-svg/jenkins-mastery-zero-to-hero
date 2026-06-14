import { Link } from "react-router";
import {
  AlertIcon,
  CheckCircleIcon,
  ErrorIcon,
  InfoIcon,
} from "../../../icons";

interface AlertProps {
  variant:
    | "success"
    | "error"
    | "warning"
    | "info";
  title: string;
  message: string;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
}

const Alert: React.FC<
  AlertProps
> = ({
  variant,
  title,
  message,
  showLink = false,
  linkHref = "#",
  linkText = "Learn more",
}) => {
  const variantClasses = {
    success: {
      container:
        "border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15",
      icon:
        "text-success-500",
    },
    error: {
      container:
        "border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15",
      icon:
        "text-error-500",
    },
    warning: {
      container:
        "border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15",
      icon:
        "text-warning-500",
    },
    info: {
      container:
        "border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15",
      icon:
        "text-blue-light-500",
    },
  };

  const iconClassName = "size-6 [&_path]:fill-current";

  const icons = {
    success: <CheckCircleIcon className={iconClassName} />,
    error: <ErrorIcon className={iconClassName} />,
    warning: <AlertIcon className={iconClassName} />,
    info: <InfoIcon className={iconClassName} />,
  };

  return (
    <div
      className={`
        w-full
        rounded-xl
        border
        p-4
        shadow-lg
        transition-all
        duration-300
        animate-in
        slide-in-from-right
        ${variantClasses[variant].container}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            shrink-0
            -mt-0.5
            ${variantClasses[variant].icon}
          `}
        >
          {icons[variant]}
        </div>

        <div className="flex-1">
          <h4 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>

          {showLink && (
            <Link
              to={linkHref}
              className="mt-3 inline-block text-sm font-medium text-gray-500 underline dark:text-gray-400"
            >
              {linkText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;