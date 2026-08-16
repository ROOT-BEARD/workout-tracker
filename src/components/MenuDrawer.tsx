import { Button, Drawer } from "@heroui/react";
import { Link } from "react-router-dom";

export default function MenuDrawer(){
    return(
        <Drawer>
            <Button>|||</Button>
            <Drawer.Backdrop>
                <Drawer.Content placement="left">
                    <Drawer.Dialog>
                        <Drawer.CloseTrigger />
                        <Drawer.Header>
                            <Drawer.Heading>MENU</Drawer.Heading>
                        </Drawer.Header>
                        <Drawer.Body style={{display:'flex', flexDirection:'column'}}>
                            <Link to={'/'}>Home</Link>
                            <Link to={'/WorkoutPage'}>WorkoutPage</Link>
                            <Button variant='ghost'>Home</Button>
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    );
}