import { useEffect, useState } from 'react';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	ContextMenuSeparator,
} from "@/components/ui/context-menu";

const Card = ({ card, inv }) => {
	const [carta, set_carta] = useState('');

	useEffect(() => {
		set_carta(null)
		const fetchDataMTG = async () => {
			const response = await fetch(`https://api.magicthegathering.io/v1/cards/1`)
			const data = await response.json()

			console.log(data.card)

			set_carta(data.card)
		}

		fetchDataMTG();
	}, [])

	return( 
		<ContextMenu>
			<ContextMenuTrigger asChild className="h-64 rounded-xl hover:scale-95 transition" >
				<img 
					src={card.imageUrl} 
					alt={card.name} 
				/>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					onClick={() => inv()}
				>
					Añadir al campo
				</ContextMenuItem>
				{/*<ContextMenuItem>Billing</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem>Team</ContextMenuItem>
	<ContextMenuItem>Subscription</ContextMenuItem>*/}
			</ContextMenuContent>
		</ContextMenu>
	);
}

export default Card