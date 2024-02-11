import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverDemo({ palabras, contadores }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="absolute left-0 bottom-0" >
            <Button variant="outline" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-90">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Contadores</h4>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Poder</Label>
              <Input
                id="width"
                defaultValue="0"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Resistencia</Label>
              <Input
                id="maxWidth"
                defaultValue="0"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Palabra clave</Label>
              <Input
                id="maxHeight"
                className="col-span-2 h-8"
              />
            </div>
            Palabras clave
            <div>
              {palabras.map((obj, i) => 
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    {obj}
                </span> 
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
