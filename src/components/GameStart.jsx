import { Input } from "@/components/ui/input"

const GameStart = () => {
    return ( 
        <div className="grid gap-4 place-content-center h-dvh bg-red-50">
            <Input type="text" placeholder="Jugador" />
            <Input type="text" placeholder="Enemigo" />
        </div>
     );
}
 
export default GameStart;