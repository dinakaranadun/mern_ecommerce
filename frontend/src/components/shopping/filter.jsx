import { filterOptions } from "@/config";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

const ProductFilter = () => {
  return (
    <div className="bg-background rounded-lg shadow-sm">
        <div className="p-4 border-b">
            <h2 className="text-lg font-bold">Filters</h2>
        </div>
        <div className="p-4 space-y-4">
            {Object.keys(filterOptions).map((item) => (
                <>
                    <div>
                        <h3 className="text-base font-semibold">{item}</h3>
                        <div className="grid gap-2 mt-2">
                            {
                                filterOptions[item].map((option)=>(
                                     <Label
                                        key={option.id || option.label} // <-- key added here too
                                        className="flex items-center gap-2 font-normal"
                                    >
                                        <Checkbox key={option.id} />
                                        {option.label}
                                    </Label>
                                ))
                            }
                        </div>
                    </div>
                    <Separator/>
                </>
            ))}
        </div>
    </div>
  )
}

export default ProductFilter;