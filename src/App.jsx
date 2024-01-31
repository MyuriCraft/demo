import './App.css';
import { useEffect, useState } from 'react';
import { decks } from './data/decks';
import { cartas } from './data/cartas';
import Carta from './components/Carta';
import { db } from './firebase';
import { onValue, ref, set } from "firebase/database";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTrigger } from './components/ui/drawer';
import { Button } from './components/ui/button';
import Card from './components/Card';

import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const [id_sesion, set_id_sesion] = useState(uniqid())
  const [mano, set_mano] = useState([])
  const [campo_tierras, set_campo_tierras] = useState([])
  const [campo_criaturas, set_campo_criaturas] = useState([])
  const [deck_cartas, set_deck_cartas] = useState(decks['prueba']['cartas'])
  const [mano_enemigo, set_mano_enemigo] = useState([])
  const [campo_tierras_enemigo, set_campo_tierras_enemigo] = useState([])
  const [campo_criaturas_enemigo, set_campo_criaturas_enemigo] = useState([])
  const [vista, set_vista] = useState('propia')

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

  return(
    <section className="h-dvh bg-slate-100 flex flex-col">
      <div className="basis-1/3 bg-slate-300 h-2/6">
        {campo_criaturas.map((card, i) => 
          <Card 
            key={i} 
            card={{
              name: card,
              imageUrl: cartas[card]['img']
            }} 
            inv={() => {
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
        )}
      </div>
      <div className="basis-1/3 bg-slate-200 h-2/6">
        {campo_tierras.map((card, i) => 
          <Card 
            key={i} 
            card={{
              name: card,
              imageUrl: cartas[card]['img']
            }} 
            inv={() => {
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
        )}
      </div>
      <div className="basis-1/3 flex flex-row-reverse h-2/6">
        <Toaster position="top-right" />
        <button onClick={handleClick} >
          <img 
          src="https://m.media-amazon.com/images/I/61AGZ37D7eL.jpg"
          alt="Deck Magic" 
          className='h-full rounded-xl'
          />
        </button>
        <Drawer>
          <DrawerTrigger>
            <Button variant="outline" className="absolute bottom-0 left-0">Ver mano</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerDescription className="flex gap-4 overflow-x-auto">
                { 
                  mano.map((card, i) => 
                    <Card 
                      key={i} 
                      card={{
                        name: card,
                        imageUrl: cartas[card]['img']
                      }} 
                      inv={() => {
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
                  )
                }
                {mano.length == "0" ? 
                  <img src="https://media.newyorker.com/photos/62d85d3d3b3e14a2fb1cf46e/16:9/w_1280,c_limit/site_deRecat_hand.jpg" 
                  className='h-64 object-cover w-50'/>
                : null }
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
      </div>

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
