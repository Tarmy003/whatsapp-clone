import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      This Page can only be seen by authenticated users.
      <UserButton afterSwitchSessionUrl="/" />
    </div>
  );
}
