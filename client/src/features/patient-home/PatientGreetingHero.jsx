import { motion } from "framer-motion";

export default function PatientGreetingHero({ name = "Friend" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg text-center"
    >
      <h1 className="text-3xl font-bold sm:text-4xl" data-testid="text-greeting">
        Hello, {name}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">How can we help you today?</p>
    </motion.div>
  );
}
