import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuShortcut,
} from "@/components/ui/context-menu";
import propTypes from 'prop-types';
import { useEffect } from "react";

const Card = ({ card, func_card_state, inv, place, ret_deck }) => {
	Card.propTypes = {
    card: propTypes.object.isRequired,
		func_card_state: propTypes.func,
		inv: propTypes.func,
		ret_deck: propTypes.func,
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

	useEffect(() => {
		console.log(card)
	}, [])

	return card['image_uris']['png'] !== undefined ? ( 
		<ContextMenu>
			<ContextMenuTrigger asChild className="h-full max-h-64 rounded-xl hover:scale-95 transition" >
					<img 
						style={{
							rotate: card['rotacion'] ?? '0deg'
						}}
						onDoubleClick={() => 
							func_card_state({
								action: 'rotate',
								tipo: get_type()
							})
						}
						src={card['cubierta'] ? "https://m.media-amazon.com/images/I/61AGZ37D7eL.jpg":card['image_uris']['normal']} 
						alt={card['name'] ?? ''} 
					/>
			</ContextMenuTrigger>
			<ContextMenuContent className="w-64">
				{place === 'hand' &&
					<>
						<ContextMenuItem inset
							onClick={() => inv()}
						>
							Castear
						</ContextMenuItem>
						
					</>
				}	
				{ func_card_state !== undefined &&
					<>
						<ContextMenuItem inset>
							Tappear
						</ContextMenuItem>
						<ContextMenuItem inset>
							Devolver a la mano
						</ContextMenuItem>
						<ContextMenuSeparator />
						<ContextMenuItem inset
							onClick={() => 
								func_card_state({
									action: 'hide',
									tipo: get_type()
								})
							}
							>
							{card['cubierta'] ? 'Mostrar':'Ocultar'}
						</ContextMenuItem>
					</>
				}
				<ContextMenuSeparator />
				<ContextMenuItem inset>
					Descartar
				</ContextMenuItem>
				<ContextMenuItem inset>
					Exiliar
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuSub>
					<ContextMenuSubTrigger inset>Devolver a la librería</ContextMenuSubTrigger>
					<ContextMenuSubContent className="w-48">
						<ContextMenuItem inset onClick={() => ret_deck()}>
							Barajar en librería
							{/* <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut> */}
						</ContextMenuItem>
						<ContextMenuItem inset disabled>Enviar al fondo</ContextMenuItem>
						<ContextMenuItem inset>Enviar al tope</ContextMenuItem>
						{place === 'hand' &&
							<>
								<ContextMenuSeparator />
								<ContextMenuItem inset>Revelar</ContextMenuItem>
							</>
						}
					</ContextMenuSubContent>
				</ContextMenuSub>
				{ func_card_state !== undefined &&
					<>
						<ContextMenuSeparator />
						<ContextMenuItem inset>
							Agregar Palabra Clave
						</ContextMenuItem>
					</>
				}
			</ContextMenuContent>
		</ContextMenu>
	):(
		<div>
			no deberias poder ver esto
		</div>
	);
}

export default Card