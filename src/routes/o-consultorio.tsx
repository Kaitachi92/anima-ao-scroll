import { createFileRoute } from '@tanstack/react-router';
import { SiteShell } from '@/components/site/site-shell';
import { PageIntro, ClinicSection, ContactSection, CtaBand } from '@/components/site/sections';
import { pageHead } from '@/lib/site-data';
export const Route = createFileRoute('/o-consultorio')({head:()=>pageHead('O consultório em Piracaia','Conheça o consultório da Dra. Rebeca Galdino em Piracaia. Veja a localização na Av. Jan Antonin Bata, 121, e entre em contato.'),component:Clinic});
function Clinic(){return <SiteShell><PageIntro eyebrow="O consultório" title="Um lugar para chegar e se sentir acolhido." description="Nosso atendimento acontece em Piracaia, na Av. Jan Antonin Bata, 121. Conheça o endereço e converse com o consultório antes da sua visita."/><ClinicSection full/><ContactSection/><CtaBand/></SiteShell>;}
