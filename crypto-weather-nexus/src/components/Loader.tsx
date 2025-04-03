const Loader = () => {
  return (
    <div className="flex justify-center items-center h-20" role="status" aria-label="Loading">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
