
import './App.css'
import CardList from "./components/CardList"

const App = () => {
  return ( 
    <div className='m-5'>
      <h1 className='text-2xl font-semibold pb-5'>Cartas MTG</h1>
      <CardList />
    </div>
   );
}

export default App