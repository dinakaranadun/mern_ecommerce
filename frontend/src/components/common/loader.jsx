import { Spinner } from "../ui/shadcn-io/spinner"

const Loader = ({ text = "Loading...", variant = "ring", size = 40 }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <Spinner variant={variant} size={size} className="text-gray-600" />
        <p className="text-gray-600 font-semibold">{text}</p>
      </div>
    </div>
  )
}

export default Loader;