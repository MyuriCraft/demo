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
import { PopoverDemo } from "./PopoverDemo";

const Card = ({ card, func_card_state, place, handle_cast }) => {
	Card.propTypes = {
    card: propTypes.object.isRequired,
		func_card_state: propTypes.func,
		handle_cast: propTypes.func,
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

	return card['image_uris']['png'] !== undefined ? ( 
		<ContextMenu>
			<ContextMenuTrigger  className="h-full relative h-2/6" >
				<img 
					style={{
						rotate: card['rotacion'] ?? '0deg'
					}}
					src={card['cubierta'] ? "https://m.media-amazon.com/images/I/61AGZ37D7eL.jpg":card['image_uris']['normal']} 
					alt={card['name'] ?? ''} 
					className="max-h-56 rounded-xl hover:scale-95 transition" 
				/>
				{place != 'hand' && <PopoverDemo/>}
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