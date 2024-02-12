import { useState, useEffect } from "react"

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { Button } from "./ui/button"

export const TokenGeneratorModal = ({ generate }) => {
	const [open, setOpen] = useState(false)
	const tokens = [
		{ dato: 'dinosaur', texto: 'Dinosaur Token' },
		{ dato: 'human', texto: 'Human Token' },
		{ dato: 'soldier', texto: 'Soldier Token' },
		{ dato: 'treasure', texto: 'Treasure Token' },
		{ dato: 'angel', texto: 'Angel Token' }
	]
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
					<CommandGroup>
						{/* Dejar los tokens que más usamos a la mano */}
						{tokens.map((obj, i) => (
							<CommandItem
								key={i}
							>
								{obj['texto']}
								<Button
									onClick={() => generate(obj['dato'])}
								>
									Añadir
								</Button>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</> 
	);
}
