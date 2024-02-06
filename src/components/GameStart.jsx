import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button"

const GameStart = () => {
	const [loading, set_loading] = useState(false);

	const fetch_card = async (carta) => {
		const response = await fetch('https://api.scryfall.com/cards/named?fuzzy=' + carta)
		const data = await response.json()
		return data;
	}

	async function handle_file(e){
		set_loading(true);
		localStorage.setItem("deck", '');
		var aux_deck = [];
		const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
			text.split('\n').map(async (obj) => {
				const index = obj.indexOf(' ');
				var carta_data = await fetch_card(obj.slice(index, obj.length).replaceAll(' ', '+'));
				aux_deck.push({
					...carta_data,
					rotacion: '0deg',
					cubierta: false
				});
				if(obj.slice(0, index) > 1){
					for(var a = 0; a < Number(obj.slice(0, index)) - 1; a++){
						aux_deck.push({
							...carta_data,
							rotacion: '0deg',
							cubierta: false
						});
					}
				}
				localStorage.setItem("deck", JSON.stringify(aux_deck));
				set_loading(false)
			})
    };
    reader.readAsText(e.target.files[0])
	}

	return !loading ? ( 
		<div className="grid gap-4 place-content-center h-dvh bg-blue-50">
			<Input type="text" placeholder="Jugador" />
			<Input type="text" placeholder="Enemigo" />
			<input type="file" onChange={(e) => handle_file(e)} />
			<Button>
				<Link to="/board">Login</Link>
			</Button>
		</div>
	):(
		<div>
			Cargando
		</div>
	);
}
 
export default GameStart;