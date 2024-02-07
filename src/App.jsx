import './App.css';
import { useEffect, useState } from 'react';

import { cartas } from './data/cartas';
import Carta from './components/Carta';
import { db } from './firebase';
import { onValue, ref, set } from "firebase/database";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTrigger } from './components/ui/drawer';
import { Button } from './components/ui/button';
import Card from './components/Card';
import BoardSection from './components/layouts/BoardSection';

import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Routes, Route } from 'react-router-dom';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
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
  const [id_sesion, set_id_sesion] = useState(uniqid())
  const [mano, set_mano] = useState([])
  const [campo_tierras, set_campo_tierras] = useState([])
  const [campo_criaturas, set_campo_criaturas] = useState([])
  const [deck_cartas, set_deck_cartas] = useState([])
  const [mano_enemigo, set_mano_enemigo] = useState([])
  const [campo_tierras_enemigo, set_campo_tierras_enemigo] = useState([])
  const [campo_criaturas_enemigo, set_campo_criaturas_enemigo] = useState([])
  const [vista, set_vista] = useState('propia')

  const [jugador, set_jugador] = useState({
    mano: [],
    tierra: [],
    criatura: [],
    resto: []
  })

  useEffect(() => {
    set_deck_cartas(barajar(JSON.parse(localStorage.getItem("deck"))))
  }, [])

  useEffect(() => {
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

  useEffect(() => {
    if(mano.length > 0 || campo_criaturas.length > 0 || campo_tierras.length > 0)
    set(ref(db, 'movimientos/' + id_sesion), {
      mano: mano,
      criaturas: campo_criaturas,
      tierras: campo_tierras
    }).catch((err) => console.log(err))
  }, [mano, campo_criaturas, campo_tierras])

  function uniqid(prefix = "", random = false) {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}`:""}`;
  }

  const handleClick = () => {
    if(deck_cartas.length > 0){
      var aux_mano = JSON.parse(JSON.stringify(mano));
      var aux_deck = JSON.parse(JSON.stringify(deck_cartas));

      aux_mano.push(aux_deck[0])
      set_mano(aux_mano)

      aux_deck.splice(0, 1)
      set_deck_cartas(aux_deck)
      toast.success("Carta agregada a tu mano")
    }else{
      toast.warning("Sin cartas")
    }
  }

  function render_mano(){
    var datos = Object.values(mano_enemigo);
    if(vista === 'propia'){
      datos = mano;
    }
    return(
      <div 
          fluid
          style={{
            backgroundColor: 'blue'
          }}
        >
          <div>
            {datos.map((obj, i) => (
              <Carta  
                key={i}
                id={obj}
                tipo={'mano'}
                func_deck={(val) => {
                  var aux_mano = JSON.parse(JSON.stringify(mano));
                  var aux_deck = JSON.parse(JSON.stringify(deck_cartas));

                  aux_mano.splice(i, 1);
                  set_mano(aux_mano)
                  switch (val) {
                    case 0:
                      aux_deck.push(obj);
                      set_deck_cartas(barajar(aux_deck))
                    break;
                    case 1:
                      aux_deck.unshift(obj);
                      set_deck_cartas(aux_deck)
                    break;
                    case 2:
                      aux_deck.push(obj);
                      set_deck_cartas(aux_deck)
                    break;
                    default:
                  }
                  

                }}
                func_inv={() => {
                  var aux_mano = JSON.parse(JSON.stringify(mano)); 
                  var campo = null;
                  if(cartas[aux_mano[i]]['tipo'] === 'tierra'){
                    campo = JSON.parse(JSON.stringify(campo_tierras)); 
                    campo.push(aux_mano[i]);
                    set_campo_tierras(campo)
                  }else{
                    campo = JSON.parse(JSON.stringify(campo_criaturas)); 
                    campo.push(aux_mano[i]);
                    set_campo_criaturas(campo)
                  }
                  aux_mano.splice(i, 1);
                  set_mano(aux_mano)
                }}
              />
            ))}
          </div>
      </div>
    )
  }

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

  function render_criaturas(){
    var datos = Object.values(campo_criaturas_enemigo);
    if(vista === 'propia'){
      datos = campo_criaturas;
    }
    return(
      <div 
        fluid
        style={{
          backgroundColor: 'red',
          display: "flex", 
          flex: 2
        }}
      >
        <div>
          {datos.map((obj, i) => (
            <div>
              <Carta  
                key={i}
                id={obj}
                tipo={'campo'}
                func_mano={() => {
                  var aux_mano = JSON.parse(JSON.stringify(mano));
                  var aux_campo = JSON.parse(JSON.stringify(campo_criaturas));

                  aux_campo.splice(i, 1);
                  set_campo_criaturas(aux_campo)

                  aux_mano.push(obj);
                  set_mano(aux_mano)
                }}
                func_deck={(val) => {
                  var aux_campo = JSON.parse(JSON.stringify(campo_criaturas));
                  var aux_deck = JSON.parse(JSON.stringify(deck_cartas));

                  aux_campo.splice(i, 1);
                  set_campo_criaturas(aux_campo)
                  switch (val) {
                    case 0:
                      aux_deck.push(obj);
                      set_deck_cartas(barajar(aux_deck))
                    break;
                    case 1:
                      aux_deck.unshift(obj);
                      set_deck_cartas(aux_deck)
                    break;
                    case 2:
                      aux_deck.push(obj);
                      set_deck_cartas(aux_deck)
                    break;
                    default:
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  function render_tierras(){
    var datos = Object.values(campo_tierras_enemigo);
    if(vista === 'propia'){
      datos = campo_tierras;
    }
    console.log(datos)
    return(
      <div 
        fluid
        style={{
          backgroundColor: 'green',
          display: "flex", 
          flex: 2
        }}
      >
        <div>
          {datos.map((obj, i) => (
            <div>
              <Carta
                key={i}
                id={obj}
                tipo={'campo'}
                func_mano={() => {
                  var aux_mano = JSON.parse(JSON.stringify(mano));
                  var aux_campo = JSON.parse(JSON.stringify(campo_tierras));

                  aux_campo.splice(i, 1);
                  set_campo_tierras(aux_campo)

                  aux_mano.push(obj);
                  set_mano(aux_mano)
                }}
                func_deck={(val) => {
                  var aux_campo = JSON.parse(JSON.stringify(campo_tierras));
                  var aux_deck = JSON.parse(JSON.stringify(deck_cartas));

                  aux_campo.splice(i, 1);
                  set_campo_tierras(aux_campo)
                  switch (val) {
                    case 0:
                      aux_deck.push(obj);
                      set_deck_cartas(barajar(aux_deck))
                    break;
                    case 1:
                      aux_deck.unshift(obj);
                      set_deck_cartas(aux_deck)
                    break;
                    case 2:
                      aux_deck.push(obj);
                      set_deck_cartas(aux_deck)
                    break;
                    default:
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    )
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

  function render(tipo){
    return(
      jugador[tipo].map((card, i) => 
        <Card 
          key={i} 
          card={card} 
          place={'board'}
          func_card_state = {(action) => handle_card_state({ ...action, id: i })}
        />
      )
    )
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
            <div onClick={handleClick} >
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
            <Button variant="outline" className="absolute bottom-0 left-[0px]">Mano</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerDescription className="flex gap-4 overflow-x-auto">
                { 
                  mano.map((card, i) => 
                    <Card 
                      key={i} 
                      card={card}
                      place={'hand'}
                      ret_deck={() => {
                        var aux_mano = JSON.parse(JSON.stringify(mano));
                        var aux_deck = JSON.parse(JSON.stringify(deck_cartas));
                        
                        aux_deck.push(aux_mano[i])
                        aux_mano.splice(i, 1)


                        set_mano(aux_mano)
                        set_deck_cartas(barajar(aux_deck))
                        toast.success("Carta devuelta al deck")
                      }}
                      inv={() => {
                        var aux_mano = JSON.parse(JSON.stringify(mano)); 
                        var jugador_aux = JSON.parse(JSON.stringify(jugador));

                        var tipo = 'resto';
                        if(card['type_line'].toLowerCase().includes('creature')){
                          tipo = 'criatura';
                        }
                        if(card['type_line'].toLowerCase().includes('land')){
                          tipo = 'tierra';
                        }
                        

                        jugador_aux[tipo].push({
                          ...card,
                          rotacion: '0deg',
                          cubierta: false,
                        });

                        set_jugador(jugador_aux)

                       
                        aux_mano.splice(i, 1);
                        set_mano(aux_mano)
                      }}
                    />
                  )
                }
                {mano.length === 0 && 
                  <img 
                    src={handImg} 
                    className='h-64 object-cover w-[200px] border rounded-md'
                  />
                }
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="flex flex-row flex-row-reverse gap-4">
              <Button onClick={handleClick} >
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
            <Button variant="outline" className="absolute bottom-0 left-[80px]">Cementerio</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerDescription className="flex gap-4 overflow-x-auto">
              <img 
                src={graveyardImg}
                className='h-64 object-cover w-[200px] border rounded-md'
              />
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
            <Button variant="outline" className="absolute bottom-0 left-[200px]">Exilio</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerDescription className="flex gap-4 overflow-x-auto">
              <img 
                src={exiledImg}
                className='h-64 object-cover w-[200px] border rounded-md'
              />
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

  /*return(
        <>
          <div 
            style={{ 
              display: "flex", 
              flex: 1,
              flexDirection: 'row', 
            }} 
            onClick={() => set_vista(vista === 'propia' ? 'enemiga':'propia')}
          >
            cambiar a vista {vista === 'propia' ? 'del enemigo':'propia'}
          </div>
          {
            render_criaturas()
          }
          {
            render_tierras()
          }
          <div 
            style={{ 
              display: "flex", 
              flex: 1,
              flexDirection: 'row', 
            }} 
          >
            <div style={{ display: "flex", flex: 1 }}>
              {render_mano()}
            </div>
            <div 
              style={{ 
                display: "flex", 
                flexDirection: 'row', 
                backgroundColor: 'yellow', 
                width: '20%'
              }} 
              onClick={() => {
                if(deck_cartas.length > 0){
                  var aux_mano = JSON.parse(JSON.stringify(mano));
                  var aux_deck = JSON.parse(JSON.stringify(deck_cartas));
                  var carta = 0


                  aux_mano.push(aux_deck[carta])
                  set_mano(aux_mano)

                  aux_deck.splice(carta, 1)
                  set_deck_cartas(aux_deck)

  

                }else{
                  console.log(deck_cartas.length)
                }
              }}
            >
              deck
            </div>
          </div>
          <hr />
        </>
  )*/
}

export default App;
