import { useEffect, useState, useRef } from 'react';
import { cartas } from '../datos/cartas';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

function Carta({ id, tipo, func_inv, func_mano, func_deck }){
  const [mostrar, set_mostrar] = useState(false)
  const [rotacion, set_rotacion] = useState('0deg')
  const [menu_button, set_menu_button] = useState(false)
  const [contadores, set_contadores] = useState([])
  const [text, set_text] = useState([])

  const atk_ref = useRef(null)
  const def_ref = useRef(null)

  useEffect(() => {
    const keyDownHandler = event => {
      if (event.key === 'm') {
        event.preventDefault();
        set_menu_button(true)
      }
    };
    const keyUpHandler = event => {
      if (event.key === 'm') {
        event.preventDefault();
        set_menu_button(false)
      }
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  function render_contadores(){
    return(
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          zIndex: 200
        }}
      >
        {contadores.map((obj, i) => (
          <div
            style={{
              backgroundColor: 'white',
              padding: 1,
              borderRadius: 5,
              marginTop: 3
            }}
            onDoubleClick={() => {
              var aux = contadores;
              aux.splice(i, 1)
              set_contadores(aux)
            }}
          >
            {obj}
          </div>
        ))}
      </div>
    )
  }

  return(
    <div 
      style={{ 
        display: "flex", 
        flexDirection: 'row', 
        height: 150, 
        width: 100, 
        position: 'relative',
        margin: 5
      }} 
    >
      <div
        style={{
          flex: 1,
          backgroundColor: 'black',
          rotate: rotacion
        }}
        onClick={() => menu_button ? set_mostrar(true):{}}
        onDoubleClick={() => {
          rotacion === '0deg' && tipo === 'campo' ? set_rotacion('90deg'):set_rotacion('0deg')
        }}
      >
        <img 
          style={{
            height: 150, 
            width: 100, 
          }}
          src={cartas[id]['img']} 
          alt="Logo" 
        />
        {render_contadores()}
      </div>
      {mostrar && (
        <Container
          style={{
            display: 'table', 
            position: 'absolute',
            top: 0,
            zIndex: 100,
            backgroundColor: 'white',
            borderRadius: 5,
            flex: 1,
          }}
        >  
          <Col>
            Opciones
            {tipo === 'mano' ? (
              <div
                style={{
                  backgroundColor: 'green',
                  display: "flex", 
                  flex: 1,
                  borderBottomWidth: 2
                }}
                onClick={() => {
                  func_inv()
                  set_menu_button(false)
                }}
              >
                anadir al campo
              </div>
            ):(
              <div
                style={{
                  display: "flex", 
                  flex: 1,
                  borderBottomWidth: 2,
                  borderColor: 'black'
                }}
                onClick={() => {
                  func_mano()
                  set_menu_button(false)
                }}
              >
                Añadir a la mano
              </div>
            )}
            <div
              style={{
                display: "flex", 
                flex: 1,
                borderBottomWidth: 2
              }}
              onClick={() => {
                func_deck(0)
                set_menu_button(false)
              }}
            >
              Devolver al deck
            </div>
            <div
              style={{
                display: "flex", 
                flex: 1,
                borderBottomWidth: 2
              }}
              onClick={() => {
                func_deck(1)
                set_menu_button(false)
              }}
            >
              Devolver al tope del deck
            </div>
            <div
              style={{
                display: 'flex', 
                borderWidth: 2,
                borderBottomColor: "black"
              }}
              onClick={() => {
                func_deck(2)
                set_menu_button(false)
              }}
            >
              Devolver al fondo del deck
            </div>
            {tipo === 'campo' && (
            <div
              style={{
                display: "flex", 
                flex: 1,
                flexDirection: 'row', 
                borderBottomWidth: 2,
              }}
            >
              <div
                style={{
                  width: '55%',
                  overflowWrap: 'break-word'
                }}
              >
                Contador
              </div>
              <input 
                ref={atk_ref}
                name="atk" 
                style={{
                  width: '15%'
                }}
              />
              /
              <input 
                ref={def_ref}
                name="def" 
                style={{
                  width: '15%'
                }}
              />
              <div
                onClick={() => {
                  var aux = contadores;
                  aux.push('+' + atk_ref.current.value + '/+' + def_ref.current.value)
                  set_contadores(aux)
                }}
                style={{
                  display: "flex", 
                  flex: 1,
                  width: '15%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </div>
            </div>)}
            <div
              style={{
                display: "flex", 
                flex: 1,
                flexDirection: 'column', 
                borderBottomWidth: 2
              }}
            >
              Palabras clave
              <input 
                name="def"
                value={text}
                onChange={(event) => set_text(event.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex", 
                flex: 1,
                flexDirection: 'row', 
                borderBottomWidth: 2
              }}
              onClick={() => {set_mostrar(false)}}
            >
              Cerrar
            </div>
          </Col>
        </Container>
      )}
    </div>
  )
}

export default Carta;