
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Scale, Ruler, ChefHat } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Ferramentas: React.FC = () => {
  const [activeTab, setActiveTab] = useState('macros');
  
  // Estados para Calculadora de Macros
  const [macrosData, setMacrosData] = useState({
    idade: '',
    peso: '',
    altura: '',
    atividade: '',
    objetivo: ''
  });
  const [macrosResult, setMacrosResult] = useState<any>(null);

  // Estados para Calculadora de IMC
  const [imcData, setImcData] = useState({
    peso: '',
    altura: ''
  });
  const [imcResult, setImcResult] = useState<any>(null);

  // Estados para Conversor
  const [conversorData, setConversorData] = useState({
    valor: '',
    de: '',
    para: ''
  });
  const [conversorResult, setConversorResult] = useState<any>(null);

  const calcularMacros = () => {
    const { idade, peso, altura, atividade, objetivo } = macrosData;
    
    if (!idade || !peso || !altura || !atividade || !objetivo) return;

    // Cálculo TMB (Taxa Metabólica Basal) - Fórmula de Harris-Benedict
    let tmb = 10 * parseFloat(peso) + 6.25 * parseFloat(altura) - 5 * parseFloat(idade) + 5;
    
    // Multiplicadores por nível de atividade
    const multiplicadores = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'intenso': 1.725,
      'muito-intenso': 1.9
    };

    let calorias = tmb * multiplicadores[atividade as keyof typeof multiplicadores];

    // Ajuste por objetivo
    if (objetivo === 'perder') calorias *= 0.8;
    else if (objetivo === 'ganhar') calorias *= 1.2;

    // Distribuição de macros
    const proteinas = parseFloat(peso) * 2; // 2g por kg
    const gorduras = calorias * 0.25 / 9; // 25% das calorias
    const carboidratos = (calorias - (proteinas * 4) - (gorduras * 9)) / 4;

    setMacrosResult({
      calorias: Math.round(calorias),
      proteinas: Math.round(proteinas),
      carboidratos: Math.round(carboidratos),
      gorduras: Math.round(gorduras)
    });
  };

  const calcularIMC = () => {
    const { peso, altura } = imcData;
    
    if (!peso || !altura) return;

    const imc = parseFloat(peso) / Math.pow(parseFloat(altura), 2);
    
    let classificacao = '';
    if (imc < 18.5) classificacao = 'Abaixo do peso';
    else if (imc < 25) classificacao = 'Peso normal';
    else if (imc < 30) classificacao = 'Sobrepeso';
    else classificacao = 'Obesidade';

    setImcResult({
      imc: imc.toFixed(1),
      classificacao
    });
  };

  const converterMedida = () => {
    const { valor, de, para } = conversorData;
    
    if (!valor || !de || !para) return;

    // Conversões básicas (todas para gramas como base)
    const conversoes = {
      'xicara-farinha': 120,
      'xicara-acucar': 200,
      'colher-sopa': 15,
      'colher-cha': 5,
      'ml': 1,
      'litro': 1000,
      'kg': 1000,
      'g': 1
    };

    const valorNumerico = parseFloat(valor);
    const resultado = valorNumerico * conversoes[de as keyof typeof conversoes] / conversoes[para as keyof typeof conversoes];

    setConversorResult({
      resultado: resultado.toFixed(2),
      unidade: para
    });
  };

  const tabs = [
    { id: 'macros', name: 'Macronutrientes', icon: Calculator },
    { id: 'imc', name: 'IMC', icon: Scale },
    { id: 'conversor', name: 'Conversor', icon: Ruler }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Ferramentas Culinárias
            </h1>
            <p className="text-gray-600 text-lg">
              Calculadoras e conversores para uma alimentação mais precisa
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-lg shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-all ${
                    activeTab === tab.id 
                      ? 'bg-fitcooker-orange text-white' 
                      : 'text-gray-600 hover:text-fitcooker-orange'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calculadora de Macronutrientes */}
          {activeTab === 'macros' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Calculadora de Macronutrientes</CardTitle>
                  <CardDescription>
                    Calcule suas necessidades diárias de calorias e macros
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="idade">Idade</Label>
                      <Input
                        id="idade"
                        type="number"
                        value={macrosData.idade}
                        onChange={(e) => setMacrosData(prev => ({ ...prev, idade: e.target.value }))}
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <Label htmlFor="peso">Peso (kg)</Label>
                      <Input
                        id="peso"
                        type="number"
                        value={macrosData.peso}
                        onChange={(e) => setMacrosData(prev => ({ ...prev, peso: e.target.value }))}
                        placeholder="70"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="altura">Altura (cm)</Label>
                    <Input
                      id="altura"
                      type="number"
                      value={macrosData.altura}
                      onChange={(e) => setMacrosData(prev => ({ ...prev, altura: e.target.value }))}
                      placeholder="175"
                    />
                  </div>

                  <div>
                    <Label>Nível de Atividade</Label>
                    <Select value={macrosData.atividade} onValueChange={(value) => setMacrosData(prev => ({ ...prev, atividade: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentario">Sedentário</SelectItem>
                        <SelectItem value="leve">Atividade Leve</SelectItem>
                        <SelectItem value="moderado">Atividade Moderada</SelectItem>
                        <SelectItem value="intenso">Atividade Intensa</SelectItem>
                        <SelectItem value="muito-intenso">Muito Intenso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Objetivo</Label>
                    <Select value={macrosData.objetivo} onValueChange={(value) => setMacrosData(prev => ({ ...prev, objetivo: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o objetivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perder">Perder Peso</SelectItem>
                        <SelectItem value="manter">Manter Peso</SelectItem>
                        <SelectItem value="ganhar">Ganhar Peso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={calcularMacros} className="w-full">
                    Calcular Macros
                  </Button>
                </CardContent>
              </Card>

              {macrosResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Seus Resultados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-fitcooker-orange/10 rounded-lg">
                        <div className="text-2xl font-bold text-fitcooker-orange">
                          {macrosResult.calorias} kcal
                        </div>
                        <div className="text-sm text-gray-600">Calorias por dia</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-bold text-blue-600">{macrosResult.proteinas}g</div>
                          <div className="text-sm text-gray-600">Proteínas</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-bold text-green-600">{macrosResult.carboidratos}g</div>
                          <div className="text-sm text-gray-600">Carboidratos</div>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <div className="font-bold text-yellow-600">{macrosResult.gorduras}g</div>
                          <div className="text-sm text-gray-600">Gorduras</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Calculadora de IMC */}
          {activeTab === 'imc' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Calculadora de IMC</CardTitle>
                  <CardDescription>
                    Calcule seu Índice de Massa Corporal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="peso-imc">Peso (kg)</Label>
                    <Input
                      id="peso-imc"
                      type="number"
                      value={imcData.peso}
                      onChange={(e) => setImcData(prev => ({ ...prev, peso: e.target.value }))}
                      placeholder="70"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="altura-imc">Altura (m)</Label>
                    <Input
                      id="altura-imc"
                      type="number"
                      step="0.01"
                      value={imcData.altura}
                      onChange={(e) => setImcData(prev => ({ ...prev, altura: e.target.value }))}
                      placeholder="1.75"
                    />
                  </div>

                  <Button onClick={calcularIMC} className="w-full">
                    Calcular IMC
                  </Button>
                </CardContent>
              </Card>

              {imcResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Seu IMC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="p-6 bg-fitcooker-orange/10 rounded-lg">
                        <div className="text-3xl font-bold text-fitcooker-orange">
                          {imcResult.imc}
                        </div>
                        <div className="text-lg font-medium text-gray-700 mt-2">
                          {imcResult.classificacao}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Abaixo de 18,5: Abaixo do peso</div>
                        <div>18,5 - 24,9: Peso normal</div>
                        <div>25,0 - 29,9: Sobrepeso</div>
                        <div>Acima de 30,0: Obesidade</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Conversor de Medidas */}
          {activeTab === 'conversor' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Conversor de Medidas</CardTitle>
                  <CardDescription>
                    Converta entre diferentes unidades culinárias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="valor">Valor</Label>
                    <Input
                      id="valor"
                      type="number"
                      value={conversorData.valor}
                      onChange={(e) => setConversorData(prev => ({ ...prev, valor: e.target.value }))}
                      placeholder="1"
                    />
                  </div>
                  
                  <div>
                    <Label>De</Label>
                    <Select value={conversorData.de} onValueChange={(value) => setConversorData(prev => ({ ...prev, de: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xicara-farinha">Xícara (farinha)</SelectItem>
                        <SelectItem value="xicara-acucar">Xícara (açúcar)</SelectItem>
                        <SelectItem value="colher-sopa">Colher de sopa</SelectItem>
                        <SelectItem value="colher-cha">Colher de chá</SelectItem>
                        <SelectItem value="ml">Mililitros</SelectItem>
                        <SelectItem value="litro">Litros</SelectItem>
                        <SelectItem value="g">Gramas</SelectItem>
                        <SelectItem value="kg">Quilogramas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Para</Label>
                    <Select value={conversorData.para} onValueChange={(value) => setConversorData(prev => ({ ...prev, para: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xicara-farinha">Xícara (farinha)</SelectItem>
                        <SelectItem value="xicara-acucar">Xícara (açúcar)</SelectItem>
                        <SelectItem value="colher-sopa">Colher de sopa</SelectItem>
                        <SelectItem value="colher-cha">Colher de chá</SelectItem>
                        <SelectItem value="ml">Mililitros</SelectItem>
                        <SelectItem value="litro">Litros</SelectItem>
                        <SelectItem value="g">Gramas</SelectItem>
                        <SelectItem value="kg">Quilogramas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={converterMedida} className="w-full">
                    Converter
                  </Button>
                </CardContent>
              </Card>

              {conversorResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resultado da Conversão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6 bg-fitcooker-orange/10 rounded-lg">
                      <div className="text-3xl font-bold text-fitcooker-orange">
                        {conversorResult.resultado}
                      </div>
                      <div className="text-lg text-gray-600 mt-2">
                        {conversorResult.unidade}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Ferramentas;
