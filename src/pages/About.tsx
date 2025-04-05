
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Terminal, Laptop, Github, Database, Braces, Server } from 'lucide-react';

const About: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50
      }
    }
  };
  
  const teamMembers = [
    {
      id: 1,
      name: "Ana Silva",
      role: "Desenvolvedora Frontend",
      bio: "Especialista em React e interfaces responsivas",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tech: ["React", "TypeScript", "Tailwind"],
      icon: <Code className="h-6 w-6 text-purple-500" />
    },
    {
      id: 2, 
      name: "Carlos Mendes",
      role: "Desenvolvedor Backend",
      bio: "Arquiteto de APIs e soluções escaláveis",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tech: ["Node.js", "Express", "MongoDB"],
      icon: <Server className="h-6 w-6 text-green-500" />
    },
    {
      id: 3,
      name: "Mariana Costa",
      role: "Engenheira de Dados",
      bio: "Especialista em processamento e visualização de dados",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tech: ["Python", "SQL", "Data Science"],
      icon: <Database className="h-6 w-6 text-blue-500" />
    },
    {
      id: 4,
      name: "Paulo Oliveira",
      role: "Desenvolvedor Fullstack",
      bio: "Transformando ideias em soluções digitais acessíveis",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tech: ["JavaScript", "React", "Node.js"],
      icon: <Laptop className="h-6 w-6 text-orange-500" />
    },
    {
      id: 5,
      name: "Júlia Santos",
      role: "DevOps Engineer",
      bio: "Especialista em CI/CD e infraestrutura como código",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tech: ["Docker", "Kubernetes", "AWS"],
      icon: <Terminal className="h-6 w-6 text-red-500" />
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-fitcooker-orange/10 to-white py-20">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent opacity-40"></div>
          
          {/* Code brackets background elements */}
          <div className="absolute left-10 top-20 text-gray-200 opacity-10 text-8xl font-mono">{`{`}</div>
          <div className="absolute right-10 bottom-10 text-gray-200 opacity-10 text-8xl font-mono">{`}`}</div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Nossa Missão
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                  O FitCooker surgiu como um projeto universitário com um propósito claro: 
                  <span className="text-fitcooker-orange font-semibold"> democratizar o acesso à informação</span> para uma alimentação melhor.
                </p>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Acreditamos que comer bem não deve ser privilégio de poucos, mas direito de todos.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80" 
                  alt="Nossa história" 
                  className="rounded-xl shadow-lg"
                />
              </motion.div>
              
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading-lg mb-6">Nossa História</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Tudo começou em uma sala de aula, quando um grupo de estudantes universitários se uniu para resolver um problema comum: a dificuldade de encontrar receitas saudáveis, gostosas e com informações nutricionais precisas.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Percebemos que muitas pessoas desejavam melhorar seus hábitos alimentares, mas se sentiam perdidas em meio a tantas informações contraditórias ou complicadas. Foi aí que nasceu o FitCooker, com a missão de simplificar a alimentação saudável para todos.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  O que começou como um projeto acadêmico rapidamente se transformou em uma paixão compartilhada. Hoje, somos uma equipe multidisciplinar dedicada a criar a melhor plataforma de receitas fit do Brasil, combinando precisão nutricional com sabor e praticidade.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Our Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Nossos Valores</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                Nosso trabalho é orientado por princípios que nos ajudam a cumprir nossa missão de democratizar a alimentação saudável.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-12 h-12 bg-fitcooker-orange/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fitcooker-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="heading-sm mb-2">Acessibilidade</h3>
                <p className="text-gray-700">
                  Informações claras, receitas simples e ingredientes acessíveis para todos, independentemente do conhecimento prévio.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="w-12 h-12 bg-fitcooker-yellow/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fitcooker-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="heading-sm mb-2">Precisão</h3>
                <p className="text-gray-700">
                  Compromisso com informações nutricionais precisas e baseadas em conhecimento científico atualizado.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="heading-sm mb-2">Comunidade</h3>
                <p className="text-gray-700">
                  Construir uma comunidade colaborativa onde todos possam compartilhar, aprender e crescer juntos.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Team Section - Improved for developer theme */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block mb-4"
              >
                <Terminal className="h-12 w-12 mx-auto text-purple-600" />
                <div className="text-xs font-mono text-purple-600 mt-1">{'<Team />'}</div>
              </motion.div>
              <h2 className="heading-lg mb-4">Conheça Nossa Equipe</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                Um time de desenvolvedores apaixonados por tecnologia e nutrição, unidos para transformar a maneira como as pessoas se alimentam.
              </p>
              <div className="mt-4 flex justify-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
              </div>
            </div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {teamMembers.map((member) => (
                <motion.div 
                  key={member.id}
                  className="glassmorphism transition-transform hover:-translate-y-2 duration-300"
                  variants={itemVariants}
                >
                  <div className="relative overflow-hidden">
                    <div className="aspect-w-1 aspect-h-1">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Code pattern overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-50"></div>
                    
                    {/* Tech tags */}
                    <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                      {member.tech.map((tech, i) => (
                        <span key={i} className="text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-full font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-5 bg-gray-50 border-t border-purple-100">
                    <div className="flex items-center mb-2">
                      {member.icon}
                      <h3 className="font-bold text-lg ml-2">{member.name}</h3>
                    </div>
                    <p className="text-purple-600 text-sm mb-2 font-mono">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end gap-2">
                      <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                        <Github size={16} />
                      </a>
                      <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                        <Braces size={16} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Code snippet decoration */}
            <div className="flex justify-center mt-12">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="bg-gray-900 p-4 rounded-lg shadow-lg max-w-lg"
              >
                <pre className="text-green-400 text-xs font-mono overflow-x-auto">
                  <code>{`class DevelopmentTeam {
  constructor() {
    this.passion = "Creating amazing solutions";
    this.goal = "Make healthy eating accessible";
  }

  buildFitCooker() {
    return "The best recipe platform in Brazil";
  }
}`}</code>
                </pre>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Future Vision Section */}
        <section className="py-16 bg-fitcooker-orange/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-lg mb-6">Nossa Visão de Futuro</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Buscamos construir um mundo onde alimentação saudável e saborosa seja acessível a todos, 
                independentemente do conhecimento técnico, tempo disponível ou condição financeira.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Acreditamos que a informação de qualidade é o primeiro passo para transformar hábitos, 
                e trabalhamos incansavelmente para levar esse conhecimento a cada vez mais pessoas.
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white/50 backdrop-blur-sm border-fitcooker-orange/20">
                  <CardContent className="p-6 italic text-gray-700">
                    "Nosso sonho é ver o FitCooker se tornar o recurso número um para qualquer pessoa que deseje comer melhor, 
                    com uma biblioteca de receitas que atenda a qualquer objetivo, restrição alimentar ou preferência de paladar."
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Join Us Section */}
        <section className="py-16 bg-fitcooker-black text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                Faça Parte dessa Jornada
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-300 mb-8"
              >
                Compartilhe suas receitas, dê feedback e nos ajude a construir uma comunidade cada vez mais forte.
                Juntos, podemos transformar a maneira como as pessoas se alimentam.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <a href="/signup" className="btn btn-primary">
                  Criar Conta Grátis
                </a>
                <a href="/add-recipe" className="btn bg-white text-fitcooker-black hover:bg-gray-100">
                  Compartilhar Receita
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
