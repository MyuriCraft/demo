import { useState, useEffect } from "react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

export const TokenGeneratorModal = () => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return ( 
        <>
            <p className="text-sm text-muted-foreground absolute right-0 me-2">
                Buscar carta o token {" "} 
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
                </kbd>
            </p>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Escribe la carta o token que buscas..." />
                <CommandList>
                    <CommandEmpty>Sin resultados.</CommandEmpty>
                    <CommandGroup heading="Sugerencias">
                        {/* Dejar los tokens que más usamos a la mano */}
                        <CommandItem>Dinosaur Token</CommandItem>
                        <CommandItem>Human Token</CommandItem>
                        <CommandItem>Soldier Token</CommandItem>
                        <CommandItem>Treasure Token</CommandItem>
                        <CommandItem>Angel Token</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </> 
    );
}
