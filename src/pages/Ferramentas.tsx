
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Scale, Ruler, Search } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MacroCalculator from '@/components/ferramentas/MacroCalculator';
import IMCCalculator from '@/components/ferramentas/IMCCalculator';
import UnitConverter from '@/components/ferramentas/UnitConverter';
import NutrientCalculator from '@/components/ferramentas/NutrientCalculator';

const Ferramentas: React.FC = () => {
  const [activeTab, setActiveTab] = useState('macros');

  const tabs = [
    { id: 'macros', name: 'Macronutrientes', icon: Calculator },
    { id: 'imc', name: 'IMC', icon: Scale },
    { id: 'conversor', name: 'Conversor', icon: Ruler },
    { id: 'nutrientes', name: 'Nutrientes', icon: Search }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Ferramentas Culinárias
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Calculadoras e conversores para uma alimentação mais precisa e consciente
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white p-1 rounded-xl shadow-lg">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-fitcooker-orange text-white shadow-md' 
                      : 'text-gray-600 hover:text-fitcooker-orange hover:bg-orange-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'macros' && <MacroCalculator />}
            {activeTab === 'imc' && <IMCCalculator />}
            {activeTab === 'conversor' && <UnitConverter />}
            {activeTab === 'nutrientes' && <NutrientCalculator />}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Ferramentas;
