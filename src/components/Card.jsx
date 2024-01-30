const Card = ({card}) => {
    return ( 
        <div className="">
            <img 
                src={card.imageUrl} 
                alt={card.name} 
                className="w-full rounded-xl hover:scale-110 transition shadow-md shadow-slate-500/50" 
            />
                
            <div className="p-4 flex items-center justify-between">
                <h2 className="text-base font-medium">
                    {card.name}
                </h2>
                <h2 className="text-base font-medium">
                    {card.set}
                </h2>
            </div>
        </div>
     );
}

export default Card