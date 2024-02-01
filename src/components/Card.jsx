import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import propTypes from 'prop-types';

const Card = ({ card, func_card_state, inv }) => {
	Card.propTypes = {
    card: propTypes.object.isRequired,
		func_card_state: propTypes.func,
		inv: propTypes.func,
  };

	return( 
		<ContextMenu>
			<ContextMenuTrigger asChild className="h-full max-h-64 rounded-xl hover:scale-95 transition" >
					<img 
						style={{
							rotate: card['rotacion']
						}}
						onDoubleClick={() => 
							func_card_state({
								action: 'rotate',
								tipo: card['tipo']
							})
						}
						src={card['cubierta'] ? "https://m.media-amazon.com/images/I/61AGZ37D7eL.jpg":card.imageUrl} 
						alt={card['name']} 
					/>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					onClick={() => inv()}
				>
					Añadir al campo
				</ContextMenuItem>
				{func_card_state !== undefined &&
					<ContextMenuItem
						onClick={() => 
							func_card_state({
								action: 'hide',
								tipo: card['tipo']
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