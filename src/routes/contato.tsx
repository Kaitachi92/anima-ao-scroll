import { createFileRoute } from '@tanstack/react-router';
import { SiteShell } from '@/components/site/site-shell';
import { PageIntro, ContactSection, Principles } from '@/components/site/sections';
import { pageHead } from '@/lib/site-data';
export const Route = createFileRoute('/contato')({head:()=>pageHead('Contato e agendamento em Piracaia','Agende sua consulta com a Dra. Rebeca Galdino pelo WhatsApp (11) 99651-4034. Endereço, e-mail e rota para o consultório em Piracaia — SP.'),component:Contact});
function Contact(){return <SiteShell><PageIntro eyebrow="Contato" title="Uma conversa é o primeiro passo." description="Para agendar uma consulta ou esclarecer dúvidas, fale diretamente com o consultório. A disponibilidade de horários é informada pela equipe."/><ContactSection/><Principles process/></SiteShell>;}
