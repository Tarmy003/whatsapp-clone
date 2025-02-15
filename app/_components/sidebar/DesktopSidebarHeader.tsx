"use client"

import { User } from "@prisma/client";
import NewChatSheet from "./sheets/NewChatSheet";
import NewContactSheet from "./sheets/NewContactSheet";

interface DesktopSidebarHeaderProps {
    currentUser: User & {
        following: User[]
    }
}

const DesktopSidebarheader = ({
    currentUser
}: DesktopSidebarHeaderProps) => {
    return ( 
        <div>
            <NewContactSheet 
            handleAddContact={() => {}}
            />
            <NewChatSheet
            currentUser={currentUser}
             />
        </div>
     );
}
 
export default DesktopSidebarheader;