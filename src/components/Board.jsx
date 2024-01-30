import Hand from './Hand';

const Board = () => {
    return ( 
        <section className="h-dvh bg-slate-100 flex flex-col">
            <div className="basis-1/3 bg-slate-300">

            </div>
            <div className="basis-1/3 bg-slate-200">

            </div>
            <div className="basis-1/3">

            </div>
            <Hand />
        </section>
    );
}

export default Board;