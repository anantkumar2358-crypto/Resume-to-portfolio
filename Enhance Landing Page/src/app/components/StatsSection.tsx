import { motion } from "motion/react";
import { Users, Briefcase, Star, Zap } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Active Users" },
  { icon: Briefcase, value: "50,000+", label: "Portfolios Created" },
  { icon: Star, value: "4.9/5", label: "User Rating" },
  { icon: Zap, value: "< 5 min", label: "Setup Time" }
];

export function StatsSection() {
  return (
    <section className="py-16 px-6 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center size-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl mb-3">
                  <Icon className="size-6 text-purple-600" />
                </div>
                <div className="text-3xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
