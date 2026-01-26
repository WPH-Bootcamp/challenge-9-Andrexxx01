import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthTabsProps {
  signInContent: React.ReactNode;
  signUpContent: React.ReactNode;
}

export default function AuthTabs({
  signInContent,
  signUpContent,
}: AuthTabsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const value = location.pathname === "/sign-up" ? "sign-up" : "sign-in";
  return (
    <Tabs
      value={value}
      onValueChange={(v) => navigate(v === "sign-up" ? "/sign-up" : "/sign-in")}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 bg-neutral-100 p-2 gap-2 rounded-4 h-12 md:h-14">
        <TabsTrigger
          value="sign-in"
          className="
            rounded-2 -mt-0.5 h-9 md:h-10 text-sm md:text-md text-neutral-600
            data-[state=active]:box-shadow: 0px 0px 20px 0px #CBCACA40 data-[state=active]:font-bold 
            data-[state=active]:text-neutral-950 font-medium cursor-pointer"
        >
          Sign in
        </TabsTrigger>
        <TabsTrigger
          value="sign-up"
          className="
            rounded-2 -mt-0.5 h-9 md:h-10 text-neutral-600 text-sm md:text-md
            data-[state=active]:box-shadow: 0px 0px 20px 0px #CBCACA40 data-[state=active]:font-bold 
            data-[state=active]:text-neutral-950 font-medium cursor-pointer"
        >
          Sign up
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sign-in" className="mt-4">
        {signInContent}
      </TabsContent>

      <TabsContent value="sign-up" className="mt-4">
        {signUpContent}
      </TabsContent>
    </Tabs>
  );
}
