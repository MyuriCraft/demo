const Card = ({card}) => {
    return ( 
        <>
            <img 
                src={card.imageUrl} 
                alt={card.name} 
                className="h-64 rounded-xl hover:scale-95 transition shadow-md shadow-slate-500/50" 
            />
        </>
     );
}

export default Card