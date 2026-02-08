import { Code, FileText, Sparkles, Target, TrendingUp, Award } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Code,
    title: "Code Quality Summarization",
    description: "AI analyzes your code repositories to highlight your best work and technical achievements.",
    gradient: "from-purple-500 to-purple-600",
    size: "large"
  },
  {
    icon: FileText,
    title: "Auto Project Documentation",
    description: "Automatically generates compelling descriptions for your projects.",
    gradient: "from-blue-500 to-blue-600",
    size: "medium"
  },
  {
    icon: Sparkles,
    title: "Resume-to-Website Transformation",
    description: "Converts your resume into a beautiful, interactive portfolio website.",
    gradient: "from-indigo-500 to-indigo-600",
    size: "medium"
  },
  {
    icon: Target,
    title: "Recruiter-Optimized Design",
    description: "Designed to capture attention and make a lasting impression on recruiters.",
    gradient: "from-violet-500 to-violet-600",
    size: "large"
  }
];

const bonusFeatures = [
  {
    icon: TrendingUp,
    title: "Portfolio Improvement Coaching",
    description: "Get AI-powered suggestions to enhance your portfolio's impact.",
    gradient: "from-cyan-500 to-cyan-600"
  },
  {
    icon: Award,
    title: "ATS Optimization Scoring",
    description: "Ensure your portfolio passes applicant tracking systems.",
    gradient: "from-teal-500 to-teal-600"
  }
];

export function BentoGrid() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to create a professional portfolio that stands out
          </p>
        </div>
        
        {/* Horizontal scrolling bento grid */}
        <div className="overflow-x-auto pb-6 -mx-6 px-6">
          <div className="flex gap-6 min-w-max">
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.title} 
                feature={feature} 
                index={index}
              />
            ))}
          </div>
        </div>
        
        {/* Bonus Features Section */}
        <div className="mt-16">
          <h3 className="text-3xl text-center mb-8">Bonus Features</h3>
          <div className="flex gap-6 justify-center flex-wrap">
            {bonusFeatures.map((feature, index) => (
              <BonusFeatureCard 
                key={feature.title} 
                feature={feature} 
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const Icon = feature.icon;
  const isLarge = feature.size === "large";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`
        relative overflow-hidden rounded-2xl bg-gradient-to-br ${feature.gradient} 
        p-8 text-white flex-shrink-0
        ${isLarge ? 'w-[400px] h-[300px]' : 'w-[350px] h-[300px]'}
        hover:scale-105 transition-transform duration-300 cursor-pointer
      `}
    >
      <div className="relative z-10 h-full flex flex-col">
        <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
          <Icon className="size-6" />
        </div>
        <h3 className="text-2xl mb-3">{feature.title}</h3>
        <p className="text-white/90 text-base">{feature.description}</p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-10 -right-10 size-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -top-10 -left-10 size-32 bg-white/10 rounded-full blur-2xl" />
    </motion.div>
  );
}

function BonusFeatureCard({ feature, index }: { feature: typeof bonusFeatures[0], index: number }) {
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`
        relative overflow-hidden rounded-2xl bg-gradient-to-br ${feature.gradient} 
        p-6 text-white w-[350px]
        hover:scale-105 transition-transform duration-300 cursor-pointer
      `}
    >
      <div className="relative z-10 flex items-start gap-4">
        <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
          <Icon className="size-6" />
        </div>
        <div>
          <h4 className="text-xl mb-2">{feature.title}</h4>
          <p className="text-white/90 text-sm">{feature.description}</p>
        </div>
      </div>
      
      <div className="absolute -bottom-6 -right-6 size-24 bg-white/10 rounded-full blur-xl" />
    </motion.div>
  );
}
