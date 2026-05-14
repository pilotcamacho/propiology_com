const prompts: { en: string; es: string }[] = [
  // Life Narrative (element 1)
  {
    en: 'What story about yourself are you most tempted to repeat today — and is it still true?',
    es: '¿Qué historia sobre ti mismo estás más tentado a repetir hoy — y sigue siendo verdad?',
  },
  {
    en: 'Which chapter of your life are you in right now, and who is the main character?',
    es: '¿En qué capítulo de tu vida estás ahora mismo, y quién es el personaje principal?',
  },
  {
    en: 'What belief from your past is limiting a possibility in your present?',
    es: '¿Qué creencia de tu pasado está limitando una posibilidad en tu presente?',
  },
  {
    en: 'If you could rewrite one line of your life story today, what would it say?',
    es: 'Si pudieras reescribir una línea de tu historia de vida hoy, ¿qué diría?',
  },
  {
    en: 'What event in your past are you still interpreting through an outdated lens?',
    es: '¿Qué evento de tu pasado sigues interpretando a través de una lente desactualizada?',
  },
  // Senses & Perception (element 2)
  {
    en: 'What are you noticing in your body right now that you usually ignore?',
    es: '¿Qué estás notando en tu cuerpo ahora mismo que generalmente ignoras?',
  },
  {
    en: 'Which cognitive bias showed up in your thinking today? What triggered it?',
    es: '¿Qué sesgo cognitivo apareció en tu pensamiento hoy? ¿Qué lo desencadenó?',
  },
  {
    en: 'What emotion visited you today that you did not fully acknowledge?',
    es: '¿Qué emoción te visitó hoy que no reconociste del todo?',
  },
  {
    en: 'When did you trust your perception today — and when should you have questioned it?',
    es: '¿Cuándo confiaste en tu percepción hoy — y cuándo deberías haberla cuestionado?',
  },
  {
    en: 'What are your senses telling you right now about your state of readiness?',
    es: '¿Qué te dicen tus sentidos ahora mismo sobre tu estado de disposición?',
  },
  // External World (element 3)
  {
    en: 'What in your environment is making it easier or harder to be your best self today?',
    es: '¿Qué en tu entorno está haciendo más fácil o más difícil ser tu mejor yo hoy?',
  },
  {
    en: 'Which external circumstance are you using as a reason to delay a change you want to make?',
    es: '¿Qué circunstancia externa estás usando como razón para retrasar un cambio que quieres hacer?',
  },
  {
    en: 'What news or conversation shaped your mood today, and how much power did you give it?',
    es: '¿Qué noticia o conversación moldeó tu estado de ánimo hoy, y cuánto poder le diste?',
  },
  {
    en: 'What one change to your physical space would improve your clarity tomorrow?',
    es: '¿Qué cambio en tu espacio físico mejoraría tu claridad mañana?',
  },
  {
    en: 'Who in your world reflects your values back at you — and who challenges them?',
    es: '¿Quién en tu mundo te refleja tus valores — y quién los desafía?',
  },
  // Body (element 4)
  {
    en: 'On a scale of 1–10, how well did you honor your body today? What held you back?',
    es: 'En una escala del 1 al 10, ¿qué tan bien honraste tu cuerpo hoy? ¿Qué te detuvo?',
  },
  {
    en: 'What physical signal is your body sending that you have been postponing to address?',
    es: '¿Qué señal física está enviando tu cuerpo que has estado postergando atender?',
  },
  {
    en: 'How did sleep, food, and movement shape your capacity to think and feel today?',
    es: '¿Cómo el sueño, la alimentación y el movimiento moldearon tu capacidad de pensar y sentir hoy?',
  },
  {
    en: 'What habit is your body asking you to protect most right now?',
    es: '¿Qué hábito te está pidiendo tu cuerpo que protejas más en este momento?',
  },
  {
    en: 'When did your body feel most alive today? What were you doing?',
    es: '¿Cuándo se sintió más vivo tu cuerpo hoy? ¿Qué estabas haciendo?',
  },
  // Behavior (element 5)
  {
    en: 'What decision today aligned with the person you are becoming? What did not?',
    es: '¿Qué decisión hoy estuvo alineada con la persona en quien te estás convirtiendo? ¿Cuál no?',
  },
  {
    en: 'Where did you act from fear today, and where did you act from values?',
    es: '¿Dónde actuaste desde el miedo hoy, y dónde actuaste desde tus valores?',
  },
  {
    en: 'What recurring behavior are you most proud of sustaining this week?',
    es: '¿Qué comportamiento recurrente te enorgullece más haber sostenido esta semana?',
  },
  {
    en: 'Name one small behavior you will change tomorrow. How will you make it stick?',
    es: 'Nombra un pequeño comportamiento que cambiarás mañana. ¿Cómo lo harás duradero?',
  },
  {
    en: 'What habit is costing you more than it is giving you right now?',
    es: '¿Qué hábito te está costando más de lo que te está dando en este momento?',
  },
  // Circle of Love (element 6)
  {
    en: 'Which relationship received your best energy today — and which one needed more?',
    es: '¿Qué relación recibió tu mejor energía hoy — y cuál necesitaba más?',
  },
  {
    en: 'How have you been showing up for yourself in your most important relationships?',
    es: '¿Cómo te has estado presentando para ti mismo en tus relaciones más importantes?',
  },
  {
    en: 'What conversation have you been avoiding that your Circle of Love needs you to have?',
    es: '¿Qué conversación has estado evitando que tu Círculo de Amor necesita que tengas?',
  },
  {
    en: 'What would the people who love you most say is your greatest strength right now?',
    es: '¿Qué dirían las personas que más te aman que es tu mayor fortaleza en este momento?',
  },
  {
    en: 'How does your relationship with yourself show up in your relationship with others today?',
    es: '¿Cómo se manifiesta hoy tu relación contigo mismo en tu relación con los demás?',
  },
  // Journey (general)
  {
    en: 'What stage of the Propiology journey feels most alive in you right now, and why?',
    es: '¿Qué etapa del camino Propiology se siente más viva en ti ahora mismo, y por qué?',
  },
];

export function promptOfTheDay(locale: 'en' | 'es' = 'en'): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  const entry = prompts[dayOfYear % prompts.length]!;
  return entry[locale];
}

export function promptByIndex(index: number, locale: 'en' | 'es' = 'en'): string {
  const entry = prompts[((index % prompts.length) + prompts.length) % prompts.length]!;
  return entry[locale];
}
