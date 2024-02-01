import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { decks } from "@/data/decks";

const GameStart = () => {
	const [deck, set_deck] = useState([]);

	const fetch_card = async (carta) => {
		const response = await fetch(`https://api.magicthegathering.io/v1/cards/${carta}`)
		const data = await response.json()
		return data.card;
	}

	useEffect(() => {
		async function deckear(){
			const deck_full = await Promise.all(
				decks['indexado']['cartas'].map(async (username) => {
					return await fetch_card(username)
				})
			)
			console.log(deck_full)
		}
		deckear()
	}, [])

	return ( 
		<div className="grid gap-4 place-content-center h-dvh bg-red-50">
			<Input type="text" placeholder="Jugador" />
			<Input type="text" placeholder="Enemigo" />
			<Link to='/board'>Entrar</Link>
		</div>
	);
}
 
export default GameStart;