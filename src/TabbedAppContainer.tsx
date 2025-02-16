import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import WeeklyCalendar from "./WeeklyCalendar.tsx";
import { Button } from "./components/ui/button.tsx";

const TabbedAppContainer = ({ App1, App2 }) => {
  const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
      <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-4">
      <div className="container mx-auto max-w-[1400px]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-neutral-50 
                        text-transparent bg-clip-text pb-2">
            Trading Dashboard
          </h1>
        </div>

        <LogoutButton />

        <div className="mb-8">
          <WeeklyCalendar />
        </div>

        <Tabs defaultValue="app1" className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-full grid-cols-2 bg-neutral-800">
              <TabsTrigger
                value="app1"
                className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                Pairs
              </TabsTrigger>
              <TabsTrigger
                value="app2"
                className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                Accounts
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="h-full">
            <TabsContent value="app1" className="m-0">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full"
                >
                  <App1 />
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="app2" className="m-0">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full"
                >
                  <App2 />
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TabbedAppContainer;