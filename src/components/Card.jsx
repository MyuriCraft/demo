import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
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

	return( 
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
						src={card['cubierta'] ? "https://m.media-amazon.com/images/I/61AGZ37D7eL.jpg":card['image_uris']['png']} 
						alt={card['name'] ?? ''} 
					/>
			</ContextMenuTrigger>
			<ContextMenuContent>
				{place === 'hand' &&
					<>
						<ContextMenuItem
							onClick={() => inv()}
						>
							Añadir al campo
						</ContextMenuItem>
						<ContextMenuItem
							onClick={() => ret_deck()}
						>
							devolver al deck
						</ContextMenuItem>
					</>
				}	
				{func_card_state !== undefined &&
					<ContextMenuItem
						onClick={() => 
							func_card_state({
								action: 'hide',
								tipo: get_type()
							})
						}
					>
						{card['cubierta'] ? 'Mostrar':'Ocultar'}
					</ContextMenuItem>
				}
				{/*<ContextMenuItem>Billing</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem>Team</ContextMenuItem>
	<ContextMenuItem>Subscription</ContextMenuItem>*/}
			</ContextMenuContent>
		</ContextMenu>
	);
}

export default Card