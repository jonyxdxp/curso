import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import ModulePage from './pages/ModulePage';
import LoginPage from './pages/LoginPage';

import { ThemeProvider } from './components/shared/ThemeContext';
import ProfessorDashboard from './pages/ProfessorDashboard';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import EstudianteDetalle from './pages/EstudianteDetalle';

import PaymentRequired from './components/PaymentRequired';

// Export modules data for reuse (mantener compatibilidad con código existente)
export interface ModuleData {
  id: number;
  badge: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  objectives: string[];
  exercise: {
    title: string;
    description: string;
    deadline: string;
  };
  content: Array<{
    type: string;
    title?: string;
    body?: string;
    quote?: string;
    author?: string;
  }>;
  resources: Array<{
    title: string;
    type: string;
  }>;
}

// Datos de módulos para la landing page (visualización estática)
export const modulesData = [
  {
    id: 1,
    badge: 'MÓDULO 01',
    title: 'El silencio de la mirada',
    description: 'Antes de pintar, mirar. Aprender a detenerse, recorrer una imagen con la atención y registrar lo que se siente antes de lo que se piensa.',
    image: '/images/module01_bg.jpg',
    duration: '2 semanas',
    objectives: [
      'Desarrollar la capacidad de observación prolongada',
      'Registrar sensaciones antes de juicios',
      'Construir un vocabulario visual personal',
    ],
    exercise: {
      title: 'El ejercicio del minuto',
      description: 'Durante 7 días, dedica 10 minutos a mirar un mismo objeto. Sin dibujar, sin fotografiar. Solo mirar. Al final, escribe lo que viste.',
      deadline: '20 de Octubre 2026',
    },
    content: [
      {
        type: 'text',
        title: 'La mirada como acto creativo',
        body: 'Todo comienza con la mirada. Antes del pincel, antes del lienzo, antes de cualquier técnica, está el acto de ver. Pero no cualquier tipo de ver: una mirada detenida, paciente, que se permite recorrer sin prisa.\n\nEn este primer módulo, vamos a entrenar esa capacidad. Vamos a aprender a detener el tiempo y a prestar atención a lo que normalmente pasamos por alto.',
      },
      {
        type: 'quote',
        quote: 'Ver es un acto político. Decidir en qué fijamos nuestra atención determina qué mundo construimos.',
        author: 'John Berger',
      },
      {
        type: 'text',
        title: 'El tiempo de la atención',
        body: 'Nuestro mundo está diseñado para la distracción. Las notificaciones, el scroll infinito, la velocidad. Pero el arte requiere lo contrario: lentitud, pausa, repetición.\n\nEl ejercicio de este módulo es simple en su formulación pero desafiante en su ejecución: mirar sin hacer. Solo eso. Sin buscar el ángulo perfecto para una foto, sin buscar la composición para un dibujo. Solo mirar, y dejar que la mirada haga su trabajo.',
      },
    ],
    resources: [
      { title: 'Ways of Seeing - John Berger', type: 'libro' },
      { title: 'El ojo del fotógrafo - Michael Freeman', type: 'libro' },
      { title: 'Guía de observación visual (PDF)', type: 'pdf' },
    ],
  },
  {
    id: 2,
    badge: 'MÓDULO 02',
    title: 'La composición y el equilibrio',
    description: 'Reglas para romperlas. Usar la geometría como punto de partida, y luego desplazar, recortar, equilibrar por instinto.',
    image: '/images/module02_bg.jpg',
    duration: '2 semanas',
    objectives: [
      'Comprender las reglas clásicas de composición',
      'Aprender a romperlas con intención',
      'Desarrollar el equilibrio por instinto',
    ],
    exercise: {
      title: 'Composición con restricciones',
      description: 'Crea 5 composiciones usando solo líneas horizontales y verticales. Luego, crea 5 más rompiendo esa regla. Documenta el proceso.',
      deadline: '03 de Noviembre 2026',
    },
    content: [
      {
        type: 'text',
        title: 'La regla de los tercios',
        body: 'La regla de los tercios es uno de los principios más conocidos de la composición visual. Consiste en dividir la imagen en nueve partes iguales usando dos líneas horizontales y dos verticales, y colocar los elementos importantes en las intersecciones o a lo largo de estas líneas.\n\nPero aquí está el secreto: las reglas están para ser comprendidas, no seguidas ciegamente.',
      },
      {
        type: 'text',
        title: 'El equilibrio asimétrico',
        body: 'El equilibrio no siempre significa simetría. A veces, una imagen puede sentirse equilibrada aunque los elementos no estén distribuidos uniformemente. El peso visual de los colores, las formas y las texturas juega un papel fundamental.',
      },
    ],
    resources: [
      { title: 'La composición en la pintura - Jacques Block', type: 'libro' },
      { title: 'Ejercicios de composición (PDF)', type: 'pdf' },
    ],
  },
  {
    id: 3,
    badge: 'MÓDULO 03',
    title: 'El color y su poética',
    description: 'El color no decora: dice. Cómo construir una paleta con intención, mantener la coherencia y dejar que el contraste cuente la historia.',
    image: '/images/module03_bg.jpg',
    duration: '2 semanas',
    objectives: [
      'Comprender la psicología del color',
      'Construir paletas con intención',
      'Usar el contraste como narrativa',
    ],
    exercise: {
      title: 'Paleta emocional',
      description: 'Elige una emoción (melancolía, alegría, ansiedad, paz) y crea una paleta de 5 colores que la represente. Justifica cada elección.',
      deadline: '17 de Noviembre 2026',
    },
    content: [
      {
        type: 'text',
        title: 'El color como lenguaje',
        body: 'El color es uno de los lenguajes más antiguos y universales. Antes de las palabras, estaban los colores: el rojo de la sangre, el azul del cielo, el verde de la vegetación.\n\nEn el arte, el color no es solo decorativo. Es narrativo. Es emocional. Es político.',
      },
    ],
    resources: [
      { title: 'Interacción del color - Josef Albers', type: 'libro' },
      { title: 'La psicología del color - Eva Heller', type: 'libro' },
    ],
  },
  {
    id: 4,
    badge: 'MÓDULO 04',
    title: 'La materia y la textura',
    description: 'Capas, impasto, transparencias. Cómo la textura modifica la luz y cómo la materia se convierte en narrativa.',
    image: '/images/module04_bg.jpg',
    duration: '2 semanas',
    objectives: [
      'Explorar diferentes técnicas de textura',
      'Comprender cómo la materia afecta la luz',
      'Usar la textura como elemento narrativo',
    ],
    exercise: {
      title: 'Mapa de texturas',
      description: 'Recorre tu barrio y documenta 10 texturas diferentes (fotografía + muestra física si es posible). Crea un collage que las relacione.',
      deadline: '01 de Diciembre 2026',
    },
    content: [
      {
        type: 'text',
        title: 'La superficie como historia',
        body: 'Cada capa de pintura cuenta una historia. El impasto habla de la urgencia del gesto. La transparencia revela lo que está debajo. La textura es memoria material.\n\nEn este módulo, vamos a explorar cómo la materia misma puede ser protagonista de la obra.',
      },
    ],
    resources: [
      { title: 'Técnicas de pintura - Max Doerner', type: 'libro' },
      { title: 'Materiales y técnicas del arte (PDF)', type: 'pdf' },
    ],
  },
  {
    id: 5,
    badge: 'MÓDULO 05',
    title: 'La forma y la abstracción',
    description: 'Simplificar sin perder la emoción. Ejercicios de reducción, ritmo y silencio para que la forma respire.',
    image: '/images/module05_bg.jpg',
    duration: '2 semanas',
    objectives: [
      'Aprender a simplificar formas complejas',
      'Mantener la emoción en la abstracción',
      'Crear ritmo visual',
    ],
    exercise: {
      title: 'De lo concreto a lo abstracto',
      description: 'Elige una fotografía de un objeto cotidiano. Crea 5 versiones, cada una más abstracta que la anterior, hasta llegar a la esencia.',
      deadline: '15 de Diciembre 2026',
    },
    content: [
      {
        type: 'text',
        title: 'La esencia de las cosas',
        body: 'La abstracción no es eliminar, es sintetizar. Es encontrar la esencia de las cosas y dejar que ella hable.\n\nEl desafío está en simplificar sin perder la emoción, en reducir sin quedar vacío.',
      },
    ],
    resources: [
      { title: 'Punto y línea sobre plano - Kandinsky', type: 'libro' },
      { title: 'El arte de la abstracción - Alfred Barr', type: 'libro' },
    ],
  },
  {
    id: 6,
    badge: 'MÓDULO 06',
    title: 'La luz y la atmósfera',
    description: 'La luz como protagonista. Cómo capturar la atmósfera, jugar con sombras y resplandores, y crear profundidad emocional.',
    image: '/images/module06_bg.jpg',
    duration: '2 semanas',
    objectives: [
      'Comprender la luz como elemento narrativo',
      'Capturar diferentes atmósferas',
      'Crear profundidad emocional',
    ],
    exercise: {
      title: 'Estudio de luz',
      description: 'Fotografía el mismo espacio a 5 momentos diferentes del día. Documenta cómo cambia la atmósfera con la luz.',
      deadline: '29 de Diciembre 2026',
    },
    content: [
      {
        type: 'text',
        title: 'La luz que todo lo revela',
        body: 'La luz es el protagonista invisible de toda imagen. Sin ella, no hay forma, no hay color, no hay espacio. Pero la luz no es solo física: es emocional, es simbólica.\n\nLa luz del amanecer no es la misma que la del atardecer. La luz de una lámpara no es la misma que la del sol.',
      },
    ],
    resources: [
      { title: 'La luz en la pintura - John Gage', type: 'libro' },
      { title: 'Atmósfera y luz (PDF)', type: 'pdf' },
    ],
  },
  {
    id: 7,
    badge: 'MÓDULO 07',
    title: 'La naturaleza como espejo',
    description: 'El paisaje interior y exterior. Aprender a leer la naturaleza como metáfora y traducirla en imágenes propias.',
    image: '/images/module07_bg.jpg',
    duration: '2 semanas',
    objectives: [
      'Leer el paisaje como metáfora',
      'Conectar naturaleza e interioridad',
      'Crear imágenes desde la experiencia',
    ],
    exercise: {
      title: 'Diario de paisaje',
      description: 'Visita el mismo lugar natural 3 veces en diferentes estados de ánimo. Documenta cómo tu percepción del lugar cambia.',
      deadline: '12 de Enero 2027',
    },
    content: [
      {
        type: 'text',
        title: 'El paisaje como espejo',
        body: 'Cuando miramos un paisaje, no vemos solo árboles y montañas. Vemos nuestro propio estado de ánimo reflejado. La naturaleza es un espejo que nos devuelve lo que llevamos dentro.\n\nAprender a leer el paisaje es aprender a leernos a nosotros mismos.',
      },
    ],
    resources: [
      { title: 'El paisaje en el arte - Kenneth Clark', type: 'libro' },
      { title: 'Naturaleza y cultura - Simon Schama', type: 'libro' },
    ],
  },
  {
    id: 8,
    badge: 'MÓDULO 08',
    title: 'La obra y su sentido',
    description: 'Del proceso al resultado. Cómo encontrar la intención detrás de cada obra y darle cierre sin perder la apertura.',
    image: '/images/module08_bg.jpg',
    duration: '2 semanas',
    objectives: [
      'Encontrar la intención de la obra',
      'Dar cierre al proceso creativo',
      'Mantener la apertura en la finalización',
    ],
    exercise: {
      title: 'Proyecto final',
      description: 'Crea una obra que sintetice todo lo aprendido en el curso. Incluye un texto reflexivo sobre tu proceso y descubrimientos.',
      deadline: '26 de Enero 2027',
    },
    content: [
      {
        type: 'text',
        title: 'El cierre como apertura',
        body: 'Terminar una obra es uno de los actos más difíciles del proceso creativo. ¿Cuándo está lista? ¿Cómo saber que es el momento de detenerse?\n\nEn este módulo final, vamos a reflexionar sobre el sentido de nuestras obras y a aprender a darles cierre sin cerrarlas del todo.',
      },
    ],
    resources: [
      { title: 'El arte de terminar - David Bayles', type: 'libro' },
      { title: 'Proyecto final - Guía (PDF)', type: 'pdf' },
    ],
  },
];

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected student routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireStudent>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/modulo/:moduleId" 
            element={
              <ProtectedRoute requireStudent requirePayment>
                <ModulePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pago-requerido" 
            element={
              <ProtectedRoute requireStudent>
                <PaymentRequired />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected professor routes */}
          <Route 
            path="/profesor/*" 
            element={
              <ProtectedRoute requireProfessor>
                <ProfessorDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </HashRouter>
      <Toaster />
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
