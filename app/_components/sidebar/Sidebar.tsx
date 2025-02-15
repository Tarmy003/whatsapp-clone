import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import DesktopSidebarheader from "./DesktopSidebarHeader";
import getConversations from "@/app/_actions/getConversations";
import ConversationList from "@/app/conversations/_components/ConversationList";

async function Sidebar({children}: {
    children: React.ReactNode
}) {
    const {currentUserPrisma} = await getCurrentUser()
    const conversations = await getConversations()
    return (
        <div className="h-full w-screen flex">
            <aside className="h-full min-w-[300px] bg-zinc-400">
                <DesktopSidebarheader
                currentUser={currentUserPrisma}
                 /> 
                <ConversationList 
                conversations={conversations}
                />
            </aside>
            <main>
                {children}
            </main>
        </div>
    )
}

export default Sidebar;