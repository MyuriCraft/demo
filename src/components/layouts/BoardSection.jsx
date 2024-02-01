const BoardSection = ({children, bgColor="slate-300", flexDirection="row", justifyContent=''}) => {
    return ( 
        <div className={`basis-1/3  h-2/6 flex flex-${flexDirection} gap-2 px-2 py-2 bg-${bgColor} ${justifyContent}`} >
            {children}
        </div>
    );
}

export default BoardSection;