import { useEffect, useState } from 'react';
import Card from './Card';

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"  

import { cards } from '../data/cards';

const Hand = () => {

    return ( 
        <Drawer>
            <DrawerTrigger>
                <Button variant="outline">Hand</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    {/* <DrawerTitle>Tu manita</DrawerTitle> */}
                    <DrawerDescription className="flex gap-4 overflow-x-auto">
                        {
                            cards.map((card) => {
                                return(
                                    <Card  card={card} key={card.id} />
                                )
                            })
                        }
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <DrawerClose>
                        <Button variant="outline">Cerrar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export default Hand;