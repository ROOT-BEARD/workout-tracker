import { Button, Drawer } from "@heroui/react";
import { Link } from "react-router-dom";
import { Bars } from "@gravity-ui/icons";

export default function MenuDrawer(){
    return(
        <Drawer>
            <Button variant='ghost' className='absolute'><Bars/></Button>
            <Drawer.Backdrop>
                <Drawer.Content placement="left">
                    <Drawer.Dialog>
                        <Drawer.CloseTrigger />
                        <Drawer.Header>
                            <Drawer.Heading>MENU</Drawer.Heading>
                        </Drawer.Header>
                        <Drawer.Body style={{display:'flex', flexDirection:'column'}}>
                            <Link to={'/'}><Button variant="ghost">HOME</Button></Link>
                            <Link to={'/WorkoutPage'}><Button variant="ghost" >WORKOUT CALENDAR</Button></Link>
                            <Link to={'/AccountPage'}><Button variant="ghost" >ACCOUNT</Button></Link>
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    );
}