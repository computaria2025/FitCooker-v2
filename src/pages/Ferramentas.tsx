
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Scale, Ruler, Search, Info, Target, Activity, Zap } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MacroCalculator from '@/components/ferramentas/MacroCalculator';
import IMCCalculator from '@/components/ferramentas/IMCCalculator';
import UnitConverter from '@/components/ferramentas/UnitConverter';
import NutrientCalculator from '@/components/ferramentas/NutrientCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Ferramentas: React.FC = () => {
  const [activeTab, setActiveTab] = useState('macros');

  const tabs = [
    { 
      id: 'macros', 
      name: 'Macronutrientes', 
      icon: Calculator,
      description: 'Calcule suas necessidades diárias de proteínas, carboidratos e gorduras',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'imc', 
      name: 'IMC', 
      icon: Scale,
      description: 'Descubra seu Índice de Massa Corporal e sua classificação',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'conversor', 
      name: 'Conversor', 
      icon: Ruler,
      description: 'Converta medidas culinárias e unidades de peso facilmente',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'nutrientes', 
      name: 'Nutrientes', 
      icon: Search,
      description: 'Pesquise informações nutricionais detalhadas dos alimentos',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar />
      
      <main className="flex-grow">
        {/* Enhanced Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 text-white py-20"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm"
                >
                  <Calculator className="w-12 h-12" />
                </motion.div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Ferramentas Culinárias
              </h1>
              <p className="text-xl md:text-2xl text-orange-100 mb-8 leading-relaxed">
                Calculadoras e conversores profissionais para uma alimentação mais precisa e consciente
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Target className="w-5 h-5 mr-2" />
                  <span className="font-medium">Precisão Nutricional</span>
                </div>
                <div className="flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Activity className="w-5 h-5 mr-2" />
                  <span className="font-medium">Resultados Instantâneos</span>
                </div>
                <div className="flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Zap className="w-5 h-5 mr-2" />
                  <span className="font-medium">Fácil de Usar</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
          {/* Enhanced Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 max-w-4xl w-full">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative p-4 rounded-xl transition-all duration-300 text-left ${
                      activeTab === tab.id 
                        ? 'text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl`}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative z-10">
                      <div className="flex items-center space-x-3 mb-2">
                        <tab.icon className="w-5 h-5" />
                        <span className="font-semibold">{tab.name}</span>
                      </div>
                      <p className={`text-sm ${
                        activeTab === tab.id ? 'text-white/90' : 'text-gray-500'
                      }`}>
                        {tab.description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Tool Info Card */}
          {activeTabData && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Card className="border-0 bg-gradient-to-r from-gray-50 to-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${activeTabData.color} rounded-xl text-white shadow-lg`}>
                      <activeTabData.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Como usar: {activeTabData.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {activeTab === 'macros' && "Insira suas informações pessoais (idade, peso, altura, sexo e nível de atividade) para calcular suas necessidades diárias de macronutrientes. A calculadora fornecerá recomendações personalizadas com base em seus objetivos."}
                        {activeTab === 'imc' && "Digite seu peso atual e altura para calcular automaticamente seu Índice de Massa Corporal. O resultado incluirá sua classificação (abaixo do peso, normal, sobrepeso, etc.) e dicas de saúde."}
                        {activeTab === 'conversor' && "Converta facilmente entre diferentes unidades de medida usadas na culinária. Ideal para adaptar receitas internacionais ou converter entre sistemas métrico e imperial."}
                        {activeTab === 'nutrientes' && "Pesquise alimentos específicos para obter informações nutricionais detalhadas, incluindo vitaminas, minerais e macronutrientes por porção."}
                      </p>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <Info className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-4xl">
              {activeTab === 'macros' && <MacroCalculator />}
              {activeTab === 'imc' && <IMCCalculator />}
              {activeTab === 'conversor' && <UnitConverter />}
              {activeTab === 'nutrientes' && <NutrientCalculator />}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Ferramentas;
