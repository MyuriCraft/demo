import './App.css';
import { useEffect, useState, useRef } from 'react';
import { jugadores } from './datos';
import Carta from './componentes/carta';
import { decks } from './datos/decks';
import { cartas } from './datos/cartas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/*function App() {
  const [jugadores_activos, set_jugadores_activos] = useState([])
  const [rivales_activos, set_rivales_activos] = useState([])
  const [resultados_jugadores, set_resultados_jugadores] = useState([])
  const [resultados_rivales, set_resultados_rivales] = useState([])
  
  useEffect(() => {
    set_jugadores_activos(['jugador', 'jugador_mini'])
    set_rivales_activos(['rival', 'jugador_mini'])
  }, [])

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  function handle_dice(){
    let aux_jugadores = [];
    jugadores_activos.forEach(dato => {
      aux_jugadores.push({ jugador: dato, cantidad: Math.floor(getRandomArbitrary(jugadores[dato]['dado_min'], jugadores[dato]['dado_max'])) })
    });
    set_resultados_jugadores(aux_jugadores)

    let aux_rivales = [];
    rivales_activos.forEach(dato => {
      aux_rivales.push({ jugador: dato, cantidad: Math.floor(getRandomArbitrary(jugadores[dato]['dado_min'], jugadores[dato]['dado_max'])) })
    });
    set_resultados_rivales(aux_rivales)
  }

  function resultado(){
    let resultado = '';
    if(result_dice(false) != 0 && result_dice(true) != 0){
      if(result_dice(false) == result_dice(true)){
        resultado = 'Empate'
      }
      if(result_dice(false) < result_dice(true)){
        resultado = 'jugador gana'
      }
      if(result_dice(false) > result_dice(true)){
        resultado = 'rival gana'
      }
    }

    return(
      <div>
        {resultado}
      </div>
    )
  }

  function imagen_dado(dato){
    switch(dato){
      case 1: return require('./assets/icono_dado_uno.png');
      case 2: return require('./assets/icono_dado_dos.png');
      case 3: return require('./assets/icono_dado_tres.png');
      case 4: return require('./assets/icono_dado_cuatro.png');
      case 5: return require('./assets/icono_dado_cinco.png');
      case 6: return require('./assets/icono_dado_seis.png');
    }
  }

  function result_dice(tipo){
    let total = 0;
    if(tipo){
      resultados_jugadores.forEach(dato => {
        total += dato['cantidad']
      })
    }else{
      resultados_rivales.forEach(dato => {
        total += dato['cantidad']
      })
    }

    return total;
  }

  function color_resultado(){
    let color = 'white'
    if(result_dice(false) == result_dice(true)){
      color = 'yellow'
    }
    if(result_dice(false) > result_dice(true)){
      color = 'red'
    }
    if(result_dice(false) < result_dice(true)){
      color = 'green'
    }
    console.log(color)
    return color;
  }

  function find_resul(nombre, tipo){
    let index;
    if(tipo){
      index = resultados_jugadores.findIndex(
        (dato) => (dato['jugador'] == nombre)
      );
    }else{
      index = resultados_rivales.findIndex(
        (dato) => (dato['jugador'] == nombre)
      );
    }
    return index;
  }

  return(
    <div>
      <div
        style = {{
          background: "white",
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
        onClick = {() => handle_dice()}
      >
        Tirar dados
      </div>
      <div
        style={{
          flexDirection: 'row',
          display: "flex",
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          style={{ 
            display: 'flex',
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          {
            jugadores_activos.map((obj, i) => {
              return(
                <div 
                  key = {i}
                  style={{ 
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    style = {{
                      background: "white",
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {jugadores[obj]['nombre']}
                  </div>
                  {
                    find_resul(obj, true) >= 0 && resultados_jugadores[find_resul(obj, true)]['cantidad'] > 0 ? (
                      <div>
                        <img src = {imagen_dado(resultados_jugadores[find_resul(obj, true)]['cantidad'])} alt="Logo" />
                      </div>
                    ):null
                  }
                </div>
              )
            })
          }
        </div>
        <div 
          style={{ 
            background: "white",
            display: 'flex',
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          {
            rivales_activos.map((obj, i) => {
              return(
                <div 
                  key = {i}
                  style={{ 
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    style = {{
                      background: "white",
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {jugadores[obj]['nombre']}
                  </div>
                  {
                    find_resul(obj, false) >= 0 && resultados_rivales[find_resul(obj, false)]['cantidad'] > 0 ? (
                      <div>
                        <img src = {imagen_dado(resultados_rivales[find_resul(obj, false)]['cantidad'])} alt="Logo" />
                      </div>
                    ):null  
                  }
                </div>
              )
            })
          }
        </div>
      </div>
        {
         <div
            style = {{
              background: color_resultado(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            {resultado()}
          </div>
        }
    </div>
  );
}*/

function App() {
  const [mano, set_mano] = useState([
    'wastes',
  ])
  const [campo_tierras, set_campo_tierras] = useState([
    'wastes',
    'wastes',
    'wastes',
    'wastes',
    'wastes',
  ])
  const [campo_criaturas, set_campo_criaturas] = useState([])
  const [deck_cartas, set_deck_cartas] = useState(decks['prueba']['cartas'])

  function render_mano(){
    return(
      <Container 
        fluid
        style={{
          backgroundColor: 'blue'
        }}
      >
        <Row>
          {mano.map((obj, i) => (
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
        </Row>
      </Container>
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
    return(
      <Container 
        fluid
        style={{
          backgroundColor: 'red',
          display: "flex", 
          flex: 2
        }}
      >
        <Row>
          {campo_criaturas.map((obj, i) => (
            <Col>
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
            </Col>
          ))}
        </Row>
      </Container>
    )
  }

  function render_tierras(){
    return(
      <Container 
        fluid
        style={{
          backgroundColor: 'green',
          display: "flex", 
          flex: 2
        }}
      >
        <Row>
          {campo_tierras.map((obj, i) => (
            <Col>
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
            </Col>
          ))}
        </Row>
      </Container>
    )
  }

  return(
    <html>
      <body>
        <div style={{ display: "flex", height:'100vh', flexDirection: 'column' }}>
          {render_criaturas()}
          {render_tierras()}
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
                  console.log('aa')
                  var aux_mano = JSON.parse(JSON.stringify(mano));
                  var aux_deck = JSON.parse(JSON.stringify(deck_cartas));
                  console.log(aux_deck)
                  var carta = 0

                  console.log(carta)

                  aux_mano.push(aux_deck[carta])
                  console.log(aux_mano)
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
        </div>
      </body>
    </html>
  )
}



export default App;
