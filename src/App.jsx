import './App.css';
import { useEffect, useState } from 'react';

//import { db } from './firebase';
//import { onValue, ref, set } from "firebase/database";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTrigger } from './components/ui/drawer';
import { Button } from './components/ui/button';
import Card from './components/Card';
import BoardSection from './components/layouts/BoardSection';

import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Routes, Route } from 'react-router-dom';
import { Input } from "@/components/ui/input"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import GameStart from './components/GameStart';

import graveyardImg from './assets/graveyard.webp';
import exiledImg from './assets/darkhole.jpeg';
import handImg from './assets/hand.jpeg';

function App(){
  return(
    <Routes>
      <Route path='/' element={<GameStart/>}/>
      <Route path='/board' element={<Board/>}/>
    </Routes>
  )
}

function Board() {
  const [filtro, set_filtro] = useState('');
  const [jugador, set_jugador] = useState({
    hand: [],
    deck: [],
    tierra: [],
    criatura: [],
    resto: [],
    cementerio: [],
    exilio: []
  })

  useEffect(() => {
    var aux_jugador = JSON.parse(JSON.stringify(jugador));
    aux_jugador['deck'] = barajar(JSON.parse(localStorage.getItem("deck")))
    set_jugador(aux_jugador)
  }, [])

  useEffect(() => {
    if(jugador['deck'].length === 100){
      handle_draw(7)
    }
  }, [jugador['deck']])

  /*useEffect(() => {
    const query = ref(db, "movimientos/");
    return onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        Object.keys(snapshot.toJSON()).forEach(function(key) {
          if(key !== id_sesion){
            set_mano_enemigo(snapshot.toJSON()[key]['mano'] ?? [])
            set_campo_tierras_enemigo(snapshot.toJSON()[key]['tierras'] ?? [])
            set_campo_criaturas_enemigo(snapshot.toJSON()[key]['criaturas'] ?? [])
          }
        });
      }
    });
  }, [])
  */

  /*useEffect(() => {
    if(mano.length > 0 || campo_criaturas.length > 0 || campo_tierras.length > 0)
    set(ref(db, 'movimientos/' + id_sesion), {
      mano: mano,
      criaturas: campo_criaturas,
      tierras: campo_tierras
    }).catch((err) => console.log(err))
  }, [mano, campo_criaturas, campo_tierras])*/

  function get_random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function barajar(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex > 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  const handle_card_state = ({ id, action, tipo }) => {
    var data = JSON.parse(JSON.stringify(jugador));
    console.log(tipo)
    switch (action) {
      case 'rotate':
        data[tipo][id]['rotacion'] = data[tipo][id]['rotacion'] === '0deg' ? '90deg':'0deg';
      break;
      case 'hide':
        data[tipo][id]['cubierta'] = !data[tipo][id]['cubierta'];
      break;
      default:
    }
    set_jugador(data)
  }

  function get_type(dato) {
		var type = dato;
    if(dato.toLowerCase().includes('creature')){
      type = 'criatura';
    }
    if(dato.toLowerCase().includes('land')){
      type = 'tierra';
    }
    if(
      (
        dato.toLowerCase().includes('enchantment') ||
        dato.toLowerCase().includes('artifact') ||
        dato.toLowerCase().includes('instant') ||
        dato.toLowerCase().includes('sorcery')
      ) 
        && dato.toLowerCase().includes('creature') === false
      ){
      type = 'resto';
    }

		return type;
	}

  function render(tipo){
    return(
      jugador[tipo].map((card, i) => 
        <Card 
          key={i} 
          card={card} 
          place={tipo}
          func_card_state = {(action) => handle_card_state({ ...action, id: i })}
          handle_cast={(dato) => handle_cast({ ...dato, pos: i })}
          handle_word={(dato) => handle_word({ ...dato, pos: i })}
        />
      )
    )
  }

  function handle_draw(cantidad) {
    if(jugador['deck'].length > 0){
      var aux_jugador = JSON.parse(JSON.stringify(jugador));

      for(var a = 0; a < cantidad; a++){
        aux_jugador['hand'].push(aux_jugador['deck'][0])
        aux_jugador['deck'].splice(0, 1)

        console.log(aux_jugador['deck'][0])
      }
      toast.success(cantidad + " carta(s) agregada(s) a tu mano")
      set_jugador(aux_jugador)
    }else{
      toast.warning("Sin cartas en deck")
    }
  }

  function handle_cast(parametros){
    console.log(parametros)
    let aux_jugador = JSON.parse(JSON.stringify(jugador));
    switch (parametros['tipo']) {
      case 0: {
        aux_jugador['cementerio'].push(aux_jugador[parametros['origen']][parametros['pos']])
        aux_jugador[parametros['origen']].splice(parametros['pos'], 1);

        toast.warning(aux_jugador['cementerio'][0]['name'] + ' fue enviado al cementerio')
      }
      break;
      case 1: {
        aux_jugador['exilio'].push(aux_jugador[parametros['origen']][parametros['pos']])
        aux_jugador[parametros['origen']].splice(parametros['pos'], 1);

        toast.warning(aux_jugador['exilio'][0]['name'] + ' fue exiliado')
      }
      break;
      case 2: {
        let carta = aux_jugador[parametros['origen']][parametros['pos']]['name']
        aux_jugador['deck'].push(aux_jugador[parametros['origen']][parametros['pos']])
        aux_jugador[parametros['origen']].splice(parametros['pos'], 1);
        aux_jugador['deck'] = barajar(aux_jugador['deck']);

        toast.warning(carta + ' fue devuelto al deck');
      }
      break;
      case 3: {
        let tipo = get_type(aux_jugador[parametros['origen']][parametros['pos']]['type_line']);
        aux_jugador[tipo].push({
          ...aux_jugador[parametros['origen']][parametros['pos']],
          rotacion: '0deg',
          cubierta: false,
        });
        aux_jugador[parametros['origen']].splice(parametros['pos'], 1);

        toast.warning(aux_jugador[tipo][0]['name'] + ' fue casteado');
      }
      break;
      case 4: {
        let carta = aux_jugador[parametros['origen']][parametros['pos']]['name'];
        aux_jugador['hand'].push(aux_jugador[parametros['origen']][parametros['pos']]);
        aux_jugador[parametros['origen']].splice(parametros['pos'], 1);

        toast.warning(carta + ' fue devuelta a la mano');
      }
      break;
      case 5 :{
        let carta = aux_jugador[parametros['origen']][parametros['pos']]['name'];
        aux_jugador['deck'].push(aux_jugador[parametros['origen']][parametros['pos']]);
        aux_jugador[parametros['origen']].splice(parametros['pos'], 1);

        toast.warning(carta + ' fue enviada al fondo del deck');
      }
      break;
      case 6 :{
        let carta = aux_jugador[parametros['origen']][parametros['pos']]['name'];
        aux_jugador['deck'].unshift(aux_jugador[parametros['origen']][parametros['pos']]);
        aux_jugador[parametros['origen']].splice(parametros['pos'], 1);

        toast.warning(carta + ' fue enviada al fondo del deck');
      }
      break;
      default: toast.warning("No deberias poder ver esto")
    }
    set_jugador(aux_jugador)
  }

  const handle_text = event => {
    set_filtro(event.target.value)
    //console.log(event.target.id);
  }

  function handle_word(parametros) {
    console.log(parametros)
    let aux_jugador = JSON.parse(JSON.stringify(jugador));
    switch (parametros['tipo']) {
      case 0: {
        aux_jugador[parametros['origen']][parametros['pos']]['contadores'].push(parametros['text'])
        toast.warning(parametros['text'] + ' añadido')
      }
      break;
      case 1: {
        aux_jugador[parametros['origen']][parametros['pos']]['palabras'].push(parametros['text'])
        toast.warning(parametros['text'] + ' añadido')
      }
      break;
      default: toast.warning("No deberias poder ver esto")
    }
    set_jugador(aux_jugador)
  }

  return(
    <section className="h-dvh bg-slate-100 flex flex-col">
      <BoardSection bgColor='slate-300'>
        {render('criatura')}
      </BoardSection>
      <BoardSection bgColor='slate-200'>
        {render('resto')}
      </BoardSection>
      <BoardSection bgColor='slate-100' flexDirection='row-reverse' justifyContent='justify-between'>
        <ContextMenu>
          <ContextMenuTrigger asChild >
            <div onClick={() => handle_draw(1)} >
              <img 
              src="https://m.media-amazon.com/images/I/61AGZ37D7eL.jpg"
              alt="Deck Magic" 
              className='h-full rounded-xl hover:scale-95 transition'
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuItem inset>Robar carta</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem inset>Barajar</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem inset>Ver tope</ContextMenuItem>
            <ContextMenuItem inset>Revelar tope</ContextMenuItem>
            <ContextMenuItem inset>Descartar Tope</ContextMenuItem>
            <ContextMenuItem inset>Exiliar Tope</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem inset>Buscar carta</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <div className='flex justify-end gap-2'>
          {render('tierra')}
        </div>
      </BoardSection>
      {/* Drawer para ver MANO */}
        <Drawer>
          <DrawerTrigger>
            <Button variant="outline" className="absolute bottom-0 right-[0px]" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002" />
              </svg>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerDescription className="flex gap-4 overflow-x-auto">
                { 
                  jugador['hand'].map((card, i) => 
                    <Card 
                      key={i} 
                      card={card}
                      place={'hand'}
                      handle_cast={(tipo) => handle_cast({ ...tipo, pos: i })}
                    />
                  )
                }
                {jugador['hand'].length === 0 && 
                  <img 
                    src={handImg} 
                    className='h-64 object-cover w-[200px] border rounded-md'
                  />
                }
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="flex flex-row flex-row-reverse gap-4">
              <Button onClick={() => handle_draw(1)} >
                Robar carta
              </Button>
              <DrawerClose>
                <Button variant="outline">Ocultar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      {/* Drawer para ver CEMENTERIO */}
      <Drawer>
        <DrawerTrigger>
            <Button variant="outline" className="absolute bottom-0 right-[40px]" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
            </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            {jugador['cementerio'].length > 0 && <Input id='cementerio' type="text" placeholder="Nombre de carta..." onChange={handle_text} />}
            <DrawerDescription className="flex gap-4 overflow-x-auto">
              {jugador['cementerio'].length > 0 ? (
                <>
                  {jugador['cementerio'].map((card, i) => { 
                    return (card['name'].toLowerCase()).includes(filtro.toLowerCase()) && (
                      <Card 
                        key={i} 
                        card={card}
                        place={'cementerio'}
                        handle_cast={(tipo) => handle_cast({ ...tipo, pos: i })}
                      />
                    )
                  })}
                </>
              ):(
                <img 
                  src={graveyardImg}
                  className='h-64 object-cover w-[200px] border rounded-md'
                />
              )}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex flex-row flex-row-reverse gap-4">
            <DrawerClose>
              <Button variant="outline">Ocultar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {/* Drawer para ver EXILIO */}
      <Drawer>
        <DrawerTrigger>
            <Button variant="outline" className="absolute bottom-0 right-[80px]" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            {jugador['exilio'].length > 0 && <Input id='exilio' type="text" placeholder="Nombre de carta..." onChange={handle_text}/>}
            <DrawerDescription className="flex gap-4 overflow-x-auto">
              {jugador['exilio'].length > 0 ? (
                <>
                  {jugador['exilio'].map((card, i) => {
                    return (card['name'].toLowerCase()).includes(filtro.toLowerCase()) && (
                      <Card 
                        key={i} 
                        card={card}
                        place={'exilio'}
                        handle_cast={(tipo) => handle_cast({ ...tipo, pos: i })}
                      />
                    )
                  })}
                </>
              ):(
                <img 
                  src={exiledImg}
                  className='h-64 object-cover w-[200px] border rounded-md'
                />
              )}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex flex-row flex-row-reverse gap-4">
            <DrawerClose>
              <Button variant="outline">Ocultar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Toaster position="top-right" />           
    </section>
  )
}

export default App;
