
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Code, PenTool, Database, FileSearch, Figma, ChefHat, Heart } from 'lucide-react';

// Team member data - Reordered with Ígor in the middle (3rd position)
const teamMembers = [
  {
    name: 'Erick',
    role: 'Engenheiro de Dados',
    description: 'Gerencia a infraestrutura de dados e implementa soluções para análise de informações.',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    icon: <Database className="h-10 w-10" />
  },
  {
    name: 'Andrei Barone',
    role: 'Designer e Desenvolvedor',
    description: 'Combina habilidades de design e desenvolvimento para criar interfaces intuitivas.',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    icon: <PenTool className="h-10 w-10" />
  },
  {
    name: 'Ígor',
    role: 'Desenvolvedor Fullstack',
    description: 'Responsável pelo desenvolvimento da aplicação, integrando o frontend com o backend.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    icon: <Code className="h-10 w-10" />
  },
  {
    name: 'Gabriel',
    role: 'Analista de Requisitos',
    description: 'Identifica e documenta as necessidades dos usuários para guiar o desenvolvimento.',
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    icon: <FileSearch className="h-10 w-10" />
  },
  {
    name: 'Isaac Machado',
    role: 'Designer Figma e UI/UX',
    description: 'Cria protótipos e designs que priorizam a experiência do usuário.',
    avatar: 'https://randomuser.me/api/portraits/men/59.jpg',
    icon: <Figma className="h-10 w-10" />
  }
];

const About: React.FC = () => {
  // Add scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;
        
        if (isVisible) {
          el.classList.add('active');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section - Updated with better text contrast */}
        <section className="relative bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow py-24 overflow-hidden">
          <div className="absolute inset-0 bg-pattern-chef opacity-10"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-md">
                Sobre o FitCooker
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-8">
                Criando soluções incríveis para uma alimentação saudável e acessível para todos.
              </p>
              <div className="space-x-4">
                <Link to="/recipes">
                  <Button variant="default" size="lg" className="bg-white text-fitcooker-orange hover:bg-white/90 text-black">
                    Explorar Receitas
                  </Button>
                </Link>
                <a href="#team">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    Conhecer Equipe
                  </Button>
                </a>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </section>
        
        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="animate-on-scroll">
                  <h2 className="heading-lg mb-6 text-gray-900">Nossa Missão</h2>
                  <p className="text-lg text-gray-700 mb-8">
                    Fazendo comida saudável tornar-se acessível para todos, independentemente do nível de 
                    experiência na cozinha ou conhecimento nutricional.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="mt-1 bg-fitcooker-orange/10 p-2 rounded-full text-fitcooker-orange mr-4">
                        <ChefHat size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">A melhor plataforma de receitas do Brasil</h3>
                        <p className="text-gray-600">
                          Oferecemos receitas saudáveis, deliciosas e adaptadas a diferentes objetivos fitness.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mt-1 bg-fitcooker-orange/10 p-2 rounded-full text-fitcooker-orange mr-4">
                        <Heart size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Alimentação saudável para todos</h3>
                        <p className="text-gray-600">
                          Democratizamos o acesso à alimentação saudável com receitas simples e acessíveis.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative animate-on-scroll">
                  <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1499364615650-ec38552f4f34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80" 
                      alt="Equipe FitCooker" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <p className="text-white text-xl font-medium">
                        "Criando soluções incríveis para uma vida mais saudável"
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 h-64 w-64 bg-fitcooker-orange/10 rounded-full -z-10"></div>
                  <div className="absolute -top-8 -left-8 h-40 w-40 bg-fitcooker-yellow/10 rounded-full -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section - Updated to use a code-inspired design with all cards the same style */}
        <section id="team" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="heading-lg mb-4">Nossa Equipe</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Conheça os profissionais dedicados que transformam a visão do FitCooker em realidade.
              </p>
            </div>
            
            {/* Code-inspired background design */}
            <div className="relative mb-16">
              <div className="absolute inset-0 opacity-5 overflow-hidden">
                <pre className="text-xs text-left">
                  {`
function FitCooker() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Load our amazing recipes
    fetchRecipes().then(data => {
      setRecipes(data);
      setLoading(false);
    });
  }, []);
  
  return (
    <div className="app">
      <Header />
      <main>
        <Team members={teamMembers} />
        <RecipesList recipes={recipes} />
      </main>
      <Footer />
    </div>
  );
}

// A melhor plataforma de receitas do Brasil
export default FitCooker;
                  `}
                </pre>
              </div>
            </div>
            
            {/* Team members in a row - All cards with the same style */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="animate-on-scroll" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-black text-white rounded-xl shadow-md p-6 h-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2 border border-gray-700">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-gray-700">
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-green-400 text-sm font-medium mb-4">{member.role}</p>
                      <p className="text-gray-400 text-sm mb-6">{member.description}</p>
                      
                      <div className="p-2 bg-gray-800 text-green-400 rounded-full mt-auto">
                        {member.icon}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
