import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import propTypes from 'prop-types';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from 'react';

const Card = ({ card, func_card_state, place, handle_cast, handle_word }) => {
	const [power, set_power] = useState(0);
	const [life, set_life] = useState(0);
	const [text, set_text] = useState('');

	Card.propTypes = {
    card: propTypes.object.isRequired,
		func_card_state: propTypes.func,
		handle_cast: propTypes.func,
		handle_word: propTypes.func,
		place: propTypes.string.isRequired,
  };

	function get_type() {
		var type = 'resto';
    if(card['type_line'].toLowerCase().includes('creature')){
      type = 'criatura';
    }
    if(card['type_line'].toLowerCase().includes('land')){
      type = 'tierra';
    }

		return type;
	}

	const handle_text = event => {
		switch (event.target.id) {
			case 'power':
				set_power(event.target.value)
			break;
			case 'life':
				set_life(event.target.value)
			break;
			case 'text':
				set_text(event.target.value)
			break;
		
			default:
				break;
		}
  }

	return card['image_uris']['png'] !== undefined ? ( 
		<ContextMenu>
			<ContextMenuTrigger  className="relative h-2/6 flex-none" >
					<img 
						style={{
							rotate: card['rotacion'] ?? '0deg'
						}}
						src={card['cubierta'] ? "https://m.media-amazon.com/images/I/61AGZ37D7eL.jpg":card['image_uris']['normal']} 
						alt={card['name'] ?? ''} 
						className="max-h-56 min-h-56 rounded-xl hover:scale-95 transition " 
					/>
				{place === 'tierra' ||
					place === 'criatura' ||
					place === 'resto' ? (
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
											id="power"
											defaultValue="0"
											className="col-span-2 h-8"
											onChange={handle_text}
										/>
									</div>
									<div className="grid grid-cols-3 items-center gap-4">
										<Label htmlFor="maxWidth">Resistencia</Label>
										<Input
											id="life"
											defaultValue="0"
											className="col-span-2 h-8"
											onChange={handle_text}
										/>
									</div>
									<Button
										onClick={() => handle_word({ tipo: 0, text: '+' + power + '/+' + life, origen: place })}
									>
										Añadir
									</Button>
									<div className="grid grid-cols-3 items-center gap-4">
										<Label htmlFor="maxHeight">Palabra clave</Label>
										<Input
											id="text"
											className="col-span-2 h-8"
											onChange={handle_text}
										/>
									</div>
									<Button
										onClick={() => handle_word({ tipo: 1, text: text, origen: place })}
									>
										Añadir
									</Button>
									Palabras clave
									<div>
										{card['palabras'].map((obj, i) => 
											<span 
												key={i}
												className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
											>
												{obj}
											</span> 
										)}
									</div>
									Contadores
									<div>
										{card['contadores'].map((obj, i) => 
											<span 
												key={i}
												className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
											>
												{obj}
											</span> 
										)}
									</div>
								</div>
							</div>
						</PopoverContent>
					</Popover>
				):null}
			</ContextMenuTrigger>
			<ContextMenuContent className="w-64">
				{place === 'hand' &&
					<ContextMenuItem inset
						onClick={() => handle_cast({ tipo: 3, origen: place })}
					>
						Castear
					</ContextMenuItem>	
				}	
				{
					place === 'tierra' ||
					place === 'criatura' ||
					place === 'resto' ? (
						<ContextMenuItem 
							onClick={() => func_card_state({ action: 'rotate', tipo: get_type() })}
							inset
						>
							{card['rotacion'] === '0deg' ? 'Tappear':'Untappear'}
						</ContextMenuItem>
					):null
				}
				{
					place === 'cementerio' ||
					place === 'exilio'
					? (
						<>
							<ContextMenuItem 
								onClick={() => handle_cast({ tipo: 4, origen: place })}
								inset
							>
								Devolver a la mano
							</ContextMenuItem>
							<ContextMenuSeparator />
							<ContextMenuItem 
								onClick={() => func_card_state({ action: 'hide', tipo: get_type() })}
								inset
							>
								{card['cubierta'] ? 'Mostrar':'Ocultar'}
							</ContextMenuItem>
						</>
					):null
				}
				<ContextMenuSeparator/>
				{place !== 'cementerio' && (
				<ContextMenuItem 
					onClick={() => handle_cast({ tipo: 0, origen: place })}
					inset
				>
					Enviar al cementerio
				</ContextMenuItem>
				)}
				{place !== 'exilio' && (
					<ContextMenuItem 
						onClick={() => handle_cast({ tipo: 1, origen: place })}
						inset
					>
						Exiliar
					</ContextMenuItem>
				)}
				<ContextMenuSeparator />
				<ContextMenuSub>
					<ContextMenuSubTrigger inset>Devolver a la librería</ContextMenuSubTrigger>
					<ContextMenuSubContent className="w-48">
						<ContextMenuItem 
							onClick={() => handle_cast({ tipo: 2, origen: place })}
							inset
						>
							Barajar en librería
							{/* <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut> */}
						</ContextMenuItem>
						<ContextMenuItem 
							onClick={() => handle_cast({ tipo: 5, origen: place })}
							inset 
							//disabled
						>
							Enviar al fondo
						</ContextMenuItem>
						<ContextMenuItem 
							onClick={() => handle_cast({ tipo: 6, origen: place })}
							inset
						>
							Enviar al tope
						</ContextMenuItem>
						{place === 'hand' &&
							<>
								<ContextMenuSeparator />
								<ContextMenuItem inset>Revelar</ContextMenuItem>
							</>
						}
					</ContextMenuSubContent>
				</ContextMenuSub>
				<>
					<ContextMenuSeparator />
					<ContextMenuItem inset>
						Agregar Palabra Clave
					</ContextMenuItem>
				</>
			</ContextMenuContent>
		</ContextMenu>
	):(
		<div>
			no deberias poder ver esto
		</div>
	);
}

export default Card