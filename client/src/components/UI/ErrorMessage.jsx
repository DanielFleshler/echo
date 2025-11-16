const ErrorMessage = ({ message }) => {
  return (
    <div
      className="text-center p-4 text-red-400 bg-red-900/30 border border-red-900/50 rounded-lg"
      role="alert"
      aria-live="polite"
    >
      <p>{message || "An error occurred."}</p>
    </div>
  );
};

export default ErrorMessage; 