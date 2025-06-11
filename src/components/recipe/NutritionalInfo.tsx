
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Zap, Beef, Wheat, Droplets, Info, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface NutritionalInfoProps {
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  servings: number;
}

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ macros, servings }) => {
  const [showPerServing, setShowPerServing] = useState(true);
  
  const displayMacros = showPerServing ? {
    calories: Math.round(macros.calories / servings),
    protein: Math.round(macros.protein / servings),
    carbs: Math.round(macros.carbs / servings),
    fat: Math.round(macros.fat / servings)
  } : macros;

  const totalCaloriesFromMacros = (displayMacros.protein * 4) + (displayMacros.carbs * 4) + (displayMacros.fat * 9);
  
  const macroPercentages = {
    protein: totalCaloriesFromMacros > 0 ? (displayMacros.protein * 4 / totalCaloriesFromMacros) * 100 : 0,
    carbs: totalCaloriesFromMacros > 0 ? (displayMacros.carbs * 4 / totalCaloriesFromMacros) * 100 : 0,
    fat: totalCaloriesFromMacros > 0 ? (displayMacros.fat * 9 / totalCaloriesFromMacros) * 100 : 0
  };

  const macroData = [
    {
      name: 'Proteínas',
      value: displayMacros.protein,
      unit: 'g',
      percentage: macroPercentages.protein,
      color: 'bg-blue-500',
      icon: Beef,
      lightColor: 'bg-blue-100',
      calories: displayMacros.protein * 4
    },
    {
      name: 'Carboidratos',
      value: displayMacros.carbs,
      unit: 'g',
      percentage: macroPercentages.carbs,
      color: 'bg-green-500',
      icon: Wheat,
      lightColor: 'bg-green-100',
      calories: displayMacros.carbs * 4
    },
    {
      name: 'Gorduras',
      value: displayMacros.fat,
      unit: 'g',
      percentage: macroPercentages.fat,
      color: 'bg-yellow-500',
      icon: Droplets,
      lightColor: 'bg-yellow-100',
      calories: displayMacros.fat * 9
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-fitcooker-orange" />
            Informações Nutricionais
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPerServing(!showPerServing)}
              className="text-xs"
            >
              {showPerServing ? 'Por porção' : 'Total'}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tabela Nutricional Completa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Por Porção</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Calorias:</span>
                          <span className="font-medium">{Math.round(macros.calories / servings)} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Proteínas:</span>
                          <span className="font-medium">{Math.round(macros.protein / servings)}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carboidratos:</span>
                          <span className="font-medium">{Math.round(macros.carbs / servings)}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gorduras:</span>
                          <span className="font-medium">{Math.round(macros.fat / servings)}g</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Total da Receita</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Calorias:</span>
                          <span className="font-medium">{Math.round(macros.calories)} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Proteínas:</span>
                          <span className="font-medium">{Math.round(macros.protein)}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carboidratos:</span>
                          <span className="font-medium">{Math.round(macros.carbs)}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gorduras:</span>
                          <span className="font-medium">{Math.round(macros.fat)}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">
                      * Valores aproximados baseados nos ingredientes fornecidos. 
                      Para informações nutricionais mais precisas, consulte um nutricionista.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Calorias Destaque */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-fitcooker-orange to-orange-600 rounded-full shadow-lg">
              <div className="flex flex-col items-center text-white">
                <Zap className="w-6 h-6 mb-1" />
                <span className="text-lg font-bold">{displayMacros.calories}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Calorias {showPerServing ? 'por porção' : 'total'}
            </p>
          </motion.div>

          {/* Macronutrientes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {macroData.map((macro, index) => (
              <motion.div
                key={macro.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className={`p-4 rounded-lg ${macro.lightColor} border border-gray-200`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <macro.icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{macro.name}</span>
                    </div>
                    <span className="text-lg font-bold">{macro.value}{macro.unit}</span>
                  </div>
                  
                  <Progress 
                    value={macro.percentage} 
                    className="h-2 mb-2"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{macro.percentage.toFixed(1)}%</span>
                    <span>{macro.calories} kcal</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Distribuição Visual */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Distribuição Calórica</h4>
            <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
              <div 
                className="bg-blue-500 transition-all duration-500" 
                style={{ width: `${macroPercentages.protein}%` }}
                title={`Proteínas: ${macroPercentages.protein.toFixed(1)}%`}
              />
              <div 
                className="bg-green-500 transition-all duration-500" 
                style={{ width: `${macroPercentages.carbs}%` }}
                title={`Carboidratos: ${macroPercentages.carbs.toFixed(1)}%`}
              />
              <div 
                className="bg-yellow-500 transition-all duration-500" 
                style={{ width: `${macroPercentages.fat}%` }}
                title={`Gorduras: ${macroPercentages.fat.toFixed(1)}%`}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionalInfo;
