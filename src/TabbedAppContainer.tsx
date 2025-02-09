import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

const TabbedAppContainer = ({ App1, App2 }) => {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto max-w-[1400px]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 
                        text-transparent bg-clip-text pb-2">
            Trading Dashboard
          </h1>
        </div>

        <Tabs defaultValue="app1" className="w-full">
          <div className="mb-6 flex justify-center">
            <TabsList className="bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl border border-sky-500/20">
              <TabsTrigger
                value="app1"
                className="px-8 py-2 text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 
                        data-[state=active]:via-sky-500 data-[state=active]:to-sky-600 data-[state=active]:text-white 
                        rounded-lg transition-all duration-300"
              >
                Pairs
              </TabsTrigger>
              <TabsTrigger
                value="app2"
                className="px-8 py-2 text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 
                        data-[state=active]:via-sky-500 data-[state=active]:to-sky-600 data-[state=active]:text-white 
                        rounded-lg transition-all duration-300"
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