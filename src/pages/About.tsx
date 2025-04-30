
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
    description: 'Cuida da gerência da infraestrutura, conexões e cuidados com banco de dados.',
    avatar: 'erick.png',
    icon: <Database className="h-10 w-10" />
  },
  {
    name: 'Andrei Barone',
    role: 'Designer e Desenvolvedor',
    description: 'Combina habilidades de design, lógica e desenvolvimento para criar aplicações.',
    avatar: 'public/andrei.png',
    icon: <PenTool className="h-10 w-10" />
  },
  {
    name: 'Ígor',
    role: 'Desenvolvedor Fullstack',
    description: 'Responsável pelo desenvolvimento da aplicação, interface frontend e backend.',
    avatar: 'public/igor.png',
    icon: <Code className="h-10 w-10" />
  },
  {
    name: 'Gabriel',
    role: 'Analista de Requisitos',
    description: 'Identifica e documenta as necessidades dos usuários para guiar o desenvolvimento. Além de cuidar de toda documentação do projeto.',
    avatar: 'public/gabriel.png',
    icon: <FileSearch className="h-10 w-10" />
  },
  {
    name: 'Isaac Machado',
    role: 'Designer Figma e UI/UX',
    description: 'Cria protótipos e designs que priorizam a experiência do usuário.',
    avatar: 'public/isaac.png',
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
        {/* Hero Section - Updated with gradient text and animated underline */}
        <section className="relative bg-gradient-to-r from-fitcooker-orange/30 to-fitcooker-yellow/30 py-24 overflow-hidden">
          <div className="absolute inset-0 bg-pattern-chef opacity-5"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-black text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-sm animate-fade-in relative inline-block">
                Sobre o <span className="bg-clip-text text-transparent bg-gradient-to-r from-fitcooker-orange to-fitcooker-orange/80">FitCooker</span>
                
              </h1>
              <p className="text-gray-800 text-lg md:text-xl mb-8 animate-fade-in" style={{animationDelay: "0.2s"}}>
                Criando soluções incríveis para uma alimentação saudável e acessível para todos.
              </p>
              <div className="space-x-4 animate-fade-in" style={{animationDelay: "0.4s"}}>
                <Link to="/recipes">
                  <Button variant="default" size="lg" className="bg-black text-white hover:bg-fitcooker-orange hover:text-black transition-all duration-300">
                    Explorar Receitas
                  </Button>
                </Link>
                <a href="#team">
                  <Button variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-white transition-all duration-300">
                    Conhecer Equipe
                  </Button>
                </a>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </section>
        
        {/* Mission Section - Improved heading with animated underline */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="animate-on-scroll">
                  <h2 className="relative inline-block text-3xl md:text-4xl font-bold mb-6 text-gray-900 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-fitcooker-orange after:to-fitcooker-yellow after:origin-left after:transform after:scale-x-0 after:transition-all after:duration-500">
                    Nossa Missão <br/>
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow transform scale-x-0 transition-transform duration-700 origin-left animate-on-scroll active:scale-x-100"></span>
                  </h2>
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
                      src="https://images.pexels.com/photos/2130134/pexels-photo-2130134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
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
        
        {/* Team Section - Enhanced heading with animation */}
        <section id="team" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-700 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-fitcooker-orange after:to-fitcooker-yellow after:origin-center">
                Nossa Equipe
                <span className="block w-24 h-1 bg-fitcooker-orange mx-auto mt-2 rounded"></span>
              </h2>
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
