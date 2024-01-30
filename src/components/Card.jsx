import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from "@/components/ui/context-menu"

const Card = ({card}) => {
    return ( 
        <ContextMenu>
            <ContextMenuTrigger asChild className="h-64 rounded-xl hover:scale-95 transition" >
                    <img 
                        src={card.imageUrl} 
                        alt={card.name} 
                    />
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>Profile</ContextMenuItem>
                <ContextMenuItem>Billing</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Team</ContextMenuItem>
                <ContextMenuItem>Subscription</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}

export default Card