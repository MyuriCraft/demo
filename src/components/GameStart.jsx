import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const GameStart = () => {
	const [loading, set_loading] = useState(false);
	const [jugadores, set_jugadores] = useState({
		usuario: '',
		rival: ''
	});

	const fetch_card = async (carta) => {
		const response = await fetch('https://api.scryfall.com/cards/named?fuzzy=' + carta)
		const data = await response.json()
		return data;
	}

	const handle_text = event => {
		var aux_jugadores = JSON.parse(JSON.stringify(jugadores));
		aux_jugadores[event.target.id] = event.target.value;
		set_jugadores(aux_jugadores)

		localStorage.setItem("jugadores", JSON.stringify(aux_jugadores));
  }

	async function handle_file(e){
		set_loading(true);
		localStorage.setItem("deck", '');
		var aux_deck = [];
		var aux_comm = [];
		const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
			text.split('\n').map(async (obj) => {
				if(obj !== ''){
					const index = obj.indexOf(' ');	

					const index_com = obj.indexOf('/');
					console.log('->', index_com)

					var carta_data = await fetch_card(obj.slice(index, obj.length).replaceAll('/', '').replaceAll(' ', '+'));
					if(carta_data['object'] !== 'error'){
						if(index_com >= 0){
							aux_comm.push({
								...carta_data,
								rotacion: '0deg',
								cubierta: false,
								palabras: [],
								contadores: [],
								commander: true
							});
						}else{
							console.log(carta_data)
							aux_deck.push({
								...carta_data,
								rotacion: '0deg',
								cubierta: false,
								palabras: [],
								contadores: [],
								commander: true
							});
							if(obj.slice(0, index) > 1){
								for(var a = 0; a < Number(obj.slice(0, index)) - 1; a++){
									aux_deck.push({
										...carta_data,
										rotacion: '0deg',
										cubierta: false,
										palabras: [],
										contadores: [],
										commander: true
									});
								}
							}
						}
					}
				}else{
					console.log(obj)
				}
				//if(aux_deck.length === 100){
					localStorage.setItem("deck", JSON.stringify(aux_deck));
					localStorage.setItem("comm", JSON.stringify(aux_comm));
				//}else{
					//alert('El deck debe contenter exactamente 100 cartas')
				//}
				set_loading(false)
			})
    };
    reader.readAsText(e.target.files[0])
	}

	return !loading ? ( 
		<div className="grid gap-4 place-content-center h-dvh bg-blue-50">
			<Input 
				id='usuario'
				type="text" 
				placeholder="Jugador"
				onChange={handle_text}
				value={jugadores['usuario']}
			/>
			<Input 
				id='rival'
				type="text" 
				placeholder="Enemigo" 
				onChange={handle_text}
				value={jugadores['rival']}
			/>
			<Label htmlFor="deckList">Deck (.txt)</Label>
			<Input id="deckList" type="file" onChange={(e) => handle_file(e)} accept={'.txt'}/>
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