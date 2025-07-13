export function LoadingActivities() {
    return (
      <div className="h-[70vh] w-full max-w-md mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-700 font-medium">Cargando actividades...</p>
        </div>
      </div>
    )
  }