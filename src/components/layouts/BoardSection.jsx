const BoardSection = ({children, bgColor="slate-300"}) => {
    return ( 
        <div className={`basis-1/3 bg-${bgColor} h-2/6 flex flex-row gap-2 px-2 py-2`}>
            {children}
        </div>
    );
}

export default BoardSection;