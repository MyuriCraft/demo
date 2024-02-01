import { useEffect, useState } from 'react';

import { Button } from "@/components/ui/button"
import Card from './Card';

const NavPage = (props) => {
    return (
        <div className='flex justify-between items-center space-x-4'>
            <p className='grow'>Página: {props.page}</p>
            {
                props.page > 1 &&
                    <Button variant="outline"
                    onClick={()=> props.setPage(props.page - 1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 me-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                    </svg>

                    Anterior 
                </Button>
            }
            
            <Button 
                onClick={()=> props.setPage(props.page + 1)}
            >
                Siguiente
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 ms-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </Button>
        </div>
        
    )
}

const CardList = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
 
    useEffect (()=>{
      const fetchDataMTG = async () => {
        const response = await fetch(`https://api.magicthegathering.io/v1/cards?contains=imageUrl&page=${page}`)
        const data = await response.json()
        setLoading(false)
        setCards(data.cards)
      }
  
      fetchDataMTG();
    }, [page])

    return ( 
        <>
            <NavPage page={page} setPage={setPage} />
            {
                loading ? ( 
                    <h1>Loading</h1> 
                ) :(
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-5 mt-5' >
                        {
                            cards.map((card) => {
                                return(
                                        <Card  card={card} key={card.id} />
                                )
                            })
                        }
                    </div>
                )
            }
            <NavPage page={page} setPage={setPage} />
        </>
     );
}

export default CardList