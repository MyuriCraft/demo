import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

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
				if(obj !== ''){
					const index = obj.indexOf(' ');
					
					console.log(obj)
					var carta_data = await fetch_card(obj.slice(index, obj.length).replaceAll(' ', '+'));
					console.log(carta_data)
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
				}
				if(aux_deck.length === 100){
					localStorage.setItem("deck", JSON.stringify(aux_deck));
				}else{
					alert('El deck debe contenter exactamente 100 cartas')
				}
				set_loading(false)
			})
    };
    reader.readAsText(e.target.files[0])
	}

	return !loading ? ( 
		<div className="grid gap-4 place-content-center h-dvh bg-blue-50">
			<Input type="text" placeholder="Jugador" />
			<Input type="text" placeholder="Enemigo" />
			<Label htmlFor="deckList">Deck (.txt)</Label>
			<Input id="deckList" type="file" onChange={(e) => handle_file(e)} />
			<Button asChild>
				<Link to="/board">Jugar</Link>
			</Button>
		</div>
	):(
		<div>
			Cargando...
		</div>
	);
}
 
export default GameStart;